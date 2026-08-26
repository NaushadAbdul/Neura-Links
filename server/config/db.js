import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Ensure reliable DNS resolution for MongoDB Atlas SRV records across Windows & ISPs
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (dnsErr) {
  console.warn('DNS server configuration notice:', dnsErr);
}

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn('⚠️ MONGODB_URI environment variable is missing.');
      return null;
    }
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✅ MongoDB Atlas Connected Successfully to: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas Connection Notice (${error.message}).`);
    return null;
  }
};
