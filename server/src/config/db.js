import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node.js SRV query lookup on networks/ISPs blocking local SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom dns is not permitted
}

export let isConnectedToMongo = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kisandirect';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnectedToMongo = true;
    console.log(`✅ [MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnectedToMongo = false;
    console.warn(`⚠️ [MongoDB] Could not reach MongoDB at: ${uri}`);
    console.warn(`💡 [Notice] Running in resilient in-memory mode so the API works out-of-the-box.`);
    console.warn(`💡 [Tip] To connect your cloud database, set MONGODB_URI in server/.env (e.g. MongoDB Atlas)`);
    return false;
  }
};
