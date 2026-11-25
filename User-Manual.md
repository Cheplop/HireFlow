# HireFlow User Manual

**Document type:** User Manual  
**Application:** HireFlow  
**Platform:** Mobile application (React Native and Expo)  
**Intended users:** Employees (job seekers) and Employers

---

## 1. Introduction

HireFlow is a mobile employment application that connects job seekers with employers. Employees can create a profile, browse job opportunities, submit and track applications, and receive notifications. Employers can publish and manage job listings, review applicants, and update application statuses.

This manual explains how to access HireFlow and use the features currently implemented in the application. The instructions are separated by account role because employees and employers see different navigation options.

## 2. Before You Begin

### 2.1 Accessing the application

HireFlow is built with React Native and Expo. To run the project for testing:

1. Install Node.js (LTS recommended) and npm on your computer.
2. Open the HireFlow project folder in a terminal.
3. Install the project dependencies by running:

   ```bash
   npm install
   ```

4. Start the Expo development server:

   ```bash
   npx expo start
   ```

5. Open the project using an available emulator or the Expo Go application on a compatible phone. Follow the QR-code or terminal instructions displayed by Expo.

These are developer launch steps; ordinary users who have been provided with an installed build can open HireFlow directly.

### 2.2 Demo accounts

The source code contains two built-in demonstration accounts:

| Role | Username | Password |
|---|---|---|
| Employee / Job Seeker | `remiel` | `1234` |
| Employer | `Bill` | `1234` |

The application currently uses local device storage and demonstration authentication. These accounts are for testing the current project, not production credentials. New accounts are also saved locally on the device.

## 3. Account Registration and Login

### 3.1 Creating an account

1. Open HireFlow. On the login screen, select **register here**.
2. On the **Create account** screen, select the account type:
   - **Employee** if you are looking for work.
   - **Employer** if you are posting jobs and reviewing applicants.
3. Enter a username.
4. Enter a valid email address.
5. Create a password with at least six characters.
6. Re-enter the password in **Confirm password**.
7. Select the button to continue or create the account.
8. If a validation message appears, correct the highlighted information and submit again.

Usernames must contain at least three characters and may use letters, numbers, periods, and underscores. The username and email address must not already be registered.

**What happens next:**
- An employee is guided through the employee profile setup steps described in Section 4.
- An employer is taken directly to the main application.

[SCREENSHOT 01 — Insert an actual capture of the Create Account screen. Show the role selector and registration fields. Caption: “Figure 1. HireFlow account registration.”]

### 3.2 Logging in

1. Open the HireFlow login screen.
2. Enter your registered username or email address in **Username or name@example.com**.
3. Enter your password.
4. Select **Log in**.
5. If the credentials are incorrect, check the username/email and password and try again.

The app can restore a saved session when it is reopened on the same device. To end the session, use the logout option described in Section 8.4.

[SCREENSHOT 02 — Insert an actual capture of the Login screen. Caption: “Figure 2. HireFlow login screen.”]

## 4. Employee (Job Seeker) Guide

Employees can browse available jobs, view job details, submit applications, track application progress, and maintain their profile.

### 4.1 Completing the employee profile after registration

After registering as an employee, complete the onboarding screens in order:

**Step 1 — Basic Information**
1. Enter the requested personal and contact information.
2. Review the entries for accuracy.
3. Select **Next** to continue.

**Step 2 — Birthdate**
1. Use the date selector to choose your birth month, day, and year.
2. Confirm that the selected date is correct.
3. Continue to the next step.

**Step 3 — Educational Background**
1. Add your tertiary education details.
2. If applicable, indicate whether you currently study at the institution.
3. Use **Add another tertiary education** to add another tertiary entry.
4. Complete the High School, Elementary, or Other education sections when applicable.
5. Remove an entry if it was added by mistake.
6. Continue when the information is complete.

**Step 4 — Work Experience**
1. Enter details for a previous or current job, where applicable.
2. Indicate if you currently work in the role when the option is available.
3. Select **Add another work experience** to add another entry.
4. Remove any incorrect entry.
5. Continue to the profile-photo step.

**Step 5 — Profile Photo**
1. Select the photo area to choose an image from the device.
2. Grant photo-library permission if prompted.
3. Choose the image you want to use.
4. Continue to the application. The photo step can be skipped and changed later from the profile.

[SCREENSHOT 03 — Insert an actual capture of the employee onboarding flow. Ideally show the Basic Information or Education screen. Caption: “Figure 3. Employee profile setup.”]

### 4.2 Navigating the employee home screen

1. Log in using an employee account.
2. The **Home** tab displays job opportunities available in HireFlow.
3. Use the **Search jobs...** field to search by job-related text.
4. Select an employment-type filter to narrow the listings. Available filter values are **All**, **Full-time**, **Part-time**, and **Contractual**.
5. Review the job cards.
6. Select a job card or its apply/details action to open the job details screen.

