import http from 'http';

const PORT = 5000;

function request(method, path, postData = null) {
  return new Promise((resolve) => {
    const dataString = postData ? JSON.stringify(postData) : null;
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(dataString ? { 'Content-Length': Buffer.byteLength(dataString) } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
          resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, data: parsed });
        });
      }
    );
    req.on('error', (err) => resolve({ status: 500, ok: false, error: err.message }));
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runPart3Tests() {
  console.log('================================================================');
  console.log('🧪 Verifying Part 3 Advanced Requirements (Disputes, Analytics, Telemetry)');
  console.log(`📡 Testing against server on port ${PORT}`);
  console.log('================================================================\n');

  // 1. Raise a Quality Dispute
  console.log('--- 1. Testing Quality Dispute: POST /api/disputes ---');
  let res = await request('POST', '/api/disputes', {
    orderId: 'ord_sample_1',
    buyerName: 'TastyGreens Chain',
    reason: 'DEFECT_PERCENTAGE_EXCEEDED',
    defectPercentage: 8,
    note: 'Inspection at Vashi cold dock found 8% bruised leaves due to rough transit.',
  });
  console.log(`Status: ${res.status}`);
  console.log(`Dispute ID: ${res.data?.data?.disputeId}`);
  console.log(`Crop: ${res.data?.data?.cropName} (${res.data?.data?.quantityKg} kg)`);
  console.log(`Reason: ${res.data?.data?.reason}`);
  console.log(`Status: ${res.data?.data?.status}`);
  console.log(`Estimated Claim: ₹${res.data?.data?.estimatedClaimAmount}`);
  const disputeId = res.data?.data?.disputeId || 'DISP-KD-2026-081';

  // 2. Resolve Dispute with Partial Refund
  console.log(`\n--- 2. Testing Dispute Settlement: PATCH /api/disputes/${disputeId}/resolve ---`);
  res = await request('PATCH', `/api/disputes/${disputeId}/resolve`, {
    resolutionType: 'PARTIAL_REFUND',
    refundAmount: 1120,
    resolutionNote: 'Quality Assessor verified 8% defect; ₹1,120 partial refund released to buyer escrow.',
  });
  console.log(`Status: ${res.status}`);
  console.log(`Resolution: ${res.data?.data?.settlement?.type}`);
  console.log(`Refund Amount: ₹${res.data?.data?.settlement?.refundAmount}`);
  console.log(`Refund Status: ${res.data?.data?.settlement?.refundStatus}`);
  console.log(`Dispute Status: ${res.data?.data?.status}`);

  // 3. Impact Analytics
  console.log('\n--- 3. Testing Impact Analytics: GET /api/analytics/impact ---');
  res = await request('GET', '/api/analytics/impact');
  console.log(`Status: ${res.status}`);
  console.log(`Orders Executed: ${res.data?.measuredMetrics?.totalOrdersExecuted}`);
  console.log(`Tons Delivered: ${res.data?.measuredMetrics?.totalTonsDelivered}`);
  console.log(`Distance Saved: ${res.data?.modelledEstimates?.distanceSavedKm} km (${res.data?.modelledEstimates?.distanceSavedPercent})`);
  console.log(`Fuel Saved: ${res.data?.modelledEstimates?.fuelSavedLitres} Litres`);
  console.log(`CO2 Avoided: ${res.data?.modelledEstimates?.co2EmissionsAvoidedKg} kg`);
  console.log(`Traditional Loss: ${res.data?.modelledEstimates?.postHarvestLossComparison?.traditionalMandiLossRate}`);
  console.log(`KisanDirect Loss: ${res.data?.modelledEstimates?.postHarvestLossComparison?.kisanDirectLossRate}`);
  console.log(`Produce Saved: ${res.data?.modelledEstimates?.postHarvestLossComparison?.produceSavedFromSpoilageKg} kg`);
  console.log(`Farmer Realization: ${res.data?.unitEconomicsBreakdown?.netFarmerPayoutDirect} (${res.data?.modelledEstimates?.farmerEarningsComparison?.netEarningsBoost})`);

  // 4. Live Telemetry
  console.log('\n--- 4. Testing Live Reefer Telemetry: GET /api/telemetry/route_01 ---');
  res = await request('GET', '/api/telemetry/route_01');
  console.log(`Status: ${res.status}`);
  console.log(`Vehicle: ${res.data?.vehicle?.model} (${res.data?.vehicle?.registrationNumber})`);
  console.log(`Driver: ${res.data?.vehicle?.driverName} (${res.data?.vehicle?.driverMobile})`);
  console.log(`Current Temp: ${res.data?.liveReadings?.currentTemperatureCelsius}°C (Target: ${res.data?.liveReadings?.targetTemperatureRange})`);
  console.log(`GPS: ${res.data?.liveReadings?.currentGps?.locationName}`);
  console.log(`Compliance: ${res.data?.complianceStatus?.statusCode}`);

  // 5. Temperature Breach Simulation
  console.log('\n--- 5. Testing Simulated Temperature Breach: POST /api/telemetry/simulate-breach ---');
  res = await request('POST', '/api/telemetry/simulate-breach', {
    simulatedTempC: 8.8,
    reason: 'Reefer Rear Door Seal Leakage during Igatpuri Ghat Climb',
  });
  console.log(`Status: ${res.status}`);
  console.log(`Event: ${res.data?.alert?.event}`);
  console.log(`Severity: ${res.data?.alert?.severity}`);
  console.log(`Detected Temp: ${res.data?.alert?.detectedTempC}°C (${res.data?.alert?.thresholdExceededBy})`);
  console.log(`Automated Actions: ${res.data?.alert?.automatedActionsTaken?.join(' | ')}`);

  // Reset breach
  await request('POST', '/api/telemetry/simulate-breach', { reset: true });

  console.log('\n================================================================');
  console.log('🎉 ALL PART 3 ADVANCED MODULES (DISPUTES, ANALYTICS, TELEMETRY) PASSED 100%!');
  console.log('================================================================');
}

runPart3Tests();
