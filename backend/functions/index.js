/**
 * Firebase Cloud Functions for Smart Helper Auto-Assignment System
 * 
 * Deploy with: firebase deploy --only functions
 * Test locally with: firebase emulators:start
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - User latitude
 * @param {number} lng1 - User longitude
 * @param {number} lat2 - Helper latitude
 * @param {number} lng2 - Helper longitude
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const r = 6371; // Earth's radius in km
    const toRad = Math.PI / 180;
    const dLat = (lat2 - lat1) * toRad;
    const dLng = (lng2 - lng1) * toRad;
    
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) ** 2;
    
    return 2 * r * Math.asin(Math.sqrt(a));
}

/**
 * Main function: Assign helper to booking
 * Called when user submits booking form
 */
exports.assignHelper = functions.https.onCall(async (data, context) => {
    try {
        const { serviceType, userLocation, description } = data;

        // Validate input
        if (!serviceType || !userLocation || !userLocation.lat || !userLocation.lng) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Missing required booking information'
            );
        }

        // Query available helpers with matching skills
        const helpersSnapshot = await db.collection('helpers')
            .where('status', '==', 'available')
            .where('skills', 'array-contains', serviceType)
            .get();

        if (helpersSnapshot.empty) {
            return {
                message: 'No helpers available at the moment.',
                error: 'Try booking again in a few minutes.',
                helper: null,
                bookingId: null,
                status: 'no-helpers'
            };
        }

        // Calculate distances and sort by distance then rating
        let candidates = [];
        helpersSnapshot.forEach(doc => {
            const helper = doc.data();
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                helper.location.lat,
                helper.location.lng
            );
            candidates.push({
                id: doc.id,
                name: helper.name,
                skills: helper.skills,
                rating: helper.rating,
                status: helper.status,
                location: helper.location,
                distance: distance
            });
        });

        // Sort by distance (ascending) then rating (descending)
        candidates.sort((a, b) => {
            if (a.distance !== b.distance) {
                return a.distance - b.distance;
            }
            return b.rating - a.rating;
        });

        // Assign the best helper
        const bestHelper = candidates[0];
        const eta = Math.ceil(bestHelper.distance * 4); // Rough estimate: 15 km/hr

        // Update helper status to busy
        await db.collection('helpers').doc(bestHelper.id).update({
            status: 'busy',
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });

        // Create booking document
        const bookingRef = await db.collection('bookings').add({
            userId: context.auth?.uid || 'anonymous',
            serviceType: serviceType,
            description: description,
            userLocation: userLocation,
            assignedHelperId: bestHelper.id,
            assignedHelperName: bestHelper.name,
            status: 'assigned',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            eta: eta,
            distance: bestHelper.distance
        });

        // Set up auto-reassignment timer (30 seconds)
        // In production, use Cloud Tasks for reliability
        setTimeout(() => {
            checkAndReassign(bookingRef.id, serviceType, userLocation, candidates, 1);
        }, 30000);

        console.log(`Booking created: ${bookingRef.id}, Helper: ${bestHelper.name}`);

        return {
            message: `${bestHelper.name} is on the way!`,
            helper: {
                name: bestHelper.name,
                rating: bestHelper.rating,
                skills: bestHelper.skills
            },
            bookingId: bookingRef.id,
            distance: bestHelper.distance,
            eta: eta,
            status: 'assigned'
        };

    } catch (error) {
        console.error('Assignment error:', error);
        throw new functions.https.HttpsError(
            'internal',
            'Failed to assign helper: ' + error.message
        );
    }
});

/**
 * Auto-reassign helper if current one rejects or doesn't respond
 * @param {string} bookingId - Current booking ID
 * @param {string} serviceType - Service type
 * @param {object} userLocation - User location
 * @param {array} candidates - Available candidates
 * @param {number} attemptIndex - Current attempt index
 */
async function checkAndReassign(bookingId, serviceType, userLocation, candidates, attemptIndex) {
    try {
        // Get current booking status
        const bookingDoc = await db.collection('bookings').doc(bookingId).get();
        
        if (!bookingDoc.exists) {
            console.log('Booking not found:', bookingId);
            return;
        }

        const booking = bookingDoc.data();

        // If status changed (accepted or completed), don't reassign
        if (booking.status !== 'assigned') {
            console.log('Booking status changed, no reassignment needed');
            return;
        }

        // Try next candidate
        if (attemptIndex < candidates.length) {
            const nextHelper = candidates[attemptIndex];
            const helper = await db.collection('helpers').doc(nextHelper.id).get();

            if (helper.exists && helper.data().status === 'available') {
                // Reassign to next helper
                await db.collection('helpers').doc(nextHelper.id).update({
                    status: 'busy'
                });

                await db.collection('bookings').doc(bookingId).update({
                    assignedHelperId: nextHelper.id,
                    assignedHelperName: nextHelper.name,
                    eta: Math.ceil(nextHelper.distance * 4),
                    distance: nextHelper.distance,
                    reassignmentCount: (booking.reassignmentCount || 0) + 1,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });

                console.log(`Reassigned to: ${nextHelper.name}`);

                // Set another timeout for next attempt
                setTimeout(() => {
                    checkAndReassign(bookingId, serviceType, userLocation, candidates, attemptIndex + 1);
                }, 30000);
            } else {
                // This helper is no longer available, try next
                checkAndReassign(bookingId, serviceType, userLocation, candidates, attemptIndex + 1);
            }
        } else {
            // No more candidates
            await db.collection('bookings').doc(bookingId).update({
                status: 'no-helpers-available',
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('No more helpers available');
        }

    } catch (error) {
        console.error('Reassignment error:', error);
    }
}

/**
 * Update helper location (called by helper's device)
 */
exports.updateHelperLocation = functions.https.onCall(async (data, context) => {
    try {
        const { helperId, location } = data;

        if (!helperId || !location || !location.lat || !location.lng) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Missing helper ID or location'
            );
        }

        await db.collection('helpers').doc(helperId).update({
            location: location,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, message: 'Location updated' };

    } catch (error) {
        console.error('Location update error:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

/**
 * Complete a booking
 */
exports.completeBooking = functions.https.onCall(async (data, context) => {
    try {
        const { bookingId, rating } = data;

        // Update booking status
        await db.collection('bookings').doc(bookingId).update({
            status: 'completed',
            rating: rating,
            completedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Get booking to update helper status
        const booking = await db.collection('bookings').doc(bookingId).get();
        const bookingData = booking.data();

        // Update helper status back to available
        await db.collection('helpers').doc(bookingData.assignedHelperId).update({
            status: 'available',
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, message: 'Booking completed' };

    } catch (error) {
        console.error('Complete booking error:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

/**
 * Get booking details
 */
exports.getBooking = functions.https.onCall(async (data, context) => {
    try {
        const { bookingId } = data;

        const booking = await db.collection('bookings').doc(bookingId).get();

        if (!booking.exists) {
            throw new functions.https.HttpsError('not-found', 'Booking not found');
        }

        return booking.data();

    } catch (error) {
        console.error('Get booking error:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

console.log('Cloud Functions loaded successfully');
