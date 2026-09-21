import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node.js SRV query lookup on networks/ISPs blocking local SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom dns is not permitted
}

// Enable standard command buffering with 5s timeout so queries never crash if connection is establishing
export let isConnectedToMongo = false;
export let lastMongoError = null;

const DEFAULT_ATLAS_URI =
  'mongodb+srv://singhharsh2655_db_user:yqPJ3l2Faio4SN4T@sih2026.cunpyyc.mongodb.net/harsh?retryWrites=true&w=majority';

let cachedPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isConnectedToMongo = true;
    return true;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_ATLAS_URI;

  cachedPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })
    .then((conn) => {
      isConnectedToMongo = true;
      lastMongoError = null;
      console.log(`✅ [MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
      return true;
    })
    .catch((error) => {
      isConnectedToMongo = false;
      lastMongoError = error.message;
      console.warn(`⚠️ [MongoDB] Offline: using Resilient In-Memory Mode (${error.message})`);
      cachedPromise = null;
      return false;
    });

  return cachedPromise;
};