If no listing matches the search or filter, HireFlow displays a message asking you to try another keyword or filter.

[SCREENSHOT 04 — Insert an actual capture of the employee Home screen showing job cards, search and employment-type filters. Caption: “Figure 4. Employee home screen and job search.”]

### 4.3 Reviewing a job listing

1. From Home, open the job you want to review.
2. Read the job title, company, location, and work information.
3. Review **Job Description**.
4. Read the **Responsibilities** list.
5. Review **Salary Information**.
6. Read the **About [Company]** information, when available.
7. Decide whether you want to apply.

If the job cannot be found, the app displays **Job not found**. Return to Home and select another listing.

[SCREENSHOT 05 — Insert an actual capture of a Job Details screen. Include the description, responsibilities and salary area. Caption: “Figure 5. Job details and application information.”]

### 4.4 Applying for a job

1. Open the job details screen for the position you want.
2. Review the job information before applying.
3. Follow the on-screen application action and provide a cover letter if the application form requests one.
4. Submit the application.
5. Return to the **Applications** tab to check that the application appears in your list.

The job details screen can show an already-applied message and provide a route to view applications. Do not submit duplicate applications for the same opportunity.

### 4.5 Tracking and managing applications

1. Select **Applications** in the bottom navigation.
2. Use **Search applications...** to search by job title or company.
3. Select a status filter:
   - **All**
   - **Pending**
   - **Accepted**
   - **Declined**
   - **Completed**
4. Review the application cards and their current status.
5. Where the card provides the relevant actions, use the edit/update option to change your cover letter or the withdraw option to withdraw your application.

If the list is empty, submit an application from a job listing first. If no results appear after filtering, change the search term or choose **All**.

[SCREENSHOT 06 — Insert an actual capture of the Applications screen showing the status filters and at least one application card. Caption: “Figure 6. Employee application tracking.”]

### 4.6 Viewing and editing the employee profile

1. Select **Profile** in the bottom navigation.
2. Review the profile information and the available profile sections.
3. Use the section tabs to view **Education**, **Experience**, and other profile information.
4. Use the available edit controls to update a profile entry or section.
5. Save the changes using the action shown in the editor.
6. To change the profile photo or cover photo, select the relevant photo area and follow the photo-selection prompt.

The profile supports editing personal details and profile content, including education, experience, certificates, and an About section. The exact editable sections depend on the profile area selected.

[SCREENSHOT 07 — Insert an actual capture of the Employee Profile screen. Caption: “Figure 7. Employee profile and profile sections.”]

## 5. Employer Guide

Employers can publish and manage job listings and review applications submitted by employees.

### 5.1 Navigating the employer home screen

1. Log in using an employer account.
2. The **Home** tab is available from the bottom navigation.
3. Review the job listings shown.
4. Use the search field and available employment-type filters to find a listing.
5. Open a listing to review its details.

Employer accounts have different navigation from employee accounts. The employer navigation includes **Home**, **My Jobs**, and **Applicants**.

### 5.2 Publishing a job

1. Select **My Jobs** in the bottom navigation.
2. Open the job-publishing form.
3. Enter the **Job Title**.
4. Enter the **Company** name.
5. Add a company logo if desired:
   - Select the logo upload control.
   - Grant photo-library permission if prompted.
   - Choose a PNG or JPG image.
   - If no logo is selected, HireFlow uses its default logo.
6. Enter the job **Location**.
7. Enter the **Description**.
8. Enter the **Responsibilities**. Add each responsibility on a separate line.
9. Enter the **Salary** as a valid non-negative number.
10. Select the **Employment Type**: Full-time, Part-time, or Contractual.
11. Select the **Work Mode**: On-site, Remote, or Hybrid.
12. Review the information and use the form's publish/save action.

A job title, company name, description, and valid salary are required. If a required value is missing or invalid, the form displays an error. Correct the information and submit again.

[SCREENSHOT 08 — Insert an actual capture of the My Jobs publishing form. Caption: “Figure 8. Employer job-publishing form.”]

### 5.3 Managing existing job listings

1. Open **My Jobs**.
2. Review the listings created by the signed-in employer.
3. Use the search field to find a job by title, company, or location.
4. Use the edit control on a listing to load its information into the editing form.
5. Update the fields that need to change.
6. Save the edited listing.
7. Use the delete control if a listing must be removed. Review any confirmation prompt before proceeding.
8. Use the listing's open/closed control where available to change its status.

The My Jobs screen also shows an empty state when the employer has not published any jobs yet.

[SCREENSHOT 09 — Insert an actual capture of the My Jobs management list showing listing actions. Caption: “Figure 9. Employer job-listing management.”]

