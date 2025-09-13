# Authentication Setup Guide

This guide will help you set up Firebase authentication with Google sign-in for your Maintenance application.

## Prerequisites

- Node.js and npm installed
- Firebase account
- Google Cloud Console access

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "maintenance-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"
5. Enable "Google" authentication:
   - Click on "Google"
   - Toggle "Enable"
   - Add your authorized domain (localhost for development)
   - Click "Save"

## Step 3: Get Firebase Configuration

1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and choose "Web"
4. Register your app with a nickname (e.g., "maintenance-web")
5. Copy the configuration object

## Step 4: Update Firebase Configuration

1. Open `src/environments/firebase.config.ts`
2. Replace the placeholder values with your actual Firebase configuration:

```typescript
export const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Configure Google OAuth (Optional)

For Google sign-in to work properly in production:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to "APIs & Services" > "Credentials"
4. Create an OAuth 2.0 client ID for web application
5. Add your domain to authorized origins

## Step 6: Test the Application

1. Run the development server:
   ```bash
   npm start
   ```

2. Navigate to `http://localhost:4200`
3. You should be redirected to the login page
4. Test both email/password and Google sign-in

## Features Included

### Login Page (`/login`)
- Email/password authentication
- Google sign-in
- Form validation
- Password visibility toggle
- Forgot password link
- Link to registration

### Registration Page (`/register`)
- User registration with email/password
- Google sign-in for registration
- Password confirmation validation
- Form validation
- Link to login

### Forgot Password Page (`/forgot-password`)
- Email-based password reset
- Success confirmation
- Link back to login

### Dashboard (`/dashboard`)
- Welcome message with user's name
- Quick access to vehicles and workshops
- Sign out functionality

## Security Features

- Route guards for protected pages
- Form validation
- Error handling
- Loading states
- Secure password requirements

## Styling

The authentication pages feature:
- Beautiful gradient backgrounds
- Glassmorphism design
- Smooth animations
- Responsive layout
- Modern UI/UX

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Make sure your Firebase configuration is correct
2. **Google sign-in not working**: Check that Google authentication is enabled in Firebase
3. **CORS errors**: Ensure your domain is added to authorized domains in Firebase
4. **Build errors**: Make sure all dependencies are installed with `npm install`

### Development vs Production

- For development, use `localhost` in Firebase authorized domains
- For production, add your actual domain to Firebase authorized domains
- Update the Firebase configuration for production environment

## Next Steps

1. Add user profile management
2. Implement role-based access control
3. Add email verification
4. Set up user data storage in Firestore
5. Add more authentication providers (Facebook, Twitter, etc.)

## Support

If you encounter any issues, check:
1. Firebase console for authentication logs
2. Browser console for JavaScript errors
3. Network tab for API request failures 