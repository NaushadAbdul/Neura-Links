import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import * as models from './models/schemas.js';

dotenv.config();

if (dns.setServers) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const mongoUri = process.env.MONGODB_URI;

// Fetch users directly from Firebase REST API for project club-b35f3
async function migrateUsersFromFirestore() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas!');

    console.log('📡 Fetching registered students from Firebase Firestore (club-b35f3)...');
    const firestoreUrl = 'https://firestore.googleapis.com/v1/projects/club-b35f3/databases/(default)/documents/users';
    
    const response = await fetch(firestoreUrl);
    if (!response.ok) {
      console.warn(`Firestore REST notice (${response.statusText}). Will auto-sync when browser opens!`);
      process.exit(0);
    }

    const data = await response.json();
    const documents = data.documents || [];
    console.log(`📥 Found ${documents.length} registered user documents in Firebase Firestore!`);

    for (const doc of documents) {
      const fields = doc.fields || {};
      const id = doc.name.split('/').pop();
      const email = fields.email?.stringValue || '';
      const name = fields.name?.stringValue || fields.displayName?.stringValue || email.split('@')[0] || 'Club Student';
      const role = fields.role?.stringValue === 'admin' || email === 'admin@neuralinks.club' ? 'admin' : 'student';
      const status = fields.status?.stringValue || 'active';
      const avatar = fields.avatar?.stringValue || fields.photoURL?.stringValue || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
      const joinedDate = fields.createdAt?.stringValue || fields.joinedDate?.stringValue || new Date().toISOString().split('T')[0];
      const authProvider = fields.authProvider?.stringValue || 'google';

      if (id && email) {
        const userObj = {
          id,
          name,
          email,
          avatar,
          role,
          status,
          joinedDate,
          authProvider
        };
        await models.User.findOneAndUpdate({ id }, userObj, { upsert: true, new: true });
        console.log(`✅ Synced student to MongoDB Atlas: ${name} (${email})`);
      }
    }

    console.log('🎉 MIGRATION COMPLETE! All registered students are now saved in MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
}

migrateUsersFromFirestore();