### 5.4 Reviewing applicants

1. Select **Applicants** in the bottom navigation.
2. Review the applications submitted to the employer's job listings.
3. Use the search field to search applicant names or keywords.
4. Use the job-type filters to narrow the applicant list.
5. Select an applicant/application to open its details.
6. Review the employee's profile information and submitted cover letter.
7. Review the application status.
8. Use the available status controls to update the application as appropriate.
9. If an application must be removed, use the delete action and confirm the action if prompted.

If no applications have been received, the screen explains that applicants will appear after someone applies to one of the employer's listings. If no jobs have been published, publish a listing first.

[SCREENSHOT 10 — Insert an actual capture of the Applicants screen showing the search/filter controls and applicant cards. Caption: “Figure 10. Employer applicant management.”]

[SCREENSHOT 11 — Insert an actual capture of an individual applicant/application details screen. Caption: “Figure 11. Applicant profile, cover letter and application status.”]

## 6. Notifications

Employees and employers can access notifications from the notification icon in the application header.

1. Select the notification icon.
2. Review the notification title, message, and time.
3. Select a notification to open the related application or applicant area.
4. Return to the previous screen when finished.

Unread notifications are marked with an indicator. Opening a notification marks it as read. Returning from the Notifications screen also marks the user's notifications as read.

[SCREENSHOT 12 — Insert an actual capture of the Notifications screen showing at least one notification. Caption: “Figure 12. HireFlow notifications.”]

## 7. Navigation Reference

The bottom navigation depends on the account role.

| Navigation item | Employee | Employer |
|---|---:|---:|
| Home | Yes | Yes |
| Applications | Yes | No |
| Profile | Yes | No |
| My Jobs | No | Yes |
| Applicants | No | Yes |

Use the bottom navigation to switch between the available sections. Some detail screens provide a back control to return to the previous screen.

## 8. Common Tasks and Troubleshooting

### 8.1 I cannot create an account
- Check that the username has at least three characters.
- Use only letters, numbers, periods, and underscores in the username.
- Check that the email address is valid.
- Use a password with at least six characters.
- Make sure the confirmation password matches.
- Try a different username or email if either is already registered.

### 8.2 I cannot log in
- Check whether you entered your username or email correctly.
- Check the password and capitalization.
- For the built-in demonstration accounts, use the credentials in Section 2.2.
- If you registered on another device, note that accounts are stored locally in the current implementation and may not be available on that other device.

### 8.3 I cannot find a job or application
- Clear or revise the search text.
- Set the status or employment-type filter to **All**.
- Confirm that the job listing still exists.

### 8.4 Logging out
1. Open the employer Applicants area where the logout control is provided.
2. Open the menu using the menu/profile control.
3. Select the logout option.
4. Confirm that you want to log out.

The current implementation exposes the logout menu from the employer applicant-management screen. Employee logout availability should be verified in the running build before this manual is treated as final for an employee-facing release.

### 8.5 Photo upload does not work
- Allow HireFlow to access the device's photo library.
- Choose a supported image format where the screen specifies one.
- If permission was denied, update the app's photo permission in the device settings and try again.

## 9. Important Notes About the Current Version

The following limitations are present in the supplied source code and should be understood when using the application:

- HireFlow currently uses local device storage for accounts, sessions, profiles, jobs, applications, and notifications. It is not connected to a production backend.
- Built-in demo accounts are included for testing.
- Job listings and user records are managed through the application's local contexts and storage; data should not be assumed to synchronize across devices.
- The current authentication implementation stores registered account information locally and is explicitly marked in the source as unsuitable for production security. Do not use real or reused passwords in a public deployment.
- Some screens display sample or seeded content to demonstrate the workflow.
- This manual documents the functionality found in the supplied project source. Interface wording and layout may change as the application is developed.

## 10. Screenshot Completion Checklist

The supplied project archive contains application source code and branding assets, but it does not contain screenshots of the running application. The figure callouts in this document identify the exact screens that need to be captured from the running app. Replace each callout with a genuine screenshot before submitting the final manual.

For consistent screenshots:

1. Run the application using the steps in Section 2.1.
2. Capture the screen on a phone or emulator at a readable resolution.
3. Use the employee demo account for employee screens and the employer demo account for employer screens.
4. Populate the app with demonstration data where necessary so the job cards, application cards, and notification screens are not empty.
5. Crop screenshots to the app interface without cutting off important controls or text.
6. Save the images in a folder named `screenshots` beside this manual.
7. Replace each `[SCREENSHOT ...]` callout with a Markdown image, for example:

   ```markdown
   ![Figure 1. HireFlow account registration](./screenshots/01-registration.png)
   ```

8. Ensure that screenshots do not expose real personal information, private email addresses, or passwords.

---

**End of User Manual**
