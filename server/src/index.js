import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, isConnectedToMongo, lastMongoError } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import { orderRouter, rfqRouter } from './routes/orderRoutes.js';
import logisticsRoutes from './routes/logisticsRoutes.js';
import matchingRoutes from './routes/matchingRoutes.js';
import fpoRoutes from './routes/fpoRoutes.js';
import disputeRoutes from './routes/disputeRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import simulationRoutes from './routes/simulationRoutes.js';
import { COMMODITY_PROFILES } from './services/routeOptimizerService.js';
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
    origin: (origin, callback) => {
      // Allow local development, vercel deployments, and direct API tools
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));



// Welcome root handler
const welcomeHandler = (req, res) => {
  res.status(200).json({
    platform: '🌱 KisanDirect Backend API',
    status: 'Online & Ready',
    database: isConnectedToMongo ? 'MongoDB Connected' : 'Resilient In-Memory Mode',
    frontendUrl: 'https://farmer-direct-sage.vercel.app',
    message: 'Welcome to KisanDirect API!',
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
};

// Health check handler
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'KisanDirect Backend API',
    database: isConnectedToMongo ? 'MongoDB Connected' : 'Resilient In-Memory Mode',
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoError: lastMongoError,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

app.get('/', welcomeHandler);
app.get('/api', welcomeHandler);

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Mount Routes (supporting both /api/path and /path for serverless resilience)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/crops', cropRoutes);
app.use('/crops', cropRoutes);
app.use('/api/lots', cropRoutes); // PRD alias: /api/lots/:id/trace
app.use('/lots', cropRoutes);

app.use('/api/orders', orderRouter);
app.use('/orders', orderRouter);

app.use('/api/rfq', rfqRouter);
app.use('/rfq', rfqRouter);
app.use('/api/rfqs', rfqRouter); // PRD alias: /api/rfqs/:id/matches
app.use('/rfqs', rfqRouter);

app.use('/api/logistics', logisticsRoutes);
app.use('/logistics', logisticsRoutes);

app.use('/api/matching', matchingRoutes);
app.use('/matching', matchingRoutes);

app.use('/api/fpo', fpoRoutes);
app.use('/fpo', fpoRoutes);

app.use('/api/disputes', disputeRoutes);
app.use('/disputes', disputeRoutes);

app.use('/api/analytics', analyticsRoutes);
app.use('/analytics', analyticsRoutes);

app.use('/api/telemetry', telemetryRoutes);
app.use('/telemetry', telemetryRoutes);

app.use('/api/simulation', simulationRoutes);
app.use('/simulation', simulationRoutes);

// PRD Section 13: /api/commodities
app.get('/api/commodities', (req, res) => {
  res.status(200).json({
    success: true,
    count: Object.keys(COMMODITY_PROFILES).length,
    data: COMMODITY_PROFILES,
  });
});
app.get('/commodities', (req, res) => {
  res.status(200).json({
    success: true,
    count: Object.keys(COMMODITY_PROFILES).length,
    data: COMMODITY_PROFILES,
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handling
app.use(errorHandler);

// Only listen on port if running locally (not in serverless environment or tests)
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n🌱 [KisanDirect API] Server running on http://localhost:${PORT}`);
    console.log(`📡 [Health Check] Available at http://localhost:${PORT}/api/health`);
    console.log(`🌾 [Crops API] Available at http://localhost:${PORT}/api/crops`);
    console.log(`🛒 [Orders & RFQ API] Available at http://localhost:${PORT}/api/orders\n`);
  });
}

export default app;

