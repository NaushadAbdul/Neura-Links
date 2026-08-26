import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import * as models from '../server/models/schemas.js';

dotenv.config();

if (dns.setServers) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyC8WZkOZvcsR3W3ZU2rvXwGp9idiY8eLqU",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "club-b35f3.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "club-b35f3",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "club-b35f3.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1012598614314",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:1012598614314:web:5eded22460f844f7439653",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://dekuofficiaal734_db_user:So6E27e6vUJJC4LK@cluster0.w9rnqlz.mongodb.net/neura_links_club?retryWrites=true&w=majority';

async function syncAllFirestoreUsersToMongo() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas!');

    console.log('📡 Fetching registered users directly from Firebase Firestore...');
    const querySnapshot = await getDocs(collection(db, 'users'));
    console.log(`📥 Retrieved ${querySnapshot.size} user documents from Firebase Firestore!`);

    let syncedCount = 0;
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      const id = docSnap.id;
      const email = (data.email || `${id}@student.club`).toLowerCase().trim();
      const name = data.name || data.displayName || email.split('@')[0] || 'Club Student';
      const avatar = data.avatar || data.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
      const role = data.role === 'admin' || email === 'admin@neuralinks.club' ? 'admin' : 'student';
      const status = data.status || 'active';
      const joinedDate = data.createdAt || data.joinedDate || new Date().toISOString().split('T')[0];
      const authProvider = data.authProvider || 'google';

      const userDoc = {
        id,
        name,
        email,
        avatar,
        role,
        status,
        joinedDate,
        authProvider,
      };

      try {
        // Upsert by email or id
        await models.User.findOneAndUpdate({ $or: [{ id }, { email }] }, userDoc, { upsert: true, returnDocument: 'after' });
        console.log(`✅ Synced student to MongoDB Atlas: ${name} (${email}) [ID: ${id}]`);
        syncedCount++;
      } catch (err) {
        console.warn(`⚠️ Warning syncing user ${name} (${email}):`, err.message);
      }
    }

    console.log(`\n🎉 SUCCESS! Fully synced ${syncedCount} real registered students from Firebase to MongoDB Atlas!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during sync:', error);
    process.exit(1);
  }
}

syncAllFirestoreUsersToMongo();
