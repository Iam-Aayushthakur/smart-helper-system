# 🚀 Complete Setup in 10 Minutes

Follow these steps **in order** to get everything 100% live.

---

## Step 1: Get Firebase Credentials (2 minutes)

1. Open: https://console.firebase.google.com/
2. Select project: **smart-helper-system**
3. Click ⚙️ **Project Settings** (top-left)
4. Click **Your apps** tab
5. Find **Web App** → click the code icon `<>`
6. **Copy the entire config object** (starts with `const firebaseConfig = {`)

Example of what to copy:
```javascript
{
  apiKey: "AIzaSy...",
  authDomain: "smart-helper-system.firebaseapp.com",
  projectId: "smart-helper-system",
  storageBucket: "smart-helper-system.firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
}
```

---

## Step 2: Enable Blaze Billing (3 minutes)

1. Open: https://console.firebase.google.com/project/smart-helper-system/usage/details
2. Click **Upgrade to Blaze** button
3. Follow the prompts (add credit card, confirm)
4. **Wait 5 minutes** for APIs to enable

---

## Step 3: Configure Your Local Firebase (1 minute)

Run these commands in PowerShell:

```powershell
cd "d:\Lpu class work\sem2\hackathon project"

# Copy example to config
Copy-Item frontend/firebase-config.example.js frontend/firebase-config.js

# Open the file to edit
notepad frontend/firebase-config.js
```

**In the editor:**
- Replace `YOUR_API_KEY` with the `apiKey` value you copied
- Replace `your-project` with `smart-helper-system`
- Replace all other placeholders with your values
- **Save the file** (Ctrl+S)

---

## Step 4: Deploy Cloud Functions (2 minutes)

Run in PowerShell:

```powershell
cd "d:\Lpu class work\sem2\hackathon project"

# Deploy functions
firebase deploy --only functions

# Watch the logs
firebase functions:log
```

You'll see: `Deploy complete!`

---

## Step 5: Set Up GitHub Actions (2 minutes)

### 5a. Get Firebase Token

Run in PowerShell:

```powershell
firebase login:ci
```

A browser window opens → **Log in to GitHub** → Copy the token shown

Example token: `1//0gE...` (long string)

### 5b. Add Secret to GitHub

1. Go to: https://github.com/Iam-Aayushthakur/smart-helper-system
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left menu)
4. Click **New repository secret** (green button)
5. **Name:** `FIREBASE_TOKEN`
6. **Value:** Paste the token from 5a
7. Click **Add secret**

---

## Step 6: Test Everything (1 minute)

### 6a. Test Frontend

1. Open: https://smart-helper-system.web.app
2. Click **Get Current Location** → Allow permissions
3. Select a service (e.g., "cleaning")
4. Click **Book Now**

**Expected:** Helper details appear (from Cloud Function)

### 6b. Check Cloud Function Logs

```powershell
firebase functions:log
```

You'll see your request logged.

### 6c. Test GitHub Pages

Open: https://iam-aayushthakur.github.io/smart-helper-system

---

## ✅ Complete!

Your system is now **100% live** with:
- ✅ Firebase Hosting frontend: https://smart-helper-system.web.app
- ✅ GitHub Pages: https://iam-aayushthakur.github.io/smart-helper-system
- ✅ Cloud Functions deployed and responding
- ✅ CI/CD automated (any push to master triggers deploy)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Blaze not enabled" | Go to https://console.firebase.google.com/project/smart-helper-system/billing and enable |
| "Deploy fails" | Run `firebase login --reauth` |
| "No helpers found" | Add helpers to Firestore via Firebase Console |
| "Geolocation blocked" | Click the lock icon in your browser and allow location |
| "GitHub Actions failing" | Check that `FIREBASE_TOKEN` secret is added correctly |

---

## Command Summary (All at Once)

If you've done steps 1-2 manually, run this to finish:

```powershell
cd "d:\Lpu class work\sem2\hackathon project"
Copy-Item frontend/firebase-config.example.js frontend/firebase-config.js
firebase deploy --only functions
firebase login:ci
```

Then add the token to GitHub Settings → Secrets.

---

**Questions? Check:**
- https://github.com/Iam-Aayushthakur/smart-helper-system/blob/master/README.md
- https://github.com/Iam-Aayushthakur/smart-helper-system/blob/master/FIREBASE_SETUP_GUIDE.md
