# Smart Helper Auto-Assignment System 🚀

A real-time helper assignment system that automatically matches users with the nearest available helper based on skills, location, and ratings.

## Project Structure

```
hackathon project/
├── frontend/                 # Web application (HTML/CSS/JS)
│   ├── index.html           # Main booking page
│   ├── styles.css           # Styling
│   ├── app.js               # Frontend logic
│   └── firebase-config.js   # Firebase configuration
├── backend/                 # Cloud Functions and server logic
│   └── functions/           # Firebase Cloud Functions
├── docs/                    # Documentation
└── README.md               # This file
```

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase Cloud Functions (Node.js)
- **Database**: Firebase Firestore
- **Location**: Browser Geolocation API / Google Maps
- **Hosting**: GitHub Pages (Frontend) + Firebase (Backend)

## Quick Start

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable:
   - Firestore Database (Start in test mode for development)
   - Authentication (Optional for this MVP)
   - Cloud Functions
   - Cloud Hosting

4. Get your Firebase config:
   - Project Settings > Your Apps > Web App
   - Copy the config object

5. Update `frontend/firebase-config.js` with your credentials

### 2. Database Setup (Firestore)

Create these collections and sample documents:

**Collection: `helpers`**
```json
{
  "name": "John Smith",
  "skills": ["cleaning", "cooking"],
  "rating": 4.8,
  "status": "available",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "lastUpdated": "2026-02-13T10:30:00Z"
}
```

**Collection: `bookings`**
```json
{
  "userId": "user123",
  "serviceType": "cleaning",
  "userLocation": {
    "lat": 40.7150,
    "lng": -74.0060
  },
  "assignedHelperId": "helper1",
  "status": "assigned",
  "timestamp": "2026-02-13T10:25:00Z",
  "eta": 15
}
```

### 3. Running Locally

**Option A: Using Firebase Emulator (Recommended for Development)**

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Start emulators
firebase emulators:start
```

Then open `frontend/index.html` in your browser and uncomment the emulator lines in `firebase-config.js`.

**Option B: Using Live Server**

```bash
# Install live-server
npm install -g live-server

# Navigate to frontend folder
cd frontend

# Start server
live-server
```

Access at: `http://localhost:8080`

### 4. Testing the System

1. Add sample helpers to Firestore (use Firebase Console)
2. Open the booking form
3. Click "Get Current Location"
4. Select a service type
5. Click "Book Now"
6. The system will find the nearest available helper

## Key Features

- ✅ Real-time geolocation detection
- ✅ Intelligent helper matching (distance + rating)
- ✅ Auto-reassignment on rejection
- ✅ Smart ETA calculation
- ✅ Responsive design (mobile-friendly)
- ✅ Helper simulator for testing

## Next Steps

### Phase 1 (Current): MVP
- [x] Basic frontend UI
- [x] Geolocation integration
- [x] Firebase configuration
- [ ] Backend Cloud Functions (assignment logic)
- [ ] Real-time status updates
- [ ] Error handling

### Phase 2: Enhancement
- [ ] Helper dashboard (update location/status)
- [ ] Notifications (FCM)
- [ ] User authentication
- [ ] Payment integration
- [ ] Rating system
- [ ] Chat feature

### Phase 3: Production
- [ ] Backend optimization
- [ ] Security hardening
- [ ] GDPR compliance
- [ ] Load testing
- [ ] Mobile app (React Native)
- [ ] Custom domain setup

## Deploying to GitHub Pages

1. Create a GitHub repository
2. Push frontier code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Smart Helper System"
   git push -u origin main
   ```

3. In repo Settings > Pages:
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /frontend

4. Your site will be live at: `https://yourusername.github.io/smart-helper-system`

## Firebase Cloud Functions

The backend needs a Cloud Function to handle helper assignment:

**`functions/index.js` (to be created)**

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.assignHelper = functions.https.onCall(async (data, context) => {
    // Assignment logic here
    // Calculate distances
    // Find best match
    // Update status
    // Return confirmation
});
```

Deploy with:
```bash
firebase deploy --only functions
```

## Common Issues

### "Geolocation not working"
- Ensure HTTPS (or localhost)
- Check browser permissions
- Allow location access in site settings

### "Firebase not initialized"
- Check firebase-config.js has valid credentials
- Ensure Firebase CDN is loaded
- Check browser console for errors

### "No helpers found"
- Add sample helpers to Firestore first
- Check helpers status is "available"
- Verify database rules allow read access

## Database Rules (Firestore)

For development (NOT for production):
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

For production, implement proper authentication and authorization.

## Additional Resources

- 📚 [Firebase Documentation](https://firebase.google.com/docs)
- 🗺️ [Google Maps API](https://developers.google.com/maps)
- 🌐 [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)
- 📱 [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

## License

MIT License - Feel free to use this for your hackathon!

## Support

For issues or questions, check:
1. Firebase Console Logs
2. Browser Developer Console (F12)
3. Network tab for API calls
4. Firestore data explorer

---

**Made with ❤️ for the Smart Helper Hackathon**
