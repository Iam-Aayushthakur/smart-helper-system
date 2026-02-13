# Setup Checklist

Track your progress setting up the Smart Helper System!

## Pre-Setup
- [ ] Node.js v18+ installed
- [ ] GitHub account created
- [ ] Firebase account (free tier)
- [ ] Modern web browser

## Step 1: Firebase Project (5 min)
- [ ] Create Firebase project at console.firebase.google.com
- [ ] Project name entered: `smart-helper-system`
- [ ] Project creation completed
- [ ] Firestore Database enabled (test mode)
- [ ] Region selected (closest to you)

## Step 2: Get Firebase Credentials (3 min)
- [ ] Project Settings opened (⚙️ icon)
- [ ] Web app registered
- [ ] Firebase config object copied
- [ ] Config saved somewhere temporarily

## Step 3: Configure Frontend (2 min)
- [ ] `frontend/firebase-config.js` opened
- [ ] Firebase config pasted into file
- [ ] File saved
- [ ] Credentials verified (apiKey, projectId visible)

## Step 4: Add Sample Helpers (3 min)
- [ ] Firebase Console > Firestore Database opened
- [ ] New collection "helpers" created
- [ ] First helper document added:
  - [ ] Name: John Smith
  - [ ] Skills: ["cleaning", "cooking"]
  - [ ] Rating: 4.8
  - [ ] Status: available
  - [ ] Location: {lat: 40.7128, lng: -74.0060}
- [ ] Second helper document added:
  - [ ] Name: Sarah Johnson
  - [ ] Skills: ["cooking", "repair"]
  - [ ] Rating: 4.9
  - [ ] Status: available
  - [ ] Location: {lat: 40.7200, lng: -74.0100}

## Step 5: Run Locally - Option A (Live Server) (5 min)
- [ ] Node.js npm verified: `npm -v`, `node -v`
- [ ] Live-server installed: `npm install -g live-server`
- [ ] Terminal navigated to `frontend` folder
- [ ] Live-server started: `live-server`
- [ ] Browser opened to `http://localhost:8080`
- [ ] Booking form visible

## Step 5: Run Locally - Option B (File Browser) (2 min)
- [ ] `frontend/index.html` opened in browser
- [ ] Booking form visible
- [ ] Note: Limited functionality without local server

## Step 6: Test the Booking System (5 min)
- [ ] Clicked "Get Current Location" button
- [ ] Browser location permission dialog appeared
- [ ] Clicked "Allow" for location access
- [ ] Location coordinates appeared in the form
- [ ] Selected service: "Cleaning"
- [ ] Added description: "Clean my apartment"
- [ ] Clicked "Book Now"
- [ ] Loading spinner appeared
- [ ] Success message displayed with helper name
- [ ] Booking details shown (Name, Rating, Distance, ETA)
- [ ] Status shows "ASSIGNED"

## Step 7: Install Firebase CLI (2 min)
- [ ] Firebase CLI installed: `npm install -g firebase-tools`
- [ ] Firebase login: `firebase login`
- [ ] Browser authenticated
- [ ] Auth confirmed

## Step 8: Initialize Firebase Project (5 min)
- [ ] Terminal navigated to project root
- [ ] Firebase init started: `firebase init`
- [ ] Selected: **Functions**
- [ ] Existing project selected: `smart-helper-system`
- [ ] Language: **JavaScript**
- [ ] ESLint: **Y**
- [ ] Install dependencies: **Y**
- [ ] Setup completed

## Step 9: Deploy Cloud Functions (5 min)
- [ ] Navigated to `backend/functions` folder
- [ ] Dependencies installed: `npm install`
- [ ] Returned to project root
- [ ] Functions deployed: `firebase deploy --only functions`
- [ ] Deployment output successful
- [ ] Function URLs noted:
  - [ ] `assignHelper`
  - [ ] `updateHelperLocation`
  - [ ] `completeBooking`
  - [ ] `getBooking`

## Step 10: Test Cloud Functions (optional)
- [ ] Firebase console > Cloud Functions opened
- [ ] All functions show "OK" status
- [ ] Logs section checked for errors
- [ ] Function invocation counted in dashboard

## Step 11: GitHub Repository Setup (5 min)
- [ ] GitHub repository created: `smart-helper-system`
- [ ] Repository set to **Public**
- [ ] Repository cloned or git initialized locally
- [ ] Remote origin added to local repo

