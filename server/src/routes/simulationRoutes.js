import express from 'express';
import {
  REGIONAL_HUBS,
  FARM_CLUSTERS,
  FLEET_VEHICLES,
  optimizeRoute,
  calculateDistanceKm,
} from '../services/routeOptimizerService.js';

const router = express.Router();

/**
 * @desc    End-to-End Lucknow Live Simulation API
 * @route   POST /api/simulation/lucknow OR GET /api/simulation/lucknow
 * @access  Public
 */
const runLucknowSimulation = async (req, res) => {
  try {
    const {
      buyerBusinessName = 'Awadh Fresh Hypermarket & Cloud Kitchen',
      deliveryAddress = 'Shop #14, Rohtas Presidential Arcade, Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010',
      buyerLocation = { lat: 26.864, lng: 80.998, city: 'Lucknow' },
      commodity = 'Baby Spinach & Desi Greens',
      volumeKg = 1500,
      targetRate = '₹32/kg',
    } = { ...req.query, ...req.body };

    const parsedVolume = Number(volumeKg) || 1500;
    const grossOrderAmount = parsedVolume * 32;

    // 1. Locate Regional Hub in Lucknow
    const lucknowHub = REGIONAL_HUBS.find((h) => h.id === 'hub_lucknow') || {
      id: 'hub_lucknow',
      name: 'Lucknow KisanDirect Cold-Chain Agri Terminal (Transport Nagar)',
      address: 'Plot 42-B, Transport Nagar Phase-2, Near Shaheed Path, Lucknow, UP 226012',
      lat: 26.782,
      lng: 80.892,
    };

    // 2. Identify Lucknow Farm Clusters
    const lucknowFarms = FARM_CLUSTERS.filter((f) => f.id.includes('lucknow'));

    // 3. Multi-Lot Demand-to-Supply Aggregation
    let matchedLots = [];
    let allocatedTotal = 0;
    for (const farm of lucknowFarms) {
      if (allocatedTotal >= parsedVolume) break;
      const farmAvailable = Math.round(farm.weightTons * 1000);
      const needed = parsedVolume - allocatedTotal;
      const allocatedFromFarm = Math.min(farmAvailable, needed);

      const distanceToBuyer = calculateDistanceKm(
        buyerLocation.lat,
        buyerLocation.lng,
        farm.lat,
        farm.lng
      );

      allocatedTotal += allocatedFromFarm;
      matchedLots.push({
        farmId: farm.id,
        farmName: farm.farmName,
        farmerName: farm.farmerName,
        farmerMobile: farm.farmerMobile,
        farmAddress: farm.address,
        crop: farm.crop,
        distanceToBuyerKm: distanceToBuyer,
        harvestTime: 'Harvested Today at 05:30 AM',
        allocatedKg: allocatedFromFarm,
        lotSharePercent: Math.round((allocatedFromFarm / parsedVolume) * 100),
        status: 'READY_FOR_COLD_PICKUP',
      });
    }

    // 4. Multi-Stop Route Optimization across Lucknow corridor
    const farmStopIds = matchedLots.map((l) => l.farmId);
    const routeSolution = await optimizeRoute({
      farmStopIds,
      destinationHubId: 'hub_lucknow',
      vehicleId: 'reefer_lucknow_up32',
      priority: 'high',
    });

    // 5. Assigned Vehicle from Fleet
    const assignedVehicle = FLEET_VEHICLES.find((v) => v.id === 'reefer_lucknow_up32') || {
      id: 'reefer_lucknow_up32',
      name: 'Eicher Pro 2049 Reefer - Lucknow Express (UP-32-LN-5026)',
      capacityTons: 4.2,
      driverName: 'Virendra Yadav',
      driverMobile: '+91 94150 12345',
    };

    // 6. Real-time Live GPS & Telemetry Stream
    const currentGps = {
      latitude: 26.7915,
      longitude: 80.9125,
      landmark: 'Amar Shaheed Path (Near Medanta & Ekana Stadium), Lucknow',
      speedKmH: 56,
      heading: 'North-East toward Gomti Nagar Hub',
      activeRoad: 'Amar Shaheed Path Highway corridor',
    };

    // 7. 4-Stage Weighing & Moisture Shrinkage Reconciliation
    const declaredWeightKg = parsedVolume;
    const farmgateWeightKg = parsedVolume - 6; // Initial moisture loss
    const hubReceivedWeightKg = parsedVolume - 14;
    const buyerReceivedWeightKg = parsedVolume - 18;
    const shrinkageKg = 18;
    const shrinkagePercent = +((shrinkageKg / declaredWeightKg) * 100).toFixed(2);

    // 8. Payout & Unit Economics
    const logisticsCost = Math.round(grossOrderAmount * 0.085);
    const platformFee = Math.round(grossOrderAmount * 0.015);
    const netFarmerPayout = grossOrderAmount - logisticsCost - platformFee;

    const simulationResult = {
      success: true,
      simulationId: 'SIM-LKO-' + Date.now().toString(36).toUpperCase(),
      region: 'Lucknow, Uttar Pradesh (Awadh Agri-Corridor)',
      timestamp: new Date().toISOString(),

      stage1_orderAndDemand: {
        orderId: 'KD-LKO-' + Math.floor(100000 + Math.random() * 900000),
        buyerName: buyerBusinessName,
        deliveryAddress,
        buyerCoordinates: buyerLocation,
        commodity,
        volumeRequired: `${parsedVolume.toLocaleString('en-IN')} kg`,
        grossEscrowLocked: `₹${grossOrderAmount.toLocaleString('en-IN')}`,
        orderStatus: 'ESCROW_FUNDED_MATCHED',
      },

      stage2_farmSupplyMatching: {
        totalLotsMatched: matchedLots.length,
        totalHarvestAllocatedKg: allocatedTotal,
        shortfallKg: Math.max(0, parsedVolume - allocatedTotal),
        matchScorePercent: 98.4,
        matchedLots,
      },

      stage3_routeOptimization: {
        destinationHub: lucknowHub,
        totalRoadDistanceKm: routeSolution?.summary?.optimizedDistanceKm || 52.4,
        totalTransitTimeHours: routeSolution?.summary?.optimizedDurationHours || 1.3,
        fuelCostSavedINR: routeSolution?.summary?.fuelCostSavedINR || 450,
        co2ReductionKg: routeSolution?.summary?.co2ReductionKg || 13,
        spoilageRiskScore: `${routeSolution?.summary?.spoilageRiskPercent || '0.8'}% (Extremely Low)`,
        waypoints: (routeSolution?.itinerary || []).map((leg) => ({
          stopNumber: leg.stopIndex,
          name: leg.name,
          location: leg.location,
          coordinates: { lat: leg.lat, lng: leg.lng },
          eta: leg.estimatedArrival,
          cumulativeKm: leg.cumulativeDistanceKm,
        })),
      },

      stage4_capacityAndFeasibility: {
        vehicleAssigned: assignedVehicle.name,
        registrationNumber: 'UP-32-LN-5026',
        driver: {
          name: assignedVehicle.driverName || 'Virendra Yadav',
          mobile: assignedVehicle.driverMobile || '+91 94150 12345',
        },
        payloadTons: +(allocatedTotal / 1000).toFixed(2),
        vehicleCapacityTons: assignedVehicle.capacityTons,
        payloadUtilizationPercent: `${Math.round(((allocatedTotal / 1000) / assignedVehicle.capacityTons) * 100)}%`,
        feasibilityStatus: '100% FEASIBLE (NO OVERLOAD)',
      },

      stage5_liveIotTelemetry: {
        currentLocation: currentGps,
        reeferTemperatureC: 3.6,
        targetRange: '2.0°C - 4.5°C',
        relativeHumidityPercent: 95,
        compressorStatus: 'ACTIVE_CHILLING',
        coldChainCompliance: 'COMPLIANT_COLD_CHAIN (Zero Thermal Shock)',
        telemetryFeedUrl: '/api/telemetry/route_lucknow_01',
      },

      stage6_weighingReconciliation: {
        stage1_farmerDeclaredKg: declaredWeightKg,
        stage2_farmgateWeighedKg: farmgateWeightKg,
        stage3_hubReceivedKg: hubReceivedWeightKg,
        stage4_buyerReceivedKg: buyerReceivedWeightKg,
        transitShrinkageKg: shrinkageKg,
        shrinkagePercent: `${shrinkagePercent}%`,
        reconciliationStatus: shrinkagePercent <= 2.5 ? 'WITHIN_TOLERANCE (PASS)' : 'EXCESS_SHRINKAGE',
      },

      stage7_farmerPayoutSettlement: {
        grossBuyerEscrow: `₹${grossOrderAmount.toLocaleString('en-IN')}`,
        logisticsAndColdChainDeduction: `₹${logisticsCost.toLocaleString('en-IN')} (8.5%)`,
        platformFeeDeduction: `₹${platformFee.toLocaleString('en-IN')} (1.5%)`,
        netFarmerRealization: `₹${netFarmerPayout.toLocaleString('en-IN')} (90.0%)`,
        payoutStatus: 'SETTLED_TO_FARMER_ACCOUNT',
        payoutReference: 'UPI-AWADH-' + Math.floor(10000000 + Math.random() * 90000000),
      },
    };

    res.status(200).json(simulationResult);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to run Lucknow live simulation: ' + error.message,
    });
  }
};

