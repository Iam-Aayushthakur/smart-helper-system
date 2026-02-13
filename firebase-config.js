/**
 * Firebase Configuration File
 *
 * SECURITY: Do NOT commit real credentials to the repository.
 * Copy `firebase-config.example.js` to `firebase-config.js` and fill
 * the values from your Firebase Console (Project Settings > Your Apps > Web).
 */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (firebaseConfig.apiKey && firebaseConfig.apiKey.startsWith('YOUR_')) {
  console.warn('Firebase config not set. Copy frontend/firebase-config.example.js to frontend/firebase-config.js and fill your project values.');
} else {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const functions = firebase.functions();
  console.log('Firebase initialized successfully!');
}
