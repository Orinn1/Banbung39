import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC66khE6ytk8KbZHeGbc5fPwqKcqmgQ16E',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'banbung39-1d2e7.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'banbung39-1d2e7',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'banbung39-1d2e7.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '331146198142',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:331146198142:web:540ab43631a213781f2c2f',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-ZCJHGYWRRG',
};

// Initialize Firebase App instance safely (prevent duplicate re-initialization)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore Database & Cloud Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage, firebaseConfig };
export default app;
