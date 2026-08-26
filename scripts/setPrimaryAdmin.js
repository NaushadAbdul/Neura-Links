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

const mongoUri = process.env.MONGODB_URI;

async function setPrimaryAdminAccount() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas!');

    // Remove legacy placeholder admin record to prevent index collision
    await models.User.deleteOne({ id: 'user_admin_01' });

    // Update naushadabdul2006@gmail.com to role: 'admin'
    const updatedAdmin = await models.User.findOneAndUpdate(
      { email: 'naushadabdul2006@gmail.com' },
      {
        $set: {
          role: 'admin',
          name: 'Naushad Abdul (Admin)',
          status: 'active',
        }
      },
      { upsert: true, returnDocument: 'after' }
    );

    console.log('🎉 PRIMARY ADMIN SET SUCCESSFULLY:', updatedAdmin);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error setting primary admin:', err);
    process.exit(1);
  }
}

setPrimaryAdminAccount();
