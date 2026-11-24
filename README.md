# HireFlow

HireFlow is a mobile employment app built with React Native and Expo. Job seekers can browse openings, submit and manage applications, and employers can publish jobs and review applicants.

## Features

- Account registration, sign-in, onboarding, and profile management
- Job browsing, search, job details, and employer job-post management
- Job applications, application editing and withdrawal, and employer status updates
- Role-specific notifications for job seekers and employers
- Local persistence for app data using AsyncStorage

## Notifications

The notification bell is available in the app’s search/navigation rows. It displays the signed-in user’s unread count. The Notifications screen lists that user’s notifications newest first and provides read/unread indicators, event-specific icons, timestamps, and actions to mark one notification or all notifications as read, delete a notification, or clear the list.

Selecting a notification marks it as read and opens the related application, job, applicant list, job-post list, or profile when that destination is available. If a related record is missing, the app falls back to the relevant list screen.

Notifications are created from application and job workflows:

- Submitting an application notifies the employer and sends the job seeker a submission confirmation.
- Editing an application notifies the employer.
- Withdrawing a pending application removes it from the applicant’s list and notifies both the employer and job seeker.
- Accepting or declining an application notifies the job seeker.
- Removing a job posting notifies applicants that their application is no longer active.
- Publishing, updating, or changing the active state of a job generates an employer notification.
- Saving profile changes generates a profile-updated notification.

Notifications are stored locally in AsyncStorage and filtered by recipient user ID. Read state and notification management persist on the device. This is an in-app notification system; it does not send remote push notifications, email, or server-side alerts. Notifications do not sync between devices because the project does not currently use a backend notification service.

## Tech stack

- React Native and Expo SDK 58
- Expo Router for file-based navigation
- JavaScript
- AsyncStorage for local persistence
- `lucide-react-native` for interface icons

## Project structure

```text
my-app/
├── app/                    # Expo Router routes and layouts
├── components/             # Shared UI and feature components
├── contexts/               # Auth, jobs, applications, and notifications state
├── data/                   # Local app data and profile constants
├── screens/                # Screen-level UI, including NotificationsScreen
├── styles/                 # Shared theme and styling
├── assets/                 # Images, fonts, and other static assets
├── app.json
├── eas.json
├── package.json
└── README.md
```

## Getting started

1. Install Node.js and npm, then install dependencies:

   ```bash
   npm install
   ```

2. Start the Expo development server:

   ```bash
   npx expo start
   ```

3. Open the app using Expo Go, an Android emulator, an iOS simulator, or the web option in the Expo development server.

## Available scripts

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
```

## Data and limitations

App accounts, jobs, applications, and notifications currently use local app storage and application data; there is no production API or shared database. Data stored locally is specific to the device/browser installation. Notification history is not a replacement for operating-system push notifications.

## Contributing

Keep notification creation connected to successful app workflows, scope each notification to its intended recipient, and avoid introducing sample notifications as real activity. Follow the existing React Native, Expo Router, context, and theme conventions when adding features.
