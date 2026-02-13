# Quick Start Guide

Get the Smart Helper System running in 15 minutes!

## Prerequisites

- Node.js (v18+) installed
- Firebase account (free)
- Modern web browser
- Git (optional)

## Step 1: Firebase Project Setup (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: `smart-helper-system`
4. Click "Create project"
5. Wait for creation to complete

## Step 2: Enable Firebase Services (3 minutes)

**Enable Firestore Database:**
1. Left sidebar > Firestore Database
2. Click "Create database"
3. Start in **Test mode** (for development)
4. Location: Choose nearest region
5. Click "Enable"

**Get Firebase Configuration:**
1. Project Settings (⚙️ icon top-left)
2. Your Apps > Add App > Web
3. Click on the Web app
4. Copy the config object

## Step 3: Configure Frontend (2 minutes)

1. Open `frontend/firebase-config.js`
2. Replace the config object with your Firebase credentials
3. Save the file

Example:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDxxx...",
    authDomain: "smart-helper-abc.firebaseapp.com",
    projectId: "smart-helper-abc",
    storageBucket: "smart-helper-abc.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

## Step 4: Add Sample Data (3 minutes)

1. In Firebase Console, go to Firestore Database
2. Click "Start collection"
3. Collection ID: `helpers`
4. Add first document with ID: `helper1`
5. Add these fields:

```
name (string): John Smith
skills (array): ["cleaning", "cooking"]
rating (number): 4.8
status (string): available
location (map):
  lat (number): 40.7128
  lng (number): -74.0060
lastUpdated (timestamp): [current time]
```

Add another helper (ID: `helper2`):
```
name (string): Sarah Johnson
skills (array): ["cooking", "repair"]
rating (number): 4.9
status (string): available
location (map):
  lat (number): 40.7200
  lng (number): -74.0100
lastUpdated (timestamp): [current time]
```

## Step 5: Run the Application (5 minutes)

**Option A: Using Live Server (Easiest)**

```bash
# Install live-server if not installed
npm install -g live-server

# Navigate to frontend folder
cd "d:\Lpu class work\sem2\hackathon project\frontend"

# Start server
live-server
```

Browser opens at: `http://localhost:8080`

**Option B: Using File Server**

Simply open `frontend/index.html` in your browser (less functionality, but works for testing forms)

## Step 6: Test the System

1. In the browser, click "Get Current Location"
   - Browser will ask for permission
   - Click "Allow"
   
2. Select a service: `Cleaning`

3. Add description: `Clean my apartment`

4. Click "Book Now"

5. You should see:
   - Loading spinner
   - Success message with "John Smith" assigned
   - Booking details displayed

## Troubleshooting

### "Location not available"
- Check browser location permissions (not HTTPS on localhost is fine)
- Try a different browser
- Check if location services are enabled on your OS

### "No helpers available"
- Check Firebase Firestore console
- Verify helpers document has `status: "available"`
- Verify helpers has `skills` array with matching service type

### "Firebase not initialized"
- Check browser console (F12 > Console)
- Verify `firebase-config.js` has correct credentials
- Ensure Firestore Database is enabled in Firebase

### My location shows "0, 0"
- Wait a moment for geolocation to retrieve GPS data
- Check that browser has location permission in browser settings

## Next Steps

✅ **Completed**: Basic frontend and database

📋 **Next**: 
1. Deploy Cloud Functions to Firebase
2. Implement helper dashboard
3. Add real-time status updates
4. Deploy frontend to GitHub Pages
5. Test with multiple users

### To Deploy Cloud Functions

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Navigate to backend
cd backend

# Install dependencies
cd functions
npm install

# Deploy functions (from project root)
cd ../..
firebase deploy --only functions
```

### To Deploy to GitHub Pages

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial Smart Helper System"

# Create GitHub repo (go to github.com and create repo)
git remote add origin https://github.com/yourusername/smart-helper-system.git
git branch -M main
git push -u origin main

# Enable GitHub Pages in repo Settings > Pages
# Source: main branch, /frontend folder
```

Then visit: `https://yourusername.github.io/smart-helper-system`

## Key Files

- `frontend/index.html` - Main booking page
- `frontend/app.js` - Application logic
- `frontend/firebase-config.js` - **Update with your Firebase credentials**
- `frontend/styles.css` - Styling
- `backend/functions/index.js` - Cloud Functions (deploy to Firebase)
- `docs/DATABASE_SCHEMA.md` - Full database structure

## Support Resources

- 📚 [Firebase Docs](https://firebase.google.com/docs)
- 🗺️ [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- 💬 [Stack Overflow - Firebase Tag](https://stackoverflow.com/questions/tagged/firebase)

---

**You're now ready to use the Smart Helper System!** 🚀

Got stuck? Check the main README.md for more detailed instructions.
