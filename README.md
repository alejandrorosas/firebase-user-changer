# Firebase User Changer

A lightweight Chrome Extension that automatically redirects Firebase, Google Play, and Google Cloud Console links to your preferred user account index. 

No more landing on the wrong Google account (`/u/0`) and facing "Permission Denied" errors when clicking console links.

---

## The Problem

If you manage multiple Google or developer accounts, clicking links to the Firebase, Play, or Cloud consoles often opens using your primary personal account (`/u/0`) instead of your developer account (e.g. `/u/1` or `/u/2`). This results in constant manual URL editing or account-switching.

## The Solution

Firebase User Changer intercepts console navigation in the background and rewrites the URLs on the fly to target the exact user index you specify. 

---

## Features

- Firebase Console Redirection: Set a specific User ID (e.g. `1`) for Firebase URLs.
- Google Play Console Support: Automatically rewrites Play Console URLs to keep you signed in to your developer profile.
- Google Cloud Console Support: Directly opens GCP projects with your correct credentials.
- Granular Controls: Turn redirection on/off individually for Firebase, Play Console, or Cloud Console via simple checkbox controls.
- Local Storage: Save your configured User ID indices once, and the extension runs quietly in the background.

---

## Installation

You can install the extension using any of the following methods:

### Option A: From the Chrome Web Store (Recommended)
You can add the extension directly to your browser from the [Chrome Web Store](https://chromewebstore.google.com/detail/firebase-user-changer/hifpbkhihabmonkmioehggekhokngnch).

### Option B: From the GitHub Release ZIP
1. Go to the [latest release page](https://github.com/alejandrorosas/firebase-user-changer/releases/latest) (or the general [releases page](https://github.com/alejandrorosas/firebase-user-changer/releases)) of this repository and download the latest `firebase-user-changer-v*.zip` asset.
2. Extract the downloaded ZIP file to a folder on your computer.
3. Open Google Chrome and navigate to `chrome://extensions/`.
4. Enable **Developer mode** (toggle in the top-right corner).
5. Click **Load unpacked** (top-left corner) and select the extracted folder.
6. Click the extension icon in your toolbar, configure your preferred User IDs, check the boxes, and click **Save**.

### Option C: By Cloning the Repository
1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/alejandrorosas/firebase-user-changer.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** (top-left corner) and select the cloned repository directory.
5. Click the extension icon in your toolbar, configure your preferred User IDs, check the boxes, and click **Save**.
