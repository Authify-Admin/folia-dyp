import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const isNew = getApps().length === 0;
const app = isNew ? initializeApp(firebaseConfig) : getApp();

// ignoreUndefinedProperties: skip undefined fields instead of throwing
// "Unsupported field value: undefined". Optional fields (variants, images,
// userId, coupon extras…) can then be safely omitted on writes.
const db = isNew
  ? initializeFirestore(app, { ignoreUndefinedProperties: true })
  : getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
