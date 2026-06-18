# Firebase Setup Guide for Folia

This guide will walk you through setting up Google Firebase for your Folia e-commerce application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `folia-ecommerce` (or your preferred name)
4. Click "Continue"
5. Choose whether to enable Google Analytics (optional)
6. Click "Create project"
7. Wait for the project to be created, then click "Continue"

## Step 2: Register Your Web App

1. In the Firebase console, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `Folia Web App`
3. Check "Also set up Firebase Hosting" if you want to deploy to Firebase Hosting (optional)
4. Click "Register app"
5. **Copy the configuration values** - you'll need these for the next step

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Example:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz123456
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=folia-ecommerce.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=folia-ecommerce
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=folia-ecommerce.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ
```

## Step 4: Set Up Cloud Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** or **Test mode**:
   - **Test mode**: Easier for development (public read/write for 30 days)
   - **Production mode**: Secure (requires auth, recommended for production)
4. Choose a Cloud Firestore location (select closest to your users)
5. Click "Enable"

### Recommended Security Rules (for Production)

After creating your database, go to the "Rules" tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection - public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // Add proper admin auth later
    }

    // Orders collection - authenticated users
    match /orders/{orderId} {
      allow read: if true; // Adjust based on your needs
      allow create: if true; // Allow order creation from checkout
      allow update: if request.auth != null; // Admin only
      allow delete: if request.auth != null; // Admin only
    }
  }
}
```

**Note:** These rules allow public access for now. Update them with proper authentication once you implement admin auth.

## Step 5: Set Up Firebase Storage

1. In Firebase Console, go to **Build** → **Storage**
2. Click "Get started"
3. Choose **Production mode** or **Test mode** (same as Firestore)
4. Choose a location (same as Firestore for consistency)
5. Click "Done"

### Recommended Storage Rules

Go to the "Rules" tab in Storage and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Product images - anyone can read, authenticated users can write
    match /products/{productId}/{imageFile} {
      allow read: if true;
      allow write: if request.auth != null; // Add proper admin auth later
      allow delete: if request.auth != null; // Admin only
    }
  }
}
```

## Step 6: Update .gitignore

Make sure `.env.local` is in your `.gitignore` file (it should already be there):

```
.env.local
.env*.local
```

## Step 7: Start Your Application

1. Stop any running dev servers
2. Start the development server:

```bash
npm run dev
```

3. Navigate to `/admin` to log in
4. Go to **Products** and try adding a product with multiple images!

## Features Now Available

### Multi-Image Upload
- Upload up to 10 images per product
- Drag and drop to reorder images
- First image becomes the primary product image
- Images are stored in Firebase Storage
- Image URLs are saved in Firestore

### Firebase Firestore Database
- Replaced localStorage with Firestore
- Products are stored in `products` collection
- Orders are stored in `orders` collection
- Real-time sync across all clients
- Automatic quantity reduction on orders

### Firebase Storage
- Images organized by product ID: `/products/{productId}/`
- Secure download URLs for images
- Automatic cleanup when products are deleted

## Troubleshooting

### Configuration Errors
- **Error:** "Firebase: No Firebase App '[DEFAULT]' has been created"
  - **Solution:** Make sure `.env.local` has all the correct Firebase config values
  - **Solution:** Restart your dev server after updating `.env.local`

### Permission Errors
- **Error:** "Missing or insufficient permissions"
  - **Solution:** Check your Firestore security rules
  - **Solution:** For development, temporarily use Test Mode

### Image Upload Errors
- **Error:** "Storage: User does not have permission"
  - **Solution:** Check your Firebase Storage security rules
  - **Solution:** Make sure the storage bucket name is correct in `.env.local`

### Build Errors
- **Error:** Module not found errors
  - **Solution:** Run `npm install` again
  - **Solution:** Delete `node_modules` and `.next`, then run `npm install`

## Next Steps

1. **Add Authentication:** Implement proper admin authentication using Firebase Auth
2. **Update Security Rules:** Replace test rules with production-ready rules
3. **Add Indexes:** Create composite indexes in Firestore for complex queries
4. **Set Up Backups:** Enable automatic backups for Firestore
5. **Monitor Usage:** Set up Firebase usage alerts

## Support

- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com/
- Next.js Firebase Guide: https://firebase.google.com/docs/web/setup

## Important Notes

- **Never commit `.env.local` to version control**
- **Update security rules before going to production**
- **Monitor Firebase usage to avoid unexpected costs**
- **Set up billing alerts in Firebase Console**
- **Back up your Firestore data regularly**
