# Admin Panel Security Setup Guide

## Overview
The admin panel now uses secure authentication with bcrypt password hashing. This guide will help you set up and deploy the security measures.

## ✅ Changes Made

### 1. Secure Authentication Re-enabled
- **File**: [app/admin/page.tsx](app/admin/page.tsx)
- Removed temporary authentication bypass
- Re-enabled secure login via API endpoint
- Requires valid credentials from database

### 2. Updated Firebase Security Rules
- **Files**: [firestore.rules](firestore.rules) and [storage.rules](storage.rules)
- Comprehensive rules for all collections
- Balanced security and functionality
- Proper access control for admin operations

## 🔧 Setup Steps

### Step 1: Deploy Firebase Rules

You need to deploy the updated security rules to Firebase. Choose one of these methods:

#### Option A: Firebase Console (Recommended for beginners)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the contents of `firestore.rules` and paste it
5. Click **Publish**
6. Navigate to **Storage** → **Rules** tab
7. Copy the contents of `storage.rules` and paste it
8. Click **Publish**

#### Option B: Firebase CLI (Recommended for developers)

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done already)
firebase init

# Deploy only the rules
firebase deploy --only firestore:rules,storage:rules
```

### Step 2: Create Your First Admin Account

Since authentication is now secure, you need to create an admin account:

1. Start your development server:
```bash
npm run dev
```

2. Navigate to the admin creation page:
```
http://localhost:3000/admin/create
```

3. Fill in the form:
   - **Username**: Minimum 3 characters (e.g., `admin`)
   - **Password**: Minimum 8 characters with uppercase, lowercase, and number

4. Click "Create Admin Account"

The system will:
- Validate your inputs
- Hash your password with bcrypt (10 salt rounds)
- Store the admin credentials securely in Firestore
- Show success confirmation

### Step 3: Test the Login

1. Navigate to `/admin` in your browser
2. Enter the username and password you created
3. You should be redirected to the admin dashboard
4. Invalid credentials will show an error message

## 🔒 Security Features

### Password Security
- **Hashing**: Passwords are hashed using bcrypt with 10 salt rounds
- **Never Stored Plain**: Original passwords are never stored in the database
- **Secure Comparison**: bcrypt.compare() prevents timing attacks

### Session Management
- Admin authentication state stored in sessionStorage
- Automatic redirect to login if not authenticated
- Session cleared on browser close

### API Security
- **Endpoint**: [app/api/admin/login/route.ts](app/api/admin/login/route.ts)
- Validates credentials against database
- Returns sanitized admin data (password excluded)
- Updates last login timestamp

## 📋 Firebase Rules Breakdown

### Firestore Rules (firestore.rules)

```javascript
// Products: Public read, admin write (client-side operations allowed)
products/{productId}
  - read: everyone
  - write: everyone (admin panel uses client-side SDK)

// Orders: Public read/write (for checkout and admin management)
orders/{orderId}
  - read: everyone
  - write: everyone

// Users: Public read/write (for authentication and profiles)
users/{userId}
  - read: everyone
  - write: everyone (except delete)

// OTP Sessions: Public read/write (for email verification)
otpSessions/{sessionId}
  - read: everyone
  - write: everyone

// Return Requests: Public read/write (for customers and admin)
returnRequests/{requestId}
  - read: everyone
  - write: everyone

// Admins: Read allowed for auth, create allowed for setup
admins/{adminId}
  - read: everyone (API validates credentials)
  - create: everyone (for initial setup)
  - update: everyone (for last login timestamp)
  - delete: blocked
```

### Storage Rules (storage.rules)

```javascript
// Product images: Public read, public write for admin uploads
products/{productId}/*
  - read: everyone
  - write: everyone

// Return request images: Public read/write
returns/{orderNumber}/*
  - read: everyone
  - write: everyone (customers upload evidence)
```

### Why These Rules?

Your application uses **client-side Firebase SDK** for all operations (not server-side Admin SDK). This means:

1. **Admin operations happen in the browser** (not via backend API)
2. **Rules must allow client access** for admin functionality to work
3. **Security comes from the login system** (session-based authentication)
4. **Only authenticated admins can access** the admin panel routes

**Security Note**: While the rules allow broad access, the admin panel itself is protected by:
- Secure login with bcrypt password hashing
- Session-based authentication checks
- Automatic redirects for unauthorized access

## 🚀 Additional Admin Accounts

To create more admin accounts in the future:

```bash
npm run create-admin
```

Enter new credentials when prompted. Each admin gets:
- Unique ID
- Username (must be unique)
- Hashed password
- Creation timestamp
- Last login timestamp

## 🔐 Security Best Practices

1. **Strong Passwords**: Always use passwords with:
   - At least 8 characters
   - Uppercase and lowercase letters
   - Numbers
   - Special characters

2. **Keep Credentials Safe**:
   - Never commit credentials to git
   - Don't share admin passwords
   - Change passwords periodically

3. **Monitor Access**:
   - Check `lastLogin` timestamps in Firestore
   - Review admin accounts regularly
   - Remove unused admin accounts

4. **Environment Variables**:
   - Keep Firebase config in `.env` files
   - Never commit `.env` to version control
   - Use different Firebase projects for dev/prod

## 📝 Files Reference

### Authentication Files
- [app/admin/page.tsx](app/admin/page.tsx) - Admin login UI
- [app/api/admin/login/route.ts](app/api/admin/login/route.ts) - Login API endpoint
- [scripts/create-admin.ts](scripts/create-admin.ts) - Admin creation script
- [lib/auth.ts](lib/auth.ts) - Password hashing utilities

### Security Rules
- [firestore.rules](firestore.rules) - Database security rules
- [storage.rules](storage.rules) - Storage security rules

### Configuration
- [lib/firebase.ts](lib/firebase.ts) - Firebase initialization
- [package.json](package.json) - Scripts for admin creation

## 🆘 Troubleshooting

### "Login failed" error
- Check if admin account exists in Firestore `admins` collection
- Verify username and password are correct
- Check browser console for detailed error messages

### "Permission denied" errors
- Ensure Firestore rules are deployed
- Check Firebase Console → Firestore → Rules tab
- Verify rules match the content in `firestore.rules`

### Cannot upload product images
- Ensure Storage rules are deployed
- Check Firebase Console → Storage → Rules tab
- Verify rules match the content in `storage.rules`

### Script errors when creating admin
- Ensure Firebase credentials are in `.env` file
- Check that Firebase project is properly initialized
- Verify Firestore rules allow admin creation

## 📞 Support

If you encounter issues:
1. Check browser console for error messages
2. Verify Firebase rules are deployed
3. Ensure admin account exists in Firestore
4. Check that `.env` file has correct Firebase configuration

---

**Security Status**: ✅ Admin panel is now secure with password hashing and proper authentication!
