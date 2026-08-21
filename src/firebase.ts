import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Provided Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyC8WZkOZvcsR3W3ZU2rvXwGp9idiY8eLqU",
  authDomain: "club-b35f3.firebaseapp.com",
  projectId: "club-b35f3",
  storageBucket: "club-b35f3.firebasestorage.app",
  messagingSenderId: "1012598614314",
  appId: "1:1012598614314:web:5eded22460f844f7439653",
  measurementId: "G-2RC1QFGVSP"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Analytics (browser environment only)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Firebase Authentication, Firestore, and Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  signInWithPopup,
  updateProfile
};
export type { FirebaseUser };

