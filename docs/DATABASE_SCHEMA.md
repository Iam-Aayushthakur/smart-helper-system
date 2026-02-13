# Database Schema Documentation

## Firestore Collections

### 1. `users` Collection

Stores information about users who request services.

**Document ID**: Auto-generated or user's UID from Firebase Auth

**Fields**:
```javascript
{
  userId: "user_123",              // Unique user identifier
  name: "Alice Johnson",           // User's full name
  email: "alice@example.com",      // Email address
  phone: "+1-555-0123",            // Phone number
  location: {                      // Last known location
    lat: 40.7128,
    lng: -74.0060
  },
  createdAt: timestamp,            // Account creation time
  updatedAt: timestamp,            // Last profile update
  totalBookings: 5,                // Statistics
  averageRating: 4.7,              // Average rating from helpers
  status: "active"                 // "active" or "inactive"
}
```

### 2. `helpers` Collection

Stores information about helpers providing services.

**Document ID**: Auto-generated or helper's UID from Firebase Auth

**Fields**:
```javascript
{
  helperId: "helper_123",          // Unique helper identifier
  name: "John Smith",              // Helper's full name
  email: "john@example.com",       // Email address
  phone: "+1-555-0456",            // Phone number
  skills: [                        // Array of service types
    "cleaning",
    "cooking",
    "laundry"
  ],
  rating: 4.8,                     // Average rating (1-5)
  totalReviews: 42,                // Number of reviews
  location: {                      // Current location (GPS)
    lat: 40.7150,
    lng: -74.0060,
    accuracy: 10                  // GPS accuracy in meters
  },
  status: "available",             // "available" or "busy"
  lastUpdated: timestamp,          // Last location/status update
  hourlyRate: 25,                  // Service rate ($)
  experience: "3 years",           // Professional experience
  documents: {                     // Verification documents
    idVerified: true,
    backgroundCheckDone: true
  },
  createdAt: timestamp,            // Account creation time
  updatedAt: timestamp             // Last profile update
}
```

### 3. `bookings` Collection

Stores all service bookings and their statuses.

**Document ID**: Auto-generated

**Fields**:
```javascript
{
  bookingId: "booking_123",        // Unique booking identifier
  userId: "user_123",              // Reference to user
  assignedHelperId: "helper_123",  // Assigned helper
  assignedHelperName: "John Smith",// Helper's name (cached)
  
  // Service details
  serviceType: "cleaning",         // Type of service
  description: "Deep clean apartment",
  specialRequests: "Hypoallergenic products only",
  
  // Locations
  userLocation: {
    lat: 40.7128,
    lng: -74.0060,
    address: "123 Main St, New York, NY"
  },
  helperStartLocation: {           // Helper's location when assigned
    lat: 40.7150,
    lng: -74.0060
  },
  
  // Status tracking
  status: "assigned",              // "pending", "assigned", "accepted", 
                                   // "in-progress", "completed", "cancelled"
  
  // Timing
  requestedTime: timestamp,        // When user requested
  createdAt: timestamp,            // Booking creation
  acceptedAt: timestamp,           // When helper accepted
  startedAt: timestamp,            // Service start time
  completedAt: timestamp,          // Service completion time
  
  // ETA and distance
  distance: 2.5,                   // km from helper to user
  eta: 10,                         // Estimated time in minutes
  actualDuration: 45,              // Actual service duration (minutes)
  
  // Cost
  estimatedCost: 50,               // Estimated cost ($)
  actualCost: 55,                  // Actual cost ($)
  paymentStatus: "pending",        // "pending", "paid"
  paymentMethod: "card",           // "card", "cash", "wallet"
  
  // Ratings and feedback
  helperRating: 5,                 // Rating by user (1-5)
  userRating: 4,                   // Rating by helper (1-5)
  helperReview: "Very professional and thorough",
  userReview: "Great service, arrived on time",
  
  // Reassignment tracking
  reassignmentCount: 0,            // Number of reassignments
  rejectionReasons: [],            // Array of rejection reasons
  
  updatedAt: timestamp             // Last update
}
```

### 4. `ratings` Collection (Optional)

Stores detailed ratings and reviews.

**Document ID**: Auto-generated

