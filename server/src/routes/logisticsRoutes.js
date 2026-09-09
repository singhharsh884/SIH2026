import express from 'express';
import {
  optimizeRoute,
  REGIONAL_HUBS,
  FARM_CLUSTERS,
  FLEET_VEHICLES,
} from '../services/routeOptimizerService.js';

const router = express.Router();

/**
 * @desc    Run AI Multi-Stop Route Optimization
 * @route   POST /api/logistics/optimize
 * @access  Public
 */
router.post('/optimize', (req, res) => {
  try {
    const { farmStopIds, destinationHubId, vehicleId, priority } = req.body;
    const solution = optimizeRoute({
      farmStopIds,
      destinationHubId,
      vehicleId,
      priority,
    });

    res.status(200).json(solution);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to compute optimized route: ' + error.message,
    });
  }
});

/**
 * @desc    Get all regional destination hubs
 * @route   GET /api/logistics/hubs
 * @access  Public
 */
router.get('/hubs', (req, res) => {
  res.status(200).json({
    success: true,
    count: REGIONAL_HUBS.length,
    data: REGIONAL_HUBS,
  });
});

/**
 * @desc    Get all registered farm clusters with coordinates
 * @route   GET /api/logistics/farms
 * @access  Public
 */
router.get('/farms', (req, res) => {
  res.status(200).json({
    success: true,
    count: FARM_CLUSTERS.length,
    data: FARM_CLUSTERS,
  });
});

/**
 * @desc    Get cold-chain fleet vehicles
 * @route   GET /api/logistics/fleet
 * @access  Public
 */
router.get('/fleet', (req, res) => {
  res.status(200).json({
    success: true,
    count: FLEET_VEHICLES.length,
    data: FLEET_VEHICLES,
  });
});

/**
 * @desc    Get live tracking status of active shipments
 * @route   GET /api/logistics/active-fleet
 * @access  Public
 */
router.get('/active-fleet', (req, res) => {
  res.status(200).json({
    success: true,
    activeShipments: [
      {
        shipmentId: 'KD-7749',
        route: 'Nashik FPO Cluster → Navi Mumbai Central Hub',
        vehicle: 'Tata 407 Reefer Van (MH-15-JC-4892)',
        driver: 'Raju Shinde (+91 98220 98765)',
        status: 'In Transit • Express Highway 3',
        speedKmH: 52,
        currentTempC: '4.2°C',
        optimalTempC: '2°C - 5°C',
        cargoWeightTons: 3.4,
        stopsCompleted: '3 / 4',
        etaMinutes: 65,
        co2SavedKg: 42,
      },
    ],
  });
});

export default router;