router.post('/lucknow', runLucknowSimulation);
router.get('/lucknow', runLucknowSimulation);

/**
 * @desc    Live GPS Moving Vehicle Feed along Shaheed Path Corridor, Lucknow
 * @route   GET /api/simulation/lucknow/live-feed
 * @access  Public
 */
router.get('/lucknow/live-feed', (req, res) => {
  const steps = [
    {
      step: 1,
      time: '06:00 AM',
      name: 'Awadh Krishi FPO (Malihabad, Lucknow)',
      lat: 26.920,
      lng: 80.710,
      tempC: 3.2,
      speedKmH: 0,
      event: 'INWARD_HARVEST_DISPATCH',
    },
    {
      step: 2,
      time: '06:35 AM',
      name: 'IIM Road Crossing, Lucknow',
      lat: 26.905,
      lng: 80.880,
      tempC: 3.4,
      speedKmH: 52,
      event: 'REEFER_SEAL_VERIFIED',
    },
    {
      step: 3,
      time: '07:10 AM',
      name: 'Kisan Path Junction (Ring Road Corridor), Lucknow',
      lat: 26.830,
      lng: 81.010,
      tempC: 3.5,
      speedKmH: 64,
      event: 'EXPRESSWAY_TRANSIT',
    },
    {
      step: 4,
      time: '07:45 AM',
      name: 'Amar Shaheed Path Flyover (Gomti Nagar Extension), Lucknow',
      lat: 26.7915,
      lng: 80.9125,
      tempC: 3.6,
      speedKmH: 58,
      event: 'APPROACHING_BUYER_STORE',
    },
    {
      step: 5,
      time: '08:15 AM',
      name: 'Lucknow KisanDirect Cold Terminal (Transport Nagar Phase-2)',
      lat: 26.782,
      lng: 80.892,
      tempC: 3.6,
      speedKmH: 0,
      event: 'DELIVERED_AND_COLD_UNLOADED',
    },
  ];

  res.status(200).json({
    success: true,
    route: 'Awadh Farm-to-Fork Express Corridor (Malihabad -> Shaheed Path -> Gomti Nagar / Transport Nagar)',
    vehicle: 'UP-32-LN-5026 (Eicher Pro 2049 Reefer)',
    driver: 'Virendra Yadav (+91 94150 12345)',
    activePoint: steps[3],
    allWaypoints: steps,
  });
});

export default router;
