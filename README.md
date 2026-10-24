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

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Expo development server:

   ```bash
   npx expo start
   ```

3. Open the app in a simulator, emulator, or Expo Go.

## Job listings

The app currently uses four sample job listings defined in [`data/jobs.js`](./data/jobs.js). The home screen renders the listings as cards, and selecting a card opens its job details. The data is local and static; it is not loaded from an API or saved to a database.

Each listing has an `id`, company logo, job title, location, company, work mode, work type, description, responsibilities, and salary. Update the `work` array in `data/jobs.js` to change the sample listings. Company logos reference images in `assets/images/`.

## Available scripts

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
```

## Notes

This repo is still evolving. It uses file-based routing through Expo Router and is meant to serve as a foundation for continued employment-app features.

## Future improvements

Planned enhancements may include:

- persistent user data storage
- real authentication integration
- connecting job listings and application tracking to a backend
- resume upload and profile management
- notifications and reminders
