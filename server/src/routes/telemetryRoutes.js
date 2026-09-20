import express from 'express';

const router = express.Router();

let simulatedBreachState = {
  activeBreach: false,
  breachedTempC: null,
  breachReason: null,
  triggeredAt: null,
};

/**
 * @desc    Get Active Reefer Cold-Chain Telemetry Log (PRD v2.0.0 Section 20)
 * @route   GET /api/telemetry/:routeId?
 * @access  Public
 */
router.get('/:routeId?', (req, res) => {
  const routeId = req.params.routeId || req.query.routeId || 'route_nashik_mumbai_01';
  const isLucknow = routeId.toLowerCase().includes('lucknow') || req.query.city === 'lucknow';

  const isBreached = simulatedBreachState.activeBreach;
  const currentTemp = isBreached
    ? simulatedBreachState.breachedTempC || 8.6
    : +(3.4 + Math.random() * 0.6).toFixed(1);

  const telemetryData = isLucknow
    ? {
        success: true,
        telemetryMode: 'SIMULATED_IOT_REEFER_TELEMETRY',
        routeId: routeId.includes('lucknow') ? routeId : 'route_lucknow_expressway_01',
        region: 'Lucknow & Awadh Agri-Corridor',
        vehicle: {
          vehicleId: 'reefer_lucknow_up32',
          model: 'Eicher Pro 2049 Chilled Multi-Zone Reefer (4.2T)',
          registrationNumber: 'UP-32-LN-5026',
          driverName: 'Virendra Yadav',
          driverMobile: '+91 94150 12345',
        },
        liveReadings: {
          timestamp: new Date().toISOString(),
          currentTemperatureCelsius: currentTemp,
          targetTemperatureRange: '2.0°C - 4.5°C',
          relativeHumidityPercent: isBreached ? 70 : 96,
          compressorStatus: isBreached ? 'MALFUNCTION_DOOR_AJAR' : 'ACTIVE_CHILLING',
          batteryReservePercent: 91,
          currentGps: {
            latitude: 26.7915,
            longitude: 80.9125,
            locationName: 'Amar Shaheed Path (Near Medanta & Ekana Stadium), Lucknow, UP 226002',
            speedKmH: 56,
          },
        },
        destinationHub: {
          name: 'Lucknow KisanDirect Cold-Chain Agri Terminal',
          address: 'Plot 42-B, Transport Nagar Phase-2, Near Shaheed Path, Lucknow, UP 226012',
          etaMinutes: 14,
        },
        complianceStatus: {
          isCompliant: !isBreached,
          statusCode: isBreached ? 'TEMPERATURE_BREACH_ALERT' : 'COMPLIANT_COLD_CHAIN',
          alertSeverity: isBreached ? 'HIGH_PRIORITY' : 'NORMAL',
          spoilageRiskScore: isBreached ? 'ELEVATED (12.8%)' : 'MINIMAL (< 1.2%)',
          mitigationRecommendation: isBreached
            ? 'AUTOMATED DISPATCH: Driver alerted to inspect refrigeration seal immediately. Divert to Transport Nagar cold bay.'
            : 'All Awadh green harvest within optimal chilling regime. Delivery on schedule.',
        },
        breadcrumbsHistory: [
          { time: '06:00 AM', location: 'Awadh Krishi FPO (Gram Kasmandi Kalan, Malihabad, Lucknow)', tempC: 3.2, rh: 96, event: 'INWARD_HARVEST_LOADED' },
          { time: '06:40 AM', location: 'IIM Road Checkpoint, Lucknow', tempC: 3.4, rh: 95, event: 'REEFER_SEAL_VERIFIED' },
          { time: '07:15 AM', location: 'Kisan Path / Ring Road Corridor, Lucknow', tempC: 3.5, rh: 94, event: 'IN_TRANSIT_WAYPOINT' },
          { time: '07:45 AM', location: 'Shaheed Path Flyover, Gomti Nagar Ext, Lucknow', tempC: currentTemp, rh: isBreached ? 70 : 96, event: isBreached ? 'BREACH_DETECTED' : 'IN_TRANSIT_WAYPOINT' },
          { time: '08:10 AM (ETA)', location: 'Transport Nagar Cold Terminal Hub, Lucknow', tempC: 3.6, rh: 95, event: 'DESTINATION_ARRIVAL' },
        ],
      }
    : {
        success: true,
        telemetryMode: 'SIMULATED_IOT_REEFER_TELEMETRY',
        routeId,
        vehicle: {
          vehicleId: 'reefer_tata_407',
          model: 'Tata 407 Chilled Reefer (3.5T)',
          registrationNumber: 'MH-15-JC-4892',
          driverName: 'Raju Shinde',
          driverMobile: '+91 98220 98765',
        },
        liveReadings: {
          timestamp: new Date().toISOString(),
          currentTemperatureCelsius: currentTemp,
          targetTemperatureRange: '2.0°C - 4.5°C',
          relativeHumidityPercent: isBreached ? 72 : 94,
          compressorStatus: isBreached ? 'MALFUNCTION_DOOR_AJAR' : 'ACTIVE_CHILLING',
          batteryReservePercent: 86,
          currentGps: {
            latitude: 19.698,
            longitude: 73.552,
            locationName: 'Igatpuri Ghats, NH-160 Mumbai-Nashik Expressway',
            speedKmH: 52,
          },
        },
        complianceStatus: {
          isCompliant: !isBreached,
          statusCode: isBreached ? 'TEMPERATURE_BREACH_ALERT' : 'COMPLIANT_COLD_CHAIN',
          alertSeverity: isBreached ? 'HIGH_PRIORITY' : 'NORMAL',
          spoilageRiskScore: isBreached ? 'ELEVATED (14.2%)' : 'MINIMAL (< 1.5%)',
          mitigationRecommendation: isBreached
            ? 'AUTOMATED DISPATCH: Driver alerted to inspect refrigeration seal immediately. Emergency cold storage on standby at Kalyan Hub.'
            : 'All cargo within optimal chilling regime. Transit on schedule.',
        },
        breadcrumbsHistory: [
          { time: '06:00 AM', location: 'Patel Green Farms, Niphad', tempC: 3.2, rh: 95, event: 'INWARD_HARVEST_LOADED' },
          { time: '06:45 AM', location: 'Nashik Agro Terminal Hub', tempC: 3.5, rh: 94, event: 'REEFER_SEAL_VERIFIED' },
          { time: '07:30 AM', location: 'Kasara Valley Checkpoint', tempC: 3.7, rh: 93, event: 'IN_TRANSIT_WAYPOINT' },
          { time: '08:15 AM', location: 'Igatpuri Ghat Highway', tempC: currentTemp, rh: isBreached ? 72 : 94, event: isBreached ? 'BREACH_DETECTED' : 'IN_TRANSIT_WAYPOINT' },
        ],
      };

  res.status(200).json(telemetryData);
});

