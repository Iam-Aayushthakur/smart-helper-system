# Deployment Guide

Complete guide to deploy your Smart Helper System to the internet.

## Architecture

```
┌─────────────────┐
│  GitHub Pages   │ ← Frontend (HTML/CSS/JS)
│ github.io       │ Serves at yourusername.github.io
└────────┬────────┘
         │ API calls
         │
         ↓
┌─────────────────┐
│ Firebase Cloud  │ ← Backend (Node.js Functions)
│ Functions       │ Serves at us-central1-xxx.cloudfunctions.net
└────────┬────────┘
         │ Read/Write
         │
         ↓
┌─────────────────┐
│ Firestore       │ ← Database (NoSQL)
│ Database        │
└─────────────────┘
```

## Frontend Deployment (GitHub Pages)

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "New" to create a new repository
3. Repository name: `smart-helper-system`
4. Description: "Smart Helper Auto-Assignment System"
5. Choose **Public**
6. Click "Create repository"

### Step 2: Initialize Git Locally

```bash
# Navigate to project root
cd "d:\Lpu class work\sem2\hackathon project"

# Initialize git
git init

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/smart-helper-system.git

# Create .gitignore
echo "node_modules/" > .gitignore
echo ".firebase/" >> .gitignore
echo "dist/" >> .gitignore
echo ".DS_Store" >> .gitignore
```

### Step 3: Commit and Push

```bash
# Stage all files
git add .

# Commit
git commit -m "Initial commit: Smart Helper System MVP"

# Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your GitHub repository
2. Click "Settings" (top-right)
3. Left sidebar > "Pages"
4. Under "Source":
   - Branch: `main`
   - Folder: `/frontend`
5. Click "Save"

**Your site will be live at:**
```
https://YOUR_USERNAME.github.io/smart-helper-system
```

### Step 5: Update Firebase Configuration

Edit `frontend/firebase-config.js` to ensure CORS and cross-origin settings are correct. Firebase automatically handles CORS for Cloud Functions calls from GitHub Pages.

## Backend Deployment (Firebase)

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

Opens a browser window to authenticate. Approve the request.

### Step 3: Initialize Firebase in Project Root

```bash
# From project root
firebase init
```

When prompted:
- Features to set up: Select **Functions** (use space bar, arrow keys)
- Select your Firebase project
- Language: **JavaScript**
- ESLint: **Y** (for better code quality)
- Install dependencies: **Y**

### Step 4: Deploy Cloud Functions

```bash
# Deploy only functions (no firestore rules/hosting)
firebase deploy --only functions
```

**Output will show:**
```
✔ functions[assignHelper] deployed successfully
✔ functions[updateHelperLocation] deployed successfully
✔ functions[completeBooking] deployed successfully
✔ All function deployments completed!
```

### Step 5: Get Function URLs

Your functions are now available at:
```
https://REGION-PROJECT_ID.cloudfunctions.net/FUNCTION_NAME
```

Example:
```
https://us-central1-smart-helper-abc.cloudfunctions.net/assignHelper
```

### Step 6: Update Frontend with Function URLs (Optional)

If you've hardcoded URLs in your frontend, update them:

Edit `frontend/app.js` and find where Cloud Functions are called:

```javascript
const assignHelper = functions.httpsCallable('assignHelper');
```

This already uses the Firebase SDK, so URLs are handled automatically. ✅

## Custom Domain Setup (Optional)

If you want your own domain (e.g., `smarthelper.com`) instead of `github.io`:

### Option 1: GitHub Pages with Custom Domain

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. Point nameservers to GitHub (DNS records)
3. In GitHub Settings > Pages:
   - Custom domain: `yourdomain.com`
   - Enforce HTTPS: ✅

### Option 2: Firebase Hosting for Everything

```bash
firebase init hosting
```

Then deploy both frontend and backend to Firebase:

```bash
firebase deploy
```

Your site will be at: `https://PROJECT_ID.web.app`

## Database Deployment

Firestore automatically syncs your development data. To ensure production readiness:

### Step 1: Set Up Production Security Rules

