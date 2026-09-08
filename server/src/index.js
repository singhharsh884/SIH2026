import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, isConnectedToMongo } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import { orderRouter, rfqRouter } from './routes/orderRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Welcome root route
app.get('/', (req, res) => {
  res.status(200).json({
    platform: '🌱 KisanDirect Backend API',
    status: 'Online & Ready',
    database: isConnectedToMongo ? 'MongoDB Connected' : 'Resilient In-Memory Mode',
    frontendUrl: 'http://localhost:5173',
    message: 'Welcome to KisanDirect API! To view the user interface login page, open http://localhost:5173 in your browser.',
    endpoints: {
      health: 'GET /api/health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      currentUser: 'GET /api/auth/me',
      crops: 'GET /api/crops, POST /api/crops, DELETE /api/crops/:id',
      orders: 'GET /api/orders, POST /api/orders',
      rfqs: 'GET /api/rfq, POST /api/rfq, DELETE /api/rfq/:id',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'KisanDirect Backend API',
    database: isConnectedToMongo ? 'MongoDB Connected' : 'Resilient In-Memory Mode',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/orders', orderRouter);
app.use('/api/rfq', rfqRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handling
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`\n🌱 [KisanDirect API] Server running on http://localhost:${PORT}`);
  console.log(`📡 [Health Check] Available at http://localhost:${PORT}/api/health`);
  console.log(`🌾 [Crops API] Available at http://localhost:${PORT}/api/crops`);
  console.log(`🛒 [Orders & RFQ API] Available at http://localhost:${PORT}/api/orders\n`);
});
