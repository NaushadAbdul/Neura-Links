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

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://dekuofficiaal734_db_user:So6E27e6vUJJC4LK@cluster0.w9rnqlz.mongodb.net/neura_links_club?retryWrites=true&w=majority';

// List of real student & admin emails to preserve
const REAL_EMAILS_TO_KEEP = [
  'naushadabdul2006@gmail.com',
  'manikrishnavenkata2007@gmail.com',
  'vallurinithin31@gmail.com',
  'tejaswinisaginala@gmail.com',
  'r10348521@gmail.com',
  'loukikagogireddy@gmail.com',
  'vidyasrikhareedu@gmail.com',
  'rabillimanohar0103@gmail.com',
  'sneha2006@gmail.com'
];

async function removeSyntheticMockAccounts() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas!');

    const allUsers = await models.User.find({}).lean();
    console.log(`📋 Found total ${allUsers.length} users in MongoDB Atlas.`);

    let removedCount = 0;
    for (const u of allUsers) {
      const emailLower = (u.email || '').toLowerCase().trim();
      const isReal = REAL_EMAILS_TO_KEEP.some(e => e.toLowerCase() === emailLower);
      const isMockAvatar = u.avatar && u.avatar.includes('photo-1570295999919-56ceb5ecca61');
      const isDummyEmail = emailLower.includes('@neuralinks.club') || emailLower.startsWith('user_') || emailLower.includes('livestudent') || emailLower.includes('test');

      if (!isReal || isMockAvatar || isDummyEmail) {
        await models.User.deleteOne({ _id: u._id });
        await models.StudentProfile.deleteOne({ userId: u.id });
        console.log(`🗑️ Removed synthetic mock account: ${u.name} (${u.email}) [ID: ${u.id}]`);
        removedCount++;
      } else {
        console.log(`✅ KEPT REAL USER: ${u.name} (${u.email})`);
      }
    }

    console.log(`\n🎉 SUCCESS! Cleaned up ${removedCount} synthetic mock profiles from MongoDB Atlas!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Clean error:', err);
    process.exit(1);
  }
}

removeSyntheticMockAccounts();
