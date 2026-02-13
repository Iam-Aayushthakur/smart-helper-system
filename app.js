/**
 * Smart Helper Auto-Assignment System - Frontend
 * Main application logic
 */

// Global state
let userLocation = null;
let currentBooking = null;

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Smart Helper System initialized');
    setupEventListeners();
    loadHelpersFromDatabase();
});

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Get location button
    document.getElementById('getLocationBtn').addEventListener('click', getCurrentLocation);

    // Booking form submission
    document.getElementById('bookingForm').addEventListener('submit', handleBooking);

    // New booking button
    document.getElementById('newBookingBtn').addEventListener('click', resetForm);
}

/**
 * Get user's current GPS location
 */
function getCurrentLocation() {
    const locationInput = document.getElementById('userLocation');
    
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    locationInput.value = 'Getting location...';
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: new Date()
            };
            
            locationInput.value = `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`;
            console.log('Location obtained:', userLocation);
            showSuccess(`Location found (accuracy: ${userLocation.accuracy.toFixed(0)}m)`);
        },
        (error) => {
            let errorMsg = 'Unable to get location';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg = 'Location permission denied. Please enable it in browser settings.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMsg = 'Location request timeout. Please try again.';
                    break;
            }
            showError(errorMsg);
            locationInput.value = 'Location unavailable';
        }
    );
}

/**
 * Handle booking form submission
 */
async function handleBooking(e) {
    e.preventDefault();

    // Validation
    if (!userLocation) {
        showError('Please get your location first');
        return;
    }

    const serviceType = document.getElementById('serviceType').value;
    const description = document.getElementById('description').value;

    if (!serviceType) {
        showError('Please select a service type');
        return;
    }

    // Show loading
    showLoading(true);

    try {
        // Call Firebase Cloud Function to assign helper
        const assignHelper = functions.httpsCallable('assignHelper');
        const result = await assignHelper({
            serviceType: serviceType,
            userLocation: userLocation,
            description: description
        });

        // Handle response
        currentBooking = result.data;
        displayBookingStatus(result.data);
        
    } catch (error) {
        console.error('Booking error:', error);
        showError(`Booking failed: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

/**
 * Display booking status
 */
function displayBookingStatus(booking) {
    const bookingForm = document.getElementById('bookingForm').parentElement;
    const statusSection = document.getElementById('statusSection');
    const statusContent = document.getElementById('statusContent');

    bookingForm.style.display = 'none';
    statusSection.style.display = 'block';

    // Build status HTML
    let statusHTML = '';

    if (booking.message) {
        statusHTML += `<div class="success-message">${booking.message}</div>`;
    }

    if (booking.error) {
        statusHTML += `<div class="warning-message">${booking.error}</div>`;
    } else if (booking.helper) {
        statusHTML += `
            <div class="status-box">
                <div class="status-item">
                    <span class="status-label">Helper Assigned:</span>
                    <span class="status-value">${booking.helper.name}</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Rating:</span>
                    <span class="status-value">⭐ ${booking.helper.rating}</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Skills:</span>
                    <span class="status-value">${booking.helper.skills.join(', ')}</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Distance:</span>
                    <span class="status-value">${booking.distance.toFixed(2)} km</span>
                </div>
                <div class="status-item">
                    <span class="status-label">ETA:</span>
                    <span class="status-value">${booking.eta} minutes</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Booking ID:</span>
                    <span class="status-value">${booking.bookingId}</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Status:</span>
                    <span class="status-value" style="color: #4caf50; font-weight: bold;">
                        ${booking.status.toUpperCase()}
                    </span>
                </div>
            </div>
            <p style="margin-top: 20px; color: #666; text-align: center;">
                ✓ Helper has been notified and is on the way!
            </p>
        `;
    }

    statusContent.innerHTML = statusHTML;
}

/**
 * Reset form and go back to booking
 */
function resetForm() {
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingForm').parentElement.style.display = 'block';
    document.getElementById('statusSection').style.display = 'none';
    document.getElementById('userLocation').value = '';
    userLocation = null;
    currentBooking = null;
    clearMessages();
}

/**
 * Load helpers from Firestore and display in simulator
 */
async function loadHelpersFromDatabase() {
    try {
        const helpersSnapshot = await db.collection('helpers')
            .where('status', '==', 'available')
            .get();

        const helperList = document.getElementById('helperList');
        helperList.innerHTML = '';

        if (helpersSnapshot.empty) {
            helperList.innerHTML = '<p style="color: #666;">No helpers available in database. Add some to test the system.</p>';
            return;
        }

        helpersSnapshot.forEach(doc => {
            const helper = doc.data();
            const helperCard = document.createElement('div');
            helperCard.className = 'helper-card';
            helperCard.innerHTML = `
                <div class="helper-info">
                    <h4>${helper.name}</h4>
                    <p>Skills: ${helper.skills.join(', ')}</p>
                    <p>Status: <strong>${helper.status}</strong></p>
                </div>
                <div class="helper-rating">⭐ ${helper.rating}</div>
            `;
            helperList.appendChild(helperCard);
        });

    } catch (error) {
        console.error('Error loading helpers:', error);
    }
}

/**
 * Utility: Show loading indicator
 */
function showLoading(show) {
    document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
}

/**
 * Utility: Show error message
 */
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    clearMessages(['error']);
}

/**
 * Utility: Show success message
 */
function showSuccess(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = '✓ ' + message;
    errorElement.style.backgroundColor = '#d4edda';
    errorElement.style.color = '#155724';
    errorElement.style.display = 'block';
    clearMessages(['error']);
}

/**
 * Utility: Clear messages after 5 seconds (except on error)
 */
function clearMessages(types = ['error', 'success']) {
    setTimeout(() => {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement.style.display === 'block') {
            errorElement.style.display = 'none';
        }
    }, 5000);
}

/**
 * Utility: Calculate distance using Haversine formula
 * (For reference - actual calculation done on backend)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const r = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return 2 * r * Math.asin(Math.sqrt(a));
}

// Periodically refresh helper list
setInterval(loadHelpersFromDatabase, 10000); // Every 10 seconds
