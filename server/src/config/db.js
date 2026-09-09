import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node.js SRV query lookup on networks/ISPs blocking local SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom dns is not permitted
}

export let isConnectedToMongo = false;
export let lastMongoError = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    isConnectedToMongo = true;
    return true;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kisandirect';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    isConnectedToMongo = true;
    lastMongoError = null;
    console.log(`✅ [MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnectedToMongo = false;
    lastMongoError = error.message;
    console.warn(`⚠️ [MongoDB] Could not reach MongoDB at: ${uri} - ${error.message}`);
    return false;
  }
};
