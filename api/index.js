import app from '../server/src/index.js';
import { connectDB } from '../server/src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('Error connecting to DB in serverless handler:', err);
  }
  return app(req, res);
}
