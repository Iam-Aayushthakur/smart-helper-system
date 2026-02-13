# Firebase Setup Guide

This guide helps you complete the two final tasks:
1. Replace Firebase config with your project credentials
2. Deploy Cloud Functions to production

## Step 1: Get Your Firebase Credentials

1. Open https://console.firebase.google.com/
2. Select your project: **smart-helper-system**
3. Go to **Project Settings** (gear icon, top-left)
4. Click the **Your Apps** tab
5. Find your **Web App** and click the config icon
6. Copy the entire config object (looks like below):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "smart-helper-system.firebaseapp.com",
  projectId: "smart-helper-system",
  storageBucket: "smart-helper-system.firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
};
```

## Step 2: Configure Your Local `firebase-config.js`

**In your local machine (NOT in the repo):**

```bash
# Copy the example file to create your local config
cp frontend/firebase-config.example.js frontend/firebase-config.js
```

Then edit `frontend/firebase-config.js` and replace the placeholder values with your actual Firebase credentials from Step 1.

**Do NOT commit this file** — it's already in `.gitignore`.

## Step 3: Enable Blaze Billing (Required for Cloud Functions)

1. Open https://console.firebase.google.com/project/smart-helper-system/usage/details
2. Click **Upgrade to Blaze**
3. Follow the prompts to enable billing
4. Wait for the APIs to enable (this takes ~5 minutes)

## Step 4: Deploy Cloud Functions

Once Blaze is enabled, deploy locally:

```bash
cd d:\Lpu class work\sem2\hackathon project
firebase deploy --only functions
```

**Or use GitHub Actions (automated on push):**

1. Run locally to get a token:
   ```bash
   firebase login:ci
   ```
2. Copy the token output
3. Go to your GitHub repo: https://github.com/Iam-Aayushthakur/smart-helper-system
4. Click **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
5. Name: `FIREBASE_TOKEN`
6. Value: (paste the token from Step 1)
7. Click **Add secret**

Then any push to `master` will trigger the deploy workflow (`.github/workflows/deploy.yml`).

## Step 5: Test Everything

1. Open https://smart-helper-system.web.app (Firebase Hosting)
2. Click **Get Current Location** and verify geolocation works
3. Select a service type
4. Click **Book Now** to trigger the cloud function
5. Check Cloud Functions logs:
   ```bash
   firebase functions:log
   ```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Blaze plan not enabled" | Upgrade at https://console.firebase.google.com/project/smart-helper-system/usage/details |
| "No helpers found" | Add sample helpers to Firestore via Firebase Console |
| "Deploy fails" | Run `firebase login --reauth` and try again |
| "Geolocation blocked" | Allow location access in browser permissions |

## Done ✅

Once all steps above are complete, your system is **100% live** with:
- ✅ Frontend deployed to Firebase Hosting
- ✅ Frontend on GitHub Pages
- ✅ Source code on GitHub
- ✅ Cloud Functions deployed
- ✅ CI/CD automated on push
