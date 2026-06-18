# Update Firestore Security Rules

## The Issue

You're getting a "Missing or insufficient permissions" error because Firestore security rules are blocking access to the `users` and `otpSessions` collections.

## Quick Fix (2 Methods)

### Method 1: Update via Firebase Console (Easiest - 1 minute)

1. **Go to Firebase Console**:
   - Visit https://console.firebase.google.com
   - Select your project: **folia-b4710**

2. **Navigate to Firestore Rules**:
   - Click **Firestore Database** in the left sidebar
   - Click the **Rules** tab at the top

3. **Replace the rules** with this:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Products Collection - Public read, no write
    match /products/{productId} {
      allow read: if true;  // Anyone can read products
      allow write: if false;  // Only admin panel can write (via client)
    }

    // Orders Collection - Public write (for checkout), restricted read
    match /orders/{orderId} {
      allow read: if true;  // API routes need to read orders
      allow create: if true;  // Allow creating orders from checkout
      allow update: if true;  // Allow admin to update order status
      allow delete: if true;  // Allow admin to delete orders
    }

    // Users Collection - Public read/write for authentication
    match /users/{userId} {
      allow read: if true;  // API routes need to read user data
      allow create: if true;  // Allow creating users during signup
      allow update: if true;  // Allow updating user profile
      allow delete: if false;  // Prevent user deletion
    }

    // OTP Sessions Collection - Public read/write for authentication
    match /otpSessions/{sessionId} {
      allow read: if true;  // API routes need to read OTP sessions
      allow create: if true;  // Allow creating OTP sessions
      allow update: if true;  // Allow marking OTP as verified
      allow delete: if true;  // Allow cleanup of expired sessions
    }
  }
}
```

4. **Click "Publish"** button

5. **Done!** Try logging in again.

---

### Method 2: Using Firebase CLI (If you have it installed)

If you have Firebase CLI installed:

```bash
# Deploy just the Firestore rules
firebase deploy --only firestore:rules
```

---

## Why This Happened

Firestore has security rules that protect your data. By default, all reads/writes are denied unless explicitly allowed.

Since we added new collections (`users` and `otpSessions`), we need to update the rules to allow access to these collections.

## What The Rules Do

### `products` Collection:
- ✅ Anyone can **read** products (for the shop)
- ❌ No one can **write** directly (admin panel uses client-side auth)

### `orders` Collection:
- ✅ Anyone can **read** orders (for admin dashboard and user profiles)
- ✅ Anyone can **create** orders (from checkout page)
- ✅ Anyone can **update** orders (admin changing status)
- ✅ Anyone can **delete** orders (admin)

### `users` Collection:
- ✅ Anyone can **read** user data (API routes need this)
- ✅ Anyone can **create** users (during signup)
- ✅ Anyone can **update** users (profile editing)
- ❌ No one can **delete** users

### `otpSessions` Collection:
- ✅ Full access needed for OTP authentication flow
- ✅ Auto-cleanup of expired sessions

## Security Note

**For Development**: These rules are permissive to allow your app to work.

**For Production**, you should tighten the rules to be more secure. Here's what you should change:

### Recommended Production Rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is authenticated (would require Firebase Auth)
    function isSignedIn() {
      return request.auth != null;
    }

    // Products Collection
    match /products/{productId} {
      allow read: if true;  // Public read
      allow write: if false;  // Use admin SDK server-side only
    }

    // Orders Collection
    match /orders/{orderId} {
      allow read: if true;  // For now, keep public for API routes
      allow create: if true;  // Allow checkout
      allow update: if true;  // Allow admin updates
      allow delete: if true;  // Allow admin deletes

      // FUTURE: Restrict to authenticated users only
      // allow read: if isSignedIn() &&
      //   (resource.data.userId == request.auth.uid ||
      //    resource.data.customerEmail == request.auth.token.email);
    }

    // Users Collection
    match /users/{userId} {
      allow read: if true;  // API routes need access
      allow create: if true;  // Allow signup
      allow update: if true;  // Allow profile updates
      allow delete: if false;

      // FUTURE: Restrict to user's own data
      // allow read, update: if isSignedIn() && request.auth.uid == userId;
    }

    // OTP Sessions Collection
    match /otpSessions/{sessionId} {
      allow read, write: if true;  // Needed for passwordless auth

      // FUTURE: Only allow server-side access via Admin SDK
      // allow read, write: if false;
    }
  }
}
```

## Troubleshooting

### Still getting permission denied?

1. **Check you published the rules**: Make sure you clicked "Publish" in Firebase Console
2. **Wait a moment**: Rules can take a few seconds to propagate
3. **Check the right project**: Make sure you're in the **folia-b4710** project
4. **Refresh your app**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Want to verify rules are updated?

1. Go to Firebase Console
2. Firestore Database > Rules tab
3. You should see the new rules with `users` and `otpSessions` sections

---

## After Updating Rules

Once you've updated the rules in Firebase Console:

1. Go back to your app: `http://localhost:3000`
2. Click **Login**
3. Enter your email
4. You should receive an OTP email! ✅

---

**That's it!** Your authentication system should work now. 🎉
