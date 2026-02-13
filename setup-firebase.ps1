#!/usr/bin/env pwsh
<#
.SYNOPSIS
Quick setup script to configure Firebase credentials and deploy functions.

.DESCRIPTION
This script helps you:
1. Copy firebase-config.example.js to firebase-config.js
2. Prompt for Firebase credentials
3. Deploy Cloud Functions (requires Blaze billing enabled)

.NOTES
Before running: Enable Blaze billing at https://console.firebase.google.com/project/smart-helper-system/usage/details
#>

param()

Write-Host "`n=== Smart Helper Firebase Setup ===" -ForegroundColor Cyan

# Step 1: Copy example config
$examplePath = "frontend/firebase-config.example.js"
$configPath = "frontend/firebase-config.js"

if (-not (Test-Path $configPath)) {
    Write-Host "`n1. Creating firebase-config.js from example..." -ForegroundColor Yellow
    Copy-Item -Path $examplePath -Destination $configPath
    Write-Host "   Done. Now edit firebase-config.js with your credentials." -ForegroundColor Green
} else {
    Write-Host "`n1. firebase-config.js already exists." -ForegroundColor Green
}

# Step 2: Prompt for Blaze confirmation
Write-Host "`n2. Checking Firebase project..." -ForegroundColor Yellow
$gitExe = "C:\Program Files\Git\cmd\git.exe"
$firebaseExe = npm list -g firebase-tools 2>$null | Select-String "firebase-tools" | Out-Null
if ($firebaseExe) {
    Write-Host "   Firebase CLI installed." -ForegroundColor Green
} else {
    npm install -g firebase-tools
    Write-Host "   Firebase CLI installed." -ForegroundColor Green
}

# Step 3: Deploy functions
Write-Host "`n3. Ready to deploy Cloud Functions." -ForegroundColor Yellow
Write-Host "   Ensure Blaze billing is enabled at:" -ForegroundColor Cyan
Write-Host "   https://console.firebase.google.com/project/smart-helper-system/usage/details" -ForegroundColor Cyan

$response = Read-Host "`n   Have you enabled Blaze billing? (yes/no)"
if ($response -eq "yes") {
    Write-Host "`n   Deploying Cloud Functions..." -ForegroundColor Yellow
    firebase deploy --only functions
    Write-Host "`n   Done! Check logs:" -ForegroundColor Green
    Write-Host "   firebase functions:log" -ForegroundColor Cyan
} else {
    Write-Host "`n   Please enable Blaze billing first, then run this script again." -ForegroundColor Yellow
}

Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan
Write-Host "Next: Open https://smart-helper-system.web.app and test!" -ForegroundColor Green
Write-Host ""
