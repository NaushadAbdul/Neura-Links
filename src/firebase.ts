import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  deleteUser,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration (Public client config)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC8WZkOZvcsR3W3ZU2rvXwGp9idiY8eLqU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "club-b35f3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "club-b35f3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "club-b35f3.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1012598614314",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1012598614314:web:5eded22460f844f7439653",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-2RC1QFGVSP"
};

// Initialize Firebase App safely
let app;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  console.warn("Firebase App Initialization Notice:", e);
  app = getApps()[0];
}

// Firebase Analytics (browser environment only)
export const analytics = typeof window !== 'undefined' && app ? getAnalytics(app) : null;

// Initialize Firebase Authentication, Firestore, and Storage with tab-scoped session persistence
export const auth = app ? getAuth(app) : null as any;
if (auth) {
  setPersistence(auth, browserSessionPersistence).catch((err) => {
    console.warn("Firebase tab-session persistence notice:", err);
  });
}

export const db = app ? getFirestore(app) : null as any;
export const storage = app ? getStorage(app) : null as any;

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  deleteUser,
  doc,
  deleteDoc
};
export type { FirebaseUser };