**Fields**:
```javascript
{
  bookingId: "booking_123",        // Reference to booking
  fromUserId: "user_123",          // Who rated
  toHelperId: "helper_123",        // Who was rated
  rating: 5,                       // 1-5 stars
  category: {
    professionalism: 5,
    communication: 4,
    cleanliness: 5,
    punctuality: 5
  },
  review: "Excellent service!",
  createdAt: timestamp,
  helpful: 12,                     // Number of people who found helpful
  flagged: false                   // Flagged for review
}
```

### 5. `messages` Collection (Optional)

For real-time messaging between users and helpers.

**Document ID**: Auto-generated

**Fields**:
```javascript
{
  bookingId: "booking_123",
  from: "helper_123",
  to: "user_123",
  message: "I'm 5 minutes away!",
  messageType: "text",             // "text", "image", "location"
  attachments: [],                 // URLs if applicable
  read: false,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Indexes Required

For optimal query performance, create these Firestore indexes:

### Composite Indexes

1. **For finding available helpers with skills**:
   - Collection: `helpers`
   - Fields: `status` (Ascending), `skills` (Descending)

2. **For getting user bookings sorted by date**:
   - Collection: `bookings`
   - Fields: `userId` (Ascending), `createdAt` (Descending)

3. **For getting helper's active bookings**:
   - Collection: `bookings`
   - Fields: `assignedHelperId` (Ascending), `status` (Ascending)

You can create these indexes:
1. Let Firebase auto-create them when you run queries
2. Manually create them in Firebase Console > Firestore Database > Indexes

## Data Access Patterns

### 1. Find available helpers for a service

```firestore
db.collection('helpers')
  .where('status', '==', 'available')
  .where('skills', 'array-contains', 'cleaning')
  .get()
```

### 2. Get user's booking history

```firestore
db.collection('bookings')
  .where('userId', '==', 'user_123')
  .orderBy('createdAt', 'desc')
  .get()
```

### 3. Get helper's assigned bookings

```firestore
db.collection('bookings')
  .where('assignedHelperId', '==', 'helper_123')
  .where('status', '!=', 'completed')
  .get()
```

### 4. Get recent ratings for a helper

```firestore
db.collection('ratings')
  .where('toHelperId', '==', 'helper_123')
  .orderBy('createdAt', 'desc')
  .limit(10)
  .get()
```

### 5. Real-time booking status updates

```firestore
db.collection('bookings')
  .doc('booking_123')
  .onSnapshot(doc => {
    console.log('Booking updated:', doc.data());
  })
```

## Sample Data for Testing

### Sample Helper Document

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1-555-0100",
  "skills": ["cleaning", "cooking", "laundry"],
  "rating": 4.8,
  "totalReviews": 42,
  "status": "available",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "accuracy": 10
  },
  "hourlyRate": 25,
  "experience": "3 years",
  "documents": {
    "idVerified": true,
    "backgroundCheckDone": true
  },
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-02-13T14:15:00Z"
}
```

### Sample User Document

```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+1-555-0200",
  "location": {
    "lat": 40.7150,
    "lng": -74.0060
  },
  "totalBookings": 5,
  "averageRating": 4.7,
  "status": "active",
  "createdAt": "2026-01-20T09:45:00Z",
  "updatedAt": "2026-02-10T11:20:00Z"
}
```

### Sample Booking Document

```json
{
  "userId": "user_123",
  "assignedHelperId": "helper_123",
  "assignedHelperName": "John Smith",
  "serviceType": "cleaning",
  "description": "Deep clean apartment",
  "userLocation": {
    "lat": 40.7150,
    "lng": -74.0060,
    "address": "456 Park Ave, New York, NY"
  },
  "status": "assigned",
  "distance": 2.5,
  "eta": 10,
  "estimatedCost": 75,
  "createdAt": "2026-02-13T10:25:00Z",
  "updatedAt": "2026-02-13T10:30:00Z"
}
```

## Migration Notes

If moving from another backend:
1. Export data as JSON
2. Import using Firebase Console > Firestore Database > Manage
3. Update Cloud Functions as needed
4. Test thoroughly before production

## Backup Strategy

1. Enable automated backups in Firebase Console
2. Export collections periodically:
   ```bash
   firebase firestore:delete --recursive --all-collections
   firebase firestore:import ./backup.json
   ```

3. Consider Cloud Storage for document backups

## Security Considerations

- Store sensitive data (SSN, payment info) encrypted
- Never store passwords in Firestore
- Use Firebase Auth for user management
- Implement proper Firestore security rules
- Audit access logs regularly
- GDPR: Implement data deletion endpoints