## Step 12: Commit Code to GitHub (3 min)
- [ ] `.gitignore` file created
- [ ] All files staged: `git add .`
- [ ] Initial commit: `git commit -m "Initial commit: Smart Helper System MVP"`
- [ ] Branch renamed: `git branch -M main`
- [ ] Pushed to GitHub: `git push -u origin main`
- [ ] Commit visible on GitHub repo

## Step 13: Enable GitHub Pages (5 min)
- [ ] GitHub repository Settings opened
- [ ] Left sidebar > **Pages** clicked
- [ ] Source: **Deploy from a branch**
- [ ] Branch: **main**
- [ ] Folder: **/frontend**
- [ ] Saved
- [ ] Site URL generated: `https://username.github.io/smart-helper-system`
- [ ] Waited 1-2 minutes for deployment

## Step 14: Test Live Deployment (5 min)
- [ ] Live site URL visited in browser
- [ ] Booking form loaded successfully
- [ ] "Get Current Location" clicked
- [ ] Location permission granted
- [ ] Service selected
- [ ] "Book Now" clicked
- [ ] Assignment worked
- [ ] Success message displayed

## Step 15: Documentation Review (10 min)
- [ ] [README.md](README.md) read
- [ ] [docs/QUICK_START.md](docs/QUICK_START.md) reviewed
- [ ] [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) skimmed
- [ ] [backend/BACKEND_SETUP.md](backend/BACKEND_SETUP.md) reviewed
- [ ] [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) reviewed
- [ ] [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) read

## Post-Setup Verification
- [ ] Frontend loads at GitHub Pages URL
- [ ] Booking form functional
- [ ] Geolocation working
- [ ] Firebase initialized (check console)
- [ ] Cloud Functions deployed
- [ ] Firestore accessible
- [ ] Database shows helpers
- [ ] Bookings created in Firestore
- [ ] No errors in browser console (F12)
- [ ] Mobile responsive (zoom or test device)

## Optional Enhancements
- [ ] Added custom domain to GitHub Pages
- [ ] Set up Firestore backups
- [ ] Implemented Firebase Authentication
- [ ] Added Cloud Function monitoring
- [ ] Set up GitHub Actions for auto-deploy
- [ ] Tested with multiple helpers
- [ ] Verified auto-reassignment logic
- [ ] Added custom branding

## Troubleshooting Done
- [ ] Checked that Firebase credentials were correct
- [ ] Verified Firestore test mode is enabled
- [ ] Confirmed helpers have "available" status
- [ ] Browser console checked for errors
- [ ] Network tab checked for API calls
- [ ] Geolocation permission verified

## Next Steps
- [ ] Deploy to custom domain (if desired)
- [ ] Add helper dashboard
- [ ] Implement push notifications
- [ ] Add payment integration
- [ ] Build mobile app (React Native)
- [ ] Implement user authentication
- [ ] Add rating system
- [ ] Scale to production

---

## Estimated Total Time

| Step | Time | Done |
|------|------|------|
| Firebase Setup | 5 min | [ ] |
| Get Credentials | 3 min | [ ] |
| Configure Frontend | 2 min | [ ] |
| Add Sample Data | 3 min | [ ] |
| Run Locally | 5 min | [ ] |
| Test Booking | 5 min | [ ] |
| Firebase CLI | 2 min | [ ] |
| Initialize Firebase | 5 min | [ ] |
| Deploy Functions | 5 min | [ ] |
| GitHub Setup | 5 min | [ ] |
| Commit Code | 3 min | [ ] |
| Enable Pages | 5 min | [ ] |
| Test Live | 5 min | [ ] |
| Documentation | 10 min | [ ] |
| **TOTAL** | **~63 min** | **[ ]** |

## Support Checklist

If you get stuck:
- [ ] Read the [README.md](README.md) first
- [ ] Check [docs/QUICK_START.md](docs/QUICK_START.md)
- [ ] Review relevant `.md` file
- [ ] Check browser console (F12 > Console)
- [ ] Check Firebase logs
- [ ] Check Firestore data exists
- [ ] Verify internet connection
- [ ] Try clearing browser cache
- [ ] Restart live-server or browser
- [ ] Check that services are enabled in Firebase

## Final Checklist

- [ ] System is live and accessible
- [ ] Booking form works end-to-end
- [ ] Helper assignment happens in < 2 seconds
- [ ] Status updates in real-time
- [ ] Database is properly populated
- [ ] Documentation is reviewed
- [ ] All files committed to GitHub
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Ready for hackathon demo! 🚀

---

**Congratulations! Your Smart Helper System is ready! 🎉**

Next: Check out [docs/QUICK_START.md](docs/QUICK_START.md) for the fastest path to a working system, or follow the steps above systematically for a complete setup.
