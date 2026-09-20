# HireFlow

HireFlow is a mobile job-tracking app built with React Native and Expo. The application helps users manage their employment search by guiding them through account creation, profile setup, and career-dashboard tracking.

## Overview

This project is designed for job seekers who want a simple way to:

- create an account or sign in
- complete a registration flow for personal and employment details
- track application progress
- review quick career dashboard metrics
- stay organized while searching for jobs

## Current app flow

The application currently includes:

- a login screen with email and password entry
- a registration screen for account creation
- onboarding steps for basic information, birth date, and educational background
- a dashboard with job application statistics and quick actions

## Tech stack

- React Native
- Expo
- Expo Router
- JavaScript
- Native UI components

## Project structure

```bash
my-app/
├── app/
│   ├── (tabs)/
│   ├── registration/
│   ├── index.js
│   └── register.js
├── components/
├── constants/
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

## Available scripts

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
```

## Notes

This repo is still evolving and currently focuses on the app's onboarding and dashboard flow. The project uses file-based routing through Expo Router and is meant to serve as a foundation for continued employment-app features.

## Future improvements

Planned enhancements may include:

- persistent user data storage
- real authentication integration
- job listing and application tracking
- resume upload and profile management
- notifications and reminders