Edit `firestore.rules` (if using Firebase Hosting):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /helpers/{helperId} {
      allow read: if true;
      allow write: if request.auth.uid == helperId;
    }
    match /bookings/{bookingId} {
      allow read: if request.auth.uid == resource.data.userId 
                     || request.auth.uid == resource.data.assignedHelperId;
      allow write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

### Step 2: Set Up Backups

In Firebase Console:
1. Firestore Database > Backups
2. Create scheduled backup (daily recommended)
3. Set retention period (30 days minimum)

### Step 3: Create Firestore Indexes

For production, create these indexes:

```bash
# In firebase.json, under firestore.indexes:
{
  "firestore": {
    "indexes": [
      {
        "collectionGroup": "helpers",
        "queryScope": "COLLECTION",
        "fields": [
          {"fieldPath": "status", "order": "ASCENDING"},
          {"fieldPath": "skills", "order": "DESCENDING"}
        ]
      }
    ]
  }
}
```

Deploy:
```bash
firebase deploy --only firestore:indexes
```

## Monitoring and Logs

### View Cloud Functions Logs

```bash
firebase functions:log
```

Or in Firebase Console:
1. Cloud Functions
2. Details tab
3. Logs tab

### Monitor Firestore Database

```bash
# Monitor real-time usage
firebase firestore:usage-stats quarterly
```

### Check Deployment Status

```bash
firebase status
```

## Environment Variables

For sensitive data, use Firebase environment variables:

```bash
# Set variables
firebase functions:config:set someservice.key="xxx" someservice.id="yyy"

# Deploy with variables
firebase deploy --only functions
```

Access in Cloud Functions:
```javascript
const functions = require('firebase-functions');
const key = functions.config().someservice.key;
```

## Continuous Deployment (Optional)

Set up GitHub Actions to auto-deploy on push:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

Get FIREBASE_TOKEN:
```bash
firebase login:ci
```

Add token to GitHub: Settings > Secrets > `FIREBASE_TOKEN`

## Rollback

If deployment causes issues, rollback to previous version:

### Cloud Functions

```bash
# List versions
firebase functions:list

# Redeploy specific function
firebase deploy --only functions:assignHelper
```

### GitHub Pages

```bash
# Revert last commit
git revert HEAD
git push
```

## Post-Deployment Checklist

- [ ] Frontend loads at `https://username.github.io/smart-helper-system`
- [ ] Firebase config is loaded (no errors in console)
- [ ] Cloud Functions deployed successfully
- [ ] Firestore database accessible
- [ ] Geolocation works
- [ ] Can submit booking form
- [ ] Helper assignment logic works
- [ ] Status updates show correctly
- [ ] Security rules are set
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Custom domain configured (if applicable)

## Production Considerations

### Performance

- ✅ Cloud Functions: Cold start ~1-2s (acceptable for MVP)
- ✅ Firestore: Indexes optimized for common queries
- ✅ GitHub Pages: CDN cached (instant load)

### Costs

**Free Tier Includes:**
- 2M Cloud Function invocations/month
- 1GB Firestore storage
- 50K read/write operations/day
- Essential analytics

**Estimated Monthly Cost (100 users):**
- Cloud Functions: $0 (within free tier)
- Firestore: $0 (within free tier)
- GitHub Pages: $0 (free)
- **Total: $0** (until you scale)

### Security

- [ ] Enable Firestore authentication
- [ ] Set up proper security rules
- [ ] Enable HTTPS (automatic on github.io)
- [ ] Implement API rate limiting
- [ ] Add request validation
- [ ] Implement logging/monitoring
- [ ] Handle sensitive data encryption

### Scalability

If your app grows:

1. **Upgrade Firestore tier** (pay-as-you-go)
2. **Add read replicas** for regions
3. **Implement caching** (Redis)
4. **Scale Cloud Functions** (automatic)
5. **Add load balancing** (for multiple regions)

## Support and Troubleshooting

### Deployment Failed

1. Check logs: `firebase deploy` shows verbose output
2. Ensure Firebase CLI is updated: `npm install -g firebase-tools@latest`
3. Verify project ID: `firebase use`

### Functions Not Found

1. Check deployment: `firebase functions:list`
2. Verify function names match frontend code
3. Check region: Default is `us-central1`

### Firestore Access Denied

1. Check security rules: Firebase Console > Firestore > Rules
2. Ensure test mode or proper auth
3. Check user is authenticated (for production)

## Resources

- [Firebase Deployment Docs](https://firebase.google.com/docs/deploy)
- [GitHub Pages Docs](https://pages.github.com)
- [Firebase CLI Docs](https://firebase.google.com/docs/cli)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)

---

**Your Smart Helper System is now live!** 🚀
