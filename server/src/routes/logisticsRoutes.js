import express from 'express';
import {
  optimizeRoute,
  replanRouteAfterCancellation,
  REGIONAL_HUBS,
  FARM_CLUSTERS,
  FLEET_VEHICLES,
  COMMODITY_PROFILES,
} from '../services/routeOptimizerService.js';

const router = express.Router();

/**
 * @desc    Run Intelligent Multi-Stop Cold-Chain Route Optimization (OSRM + Capacity Feasibility)
 * @route   POST /api/logistics/optimize
 * @access  Public
 */
router.post('/optimize', async (req, res) => {
  try {
    const { farmStopIds, destinationHubId, vehicleId, priority } = req.body;
    const solution = await optimizeRoute({
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
 * @desc    Dynamic Route Re-Planning upon Farmer Pickup Cancellation (PRD v2.0.0 Section 30)
 * @route   POST /api/logistics/replan
 * @access  Public
 */
router.post('/replan', async (req, res) => {
  try {
    const { farmStopIds, cancelledFarmId, destinationHubId, vehicleId } = req.body;
    if (!cancelledFarmId) {
      return res.status(400).json({
        success: false,
        message: 'cancelledFarmId is required to simulate cancellation and replan route',
      });
    }

    const replanned = await replanRouteAfterCancellation({
      farmStopIds,
      cancelledFarmId,
      destinationHubId,
      vehicleId,
    });

    res.status(200).json(replanned);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to replan route: ' + error.message,
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
 * @desc    Get commodity cold-chain temperature and shelf-life profiles (PRD v2.0.0 Section 13)
 * @route   GET /api/logistics/commodities
 * @access  Public
 */
router.get('/commodities', (req, res) => {
  res.status(200).json({
    success: true,
    data: COMMODITY_PROFILES,
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
        telemetryDisclosure: '[Simulated Reefer Sensor Stream]',
      },
    ],
  });
});

export default router;
