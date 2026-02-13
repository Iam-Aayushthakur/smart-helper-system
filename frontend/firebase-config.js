/**
 * Firebase Configuration File
 * 
 * TODO: Replace with your Firebase project credentials
 * Get these from: https://console.firebase.google.com/
 * 
 * Steps:
 * 1. Create a new Firebase project
 * 2. Go to Project Settings > Your Apps > Web
 * 3. Copy the config object below and replace with your credentials
 */

const firebaseConfig = {
  apiKey: "REMOVED_FROM_HISTORY",
  authDomain: "smart-helper-system.firebaseapp.com",
  projectId: "smart-helper-system",
  storageBucket: "smart-helper-system.firebasestorage.app",
  messagingSenderId: "968723173025",
  appId: "1:968723173025:web:c746d747309ab4d5b6ae0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to Firestore and Functions
const db = firebase.firestore();
const functions = firebase.functions();

// Optional: Use Firebase Emulator for local development
// Uncomment the lines below and ensure emulators are running
/*
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    db.useEmulator('localhost', 8080);
    functions.useEmulator('localhost', 5001);
    console.log('Using Firebase Emulators');
}
*/

console.log('Firebase initialized successfully!');
