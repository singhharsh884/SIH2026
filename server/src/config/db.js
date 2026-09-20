import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node.js SRV query lookup on networks/ISPs blocking local SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom dns is not permitted
}

// Disable Mongoose command buffering so operations never hang for 10s if Mongo is slow
mongoose.set('bufferCommands', false);

export let isConnectedToMongo = false;
export let lastMongoError = null;

const DEFAULT_ATLAS_URI =
  'mongodb+srv://singhharsh2655_db_user:yqPJ3l2Faio4SN4T@sih2026.cunpyyc.mongodb.net/harsh?retryWrites=true&w=majority';

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isConnectedToMongo = true;
    return true;
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_ATLAS_URI;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnectedToMongo = true;
    lastMongoError = null;
    console.log(`✅ [MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnectedToMongo = false;
    lastMongoError = error.message;
    console.warn(`⚠️ [MongoDB] Offline: using Resilient In-Memory Mode (${error.message})`);
    return false;
  }
};
