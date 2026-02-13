# Backend Setup Guide

## Firebase Cloud Functions

This guide covers setting up and deploying the backend Cloud Functions for the Smart Helper System.

## Prerequisites

1. Node.js (v18 or higher)
2. Firebase CLI: `npm install -g firebase-tools`
3. Firebase project created at [console.firebase.google.com](https://console.firebase.google.com)

## Installation Steps

### 1. Initialize Firebase in Your Project

```bash
firebase login
firebase init functions
```

Choose:
- **JavaScript** for language
- **Y** for ESLint
- **N** to overwrite index.js if prompted

### 2. Install Dependencies

Navigate to the functions directory and install dependencies:

```bash
cd functions
npm install
```

### 3. Update `index.js`

The `index.js` file contains all Cloud Functions. It's already provided in this repository.

Key functions:
- `assignHelper` - Main function for assigning helpers
- `updateHelperLocation` - Update helper GPS location
- `completeBooking` - Mark booking as complete
- `getBooking` - Retrieve booking details

### 4. Test Locally with Emulator

```bash
firebase emulators:start
```

This will start:
- **Firestore Emulator** (localhost:8080)
- **Cloud Functions Emulator** (localhost:5001)
- **Emulator UI** (localhost:4000)

To use the emulator in your frontend, uncomment this in `firebase-config.js`:

```javascript
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    db.useEmulator('localhost', 8080);
    functions.useEmulator('localhost', 5001);
}
```

### 5. Deploy to Firebase

```bash
firebase deploy --only functions
```

This deploys all functions to your Firebase project.

Monitor deployment:
```bash
firebase functions:log
```

## Cloud Functions Overview

### `assignHelper(data, context)`

**Called by**: Frontend booking form

**Parameters**:
```javascript
{
  serviceType: "cleaning",           // Service requested
  userLocation: {                    // User's GPS location
    lat: 40.7128,
    lng: -74.0060
  },
  description: "Deep clean apartment"
}
```

**Returns**:
```javascript
{
  message: "John is on the way!",
  helper: {
    name: "John Smith",
    rating: 4.8,
    skills: ["cleaning", "cooking"]
  },
  bookingId: "booking_123",
  distance: 2.5,                    // km
  eta: 10,                          // minutes
  status: "assigned"
}
```

**Logic**:
1. Query all available helpers with matching skills
2. Calculate distances using Haversine formula
3. Sort by distance (nearest first), then rating (highest first)
4. Assign the best helper
5. Set 30-second timeout for auto-reassignment if needed

### `updateHelperLocation(data, context)`

**Called by**: Helper device/app

**Parameters**:
```javascript
{
  helperId: "helper_123",
  location: {
    lat: 40.7150,
    lng: -74.0060
  }
}
```

**Returns**:
```javascript
{ success: true, message: "Location updated" }
```

### `completeBooking(data, context)`

**Called by**: After service completion

**Parameters**:
```javascript
{
  bookingId: "booking_123",
  rating: 5                         // 1-5 stars
}
```

**Returns**:
```javascript
{ success: true, message: "Booking completed" }
```

**Side effects**:
- Marks booking as "completed"
- Sets helper status back to "available"
- Stores customer rating

### `getBooking(data, context)`

**Called by**: To check booking status

**Parameters**:
```javascript
{
  bookingId: "booking_123"
}
```

**Returns**: Complete booking document with all details

## Database Rules

### Development (Firestore Rules)

For local testing and development, use permissive rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Production (Firestore Rules)

For a production app, implement proper security:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read their own bookings
    match /bookings/{document=**} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null;
      allow update: if request.auth.uid == resource.data.userId;
    }

    // Helpers can read their assigned bookings
    match /helpers/{helperId} {
      allow read: if request.auth.uid == helperId;
      allow write: if request.auth.uid == helperId;
    }

    // Public read access to read helper skills/ratings
    match /helpers/{document=**} {
      allow list, get: if true;
    }
  }
}
```

## Monitoring and Debugging

### View Logs

```bash
firebase functions:log
```

### Test Functions Interactively

```bash
firebase functions:shell
> assignHelper({serviceType: 'cleaning', userLocation: {lat: 40.7128, lng: -74.0060}})
```

### Firebase Console

Monitor functions at: https://console.firebase.google.com/project/YOUR_PROJECT/functions

## Common Issues

### "Billing Required"

Firebase Functions free tier includes:
- 2M function invocations/month
- 400,000 GB-seconds/month

For more, enable billing in Firebase Console.

### "Firestore Not Initialized"

Ensure Firestore Database is enabled in Firebase > Firestore Database section.

### "Function Timeout"

Default timeout is 60 seconds. Increase in `firebase.json`:

```json
{
  "functions": {
    "memory": "256MB",
    "timeoutSeconds": 120
  }
}
```

### "Permissions Error During Deployment"

Run: `firebase login --reauth`

## Next Steps

1. Deploy functions: `firebase deploy --only functions`
2. Test with frontend: Open `frontend/index.html`
3. Add sample helpers to Firestore
4. Submit a booking and monitor logs
5. Implement auto-reassignment logic refinements
6. Add real-time Firestore listeners for status updates

## Resources

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Cloud Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)