/**
 * @desc    Simulate Cold-Chain Temperature Breach for SIH Demo (PRD v2.0.0 Section 20 & 21)
 * @route   POST /api/telemetry/simulate-breach
 * @access  Public
 */
router.post('/simulate-breach', (req, res) => {
  const {
    simulatedTempC = 8.6,
    reason = 'Chiller Compressor Pressure Drop / Door Ajar Event',
    reset = false,
  } = req.body;

  if (reset) {
    simulatedBreachState = {
      activeBreach: false,
      breachedTempC: null,
      breachReason: null,
      triggeredAt: null,
    };
    return res.status(200).json({
      success: true,
      message: 'Reefer Telemetry restored to normal compliant state (3.6°C).',
      complianceStatus: 'COMPLIANT_COLD_CHAIN',
    });
  }

  simulatedBreachState = {
    activeBreach: true,
    breachedTempC: Number(simulatedTempC) || 8.6,
    breachReason: reason,
    triggeredAt: new Date(),
  };

  res.status(200).json({
    success: true,
    message: `🚨 Simulated Temperature Breach Activated: Reefer Temp spiked to ${simulatedBreachState.breachedTempC}°C!`,
    alert: {
      event: 'TEMPERATURE_BREACH_ALERT',
      severity: 'CRITICAL',
      detectedTempC: simulatedBreachState.breachedTempC,
      thresholdExceededBy: `+${(simulatedBreachState.breachedTempC - 4.5).toFixed(1)}°C above 4.5°C threshold`,
      reason,
      automatedActionsTaken: [
        'SMS / WhatsApp push alert sent to Reefer Driver Raju Shinde (+91 98220 98765)',
        'Push notification sent to Wholesale Buyer TastyGreens Procurement Lead',
        'Auto-Routing triggered: Nearest Cold Transit Bay identified at Kalyan Hub (14.2 km)',
      ],
    },
  });
});

export default router;
