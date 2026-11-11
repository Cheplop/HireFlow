# HireFlow

HireFlow is a mobile employment app built with React Native and Expo. It provides account setup screens and a job-browsing experience with sample listings and job details.

## Overview

This project is designed for job seekers who want a simple way to:

- create an account or sign in
- complete a registration flow for personal and employment details
- browse job listings
- review job descriptions, responsibilities, work arrangements, and salary information

## Current app flow

The application currently includes:

- a login screen with email and password entry
- a registration screen for account creation
- onboarding steps for basic information, birth date, and educational background
- a home screen showing sample job cards
- a job details screen for each listing

## Tech stack

- React Native
- Expo
- Expo Router
- JavaScript
- React Native components

## Project structure

```bash
my-app/
├── app/
│   ├── (tabs)/
│   ├── registration/
│   ├── jobDetails/
│   ├── index.js
│   └── _layout.js
├── components/
├── data/
│   └── jobs.js
├── screens/
├── styles/
├── assets/
├── scripts/
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## Getting started

### Prerequisites

- Git
- Node.js (LTS recommended) and npm
- The Expo Go app on your phone

### 1. Fork the repository

Go to Remiel's GitHub and find the **HireFlow** repository, then fork it to your own account. Keeping your own copy avoids push conflicts on Remiel's main branch.

### 2. Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/HireFlow.git
cd HireFlow
```

### 3. Set up remotes

Add Remiel's repo as `upstream` and point `origin` at your own fork:

```bash
git remote add upstream https://github.com/REMIEL_USERNAME/HireFlow.git
git remote set-url origin https://github.com/YOUR_USERNAME/HireFlow.git
git remote -v
```

Verify: `origin` should show **your** username, `upstream` should show **Remiel's**.

### 4. Sync with upstream

Fetch the latest changes from Remiel's repo and update your `main` branch:

```bash
git fetch upstream
git checkout main
git pull upstream main
```

Push to your fork to keep it updated:

```bash
git push origin main
```

### 5. Install dependencies

Open the folder in VS Code, then in the terminal:

```bash
npm install
npm install lucide-react-native
```

### 6. Run the system

Start the Expo development server:

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app to open it on your phone.

If your phone is not on the same Wi-Fi network as your laptop, use tunneling instead:

```bash
npm install -g @expo/ngrok
npx expo start --tunnel
```

## Available scripts

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
```

## Job listings

The app currently uses four sample job listings defined in [`data/jobs.js`](./data/jobs.js). The home screen renders the listings as cards, and selecting a card opens its job details. The data is local and static; it is not loaded from an API or saved to a database.

Each listing has an `id`, company logo, job title, location, company, work mode, work type, description, responsibilities, and salary. Update the `work` array in `data/jobs.js` to change the sample listings. Company logos reference images in `assets/images/`.

## Contributing

1. Always `git pull upstream main` before starting work.
2. Create a feature branch (`git checkout -b my-feature`).
3. Push to your fork and open a pull request to Remiel's repo.

## Future improvements

Planned enhancements may include:

- persistent user data storage
- real authentication integration
- connecting job listings and application tracking to a backend
- resume upload and profile management
- notifications and reminders
