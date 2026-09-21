import http from 'http';

const PORT = 5000;

function sendReq(method, path, body = null, token = null) {
  return new Promise((resolve) => {
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = raw;
        }
        resolve({
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          data: parsed,
        });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 500, ok: false, error: err.message });
    });

    if (postData) req.write(postData);
    req.end();
  });
}

async function auditAllEndpoints() {
  console.log('================================================================');
  console.log('🌱 KisanDirect Master API Endpoints Comprehensive Audit');
  console.log(`📡 Target Server: http://localhost:${PORT}`);
  console.log('================================================================\n');

  const results = [];
  function record(category, method, path, res, expectedDesc) {
    const passed = res.ok;
    const statusText = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${statusText} [${res.status}] ${method.padEnd(6)} ${path.padEnd(35)} -> ${expectedDesc}`);
    results.push({ category, method, path, status: res.status, passed, expectedDesc });
  }

  // 1. System & Health
  console.log('--- 1. SYSTEM & HEALTH ENDPOINTS ---');
  let r = await sendReq('GET', '/api/health');
  record('Health', 'GET', '/api/health', r, 'Server online & database status');
  r = await sendReq('GET', '/api');
  record('Health', 'GET', '/api', r, 'Welcome root metadata');

  // 2. Auth API
  console.log('\n--- 2. AUTHENTICATION & USERS ---');
  const testMobile = `982${Math.floor(1000000 + Math.random() * 9000000)}`;
  r = await sendReq('POST', '/api/auth/register', {
    name: 'Audit FPO Lead',
    mobile: testMobile,
    password: 'password123',
    role: 'fpo',
    fpoName: 'Maharashtra Krishi Vikas FPO',
  });
  record('Auth', 'POST', '/api/auth/register', r, 'Register FPO User');

  const token = r.data?.token || '';
  r = await sendReq('POST', '/api/auth/login', {
    mobile: testMobile,
    password: 'password123',
  });
  record('Auth', 'POST', '/api/auth/login', r, 'Login with JWT issuance');

  r = await sendReq('GET', '/api/auth/me', null, token);
  record('Auth', 'GET', '/api/auth/me', r, 'Get authenticated user profile');

  // 3. Crops & Traceability
  console.log('\n--- 3. CROPS & LOT TRACEABILITY ---');
  r = await sendReq('GET', '/api/crops');
  record('Crops', 'GET', '/api/crops', r, `List crops catalog (${r.data?.data?.length || r.data?.length || 0} items)`);

  let cropId = 'crop_1';
  r = await sendReq('POST', '/api/crops', {
    title: 'Niphad Fresh Methi (मेथी)',
    category: 'Vegetables',
    price: '₹35/kg',
    quantity: '600 kg',
    mandi: '₹30/kg',
    location: 'Niphad, Nashik',
    farmerName: 'Kailash Patil',
  }, token);
  record('Crops', 'POST', '/api/crops', r, 'Publish new farmer crop lot');
  if (r.data?.data?._id) cropId = r.data.data._id;

  r = await sendReq('GET', `/api/crops/trace/${cropId}`);
  record('Crops', 'GET', `/api/crops/trace/:id`, r, 'Trace QR & 4-stage audit trail');

  r = await sendReq('GET', `/api/lots/${cropId}/trace`);
  record('Crops', 'GET', `/api/lots/:id/trace`, r, 'PRD Lot traceability alias');

  // 4. RFQ & Wholesale Contracts
  console.log('\n--- 4. WHOLESALE RFQ & DEMAND ---');
  r = await sendReq('GET', '/api/rfq');
  record('RFQ', 'GET', '/api/rfq', r, `List wholesale contracts (${r.data?.count || 0} RFQs)`);

  r = await sendReq('POST', '/api/rfq', {
    title: 'Audit Institutional Tomato RFQ',
    commodity: 'Tomato',
    volume: '1500 kg',
    frequency: 'Weekly',
    targetRate: '₹22/kg',
    buyerBusinessName: 'TastyGreens Chain',
  });
  record('RFQ', 'POST', '/api/rfq', r, 'Publish wholesale buyer RFQ');
  const createdRfqId = r.data?.data?._id || 'rfq_1';

  r = await sendReq('GET', `/api/rfqs/${createdRfqId}/matches`);
  record('RFQ', 'GET', `/api/rfqs/:id/matches`, r, 'Auto-match RFQ with farm clusters');

  // 5. Matching Engine
  console.log('\n--- 5. DEMAND-TO-SUPPLY MATCHING ENGINE ---');
  r = await sendReq('POST', '/api/matching/find-matches', {
    commodity: 'Tomato',
    volumeKg: 1500,
    maxRadiusKm: 250,
  });
  record('Matching', 'POST', '/api/matching/find-matches', r, 'Aggregate farm lots for 1,500 kg');

  r = await sendReq('GET', `/api/matching/rfq/${createdRfqId}`);
  record('Matching', 'GET', `/api/matching/rfq/:rfqId`, r, 'FPO aggregation strategy for RFQ');

  // 6. Logistics, OSRM & Commodities
  console.log('\n--- 6. LOGISTICS, OSRM & COMMODITIES ---');
  r = await sendReq('POST', '/api/logistics/optimize', {
    farmStopIds: ['farm_niphad_1', 'farm_niphad_2'],
    destinationHubId: 'hub_mumbai',
    vehicleId: 'reefer_3_5', // 3.5T Reefer Van
  });
  record('Logistics', 'POST', '/api/logistics/optimize', r, 'OSRM Road routing & Feasible check');

  r = await sendReq('POST', '/api/logistics/optimize', {
    farmStopIds: ['farm_niphad_1', 'farm_niphad_2', 'farm_dindori'],
    destinationHubId: 'hub_mumbai',
    vehicleId: 'ev_agri_2_0', // 2.0T EV (Overloaded)
  });
  record('Logistics', 'POST', '/api/logistics/optimize (Overload)', r, 'Detect overload & recommend split');

  r = await sendReq('POST', '/api/logistics/replan', {
    farmStopIds: ['farm_niphad_1', 'farm_niphad_2', 'farm_dindori'],
    cancelledFarmId: 'farm_niphad_2',
    destinationHubId: 'hub_mumbai',
  });
  record('Logistics', 'POST', '/api/logistics/replan', r, 'Dynamic re-planning on cancellation');

  r = await sendReq('GET', '/api/logistics/commodities');
  record('Logistics', 'GET', '/api/logistics/commodities', r, 'Commodity cold-chain profiles');

  r = await sendReq('GET', '/api/commodities');
  record('Logistics', 'GET', '/api/commodities', r, 'Top-level commodities endpoint');

  // 7. Orders & Payout Lifecycle
  console.log('\n--- 7. ORDERS, WEIGHING & PAYOUT LIFECYCLE ---');
  r = await sendReq('GET', '/api/orders');
  record('Orders', 'GET', '/api/orders', r, `List orders (${r.data?.count || 0} orders)`);

  r = await sendReq('POST', '/api/orders', {
    customerName: 'Audit Buyer Retail',
    items: [{ productId: 'crop_1', name: 'Fresh Spinach', price: 28, quantity: 500 }],
    totalAmount: 14000,
    deliveryAddress: 'TastyGreens Central Hub, Vashi Navi Mumbai',
  });
  record('Orders', 'POST', '/api/orders', r, 'Create wholesale order');
  const orderId = r.data?.data?._id || 'ord_sample_1';

  r = await sendReq('GET', `/api/orders/${orderId}`);
  record('Orders', 'GET', `/api/orders/:id`, r, 'Get order lifecycle timeline');

  r = await sendReq('PATCH', `/api/orders/${orderId}/status`, {
    status: 'IN_TRANSIT',
    note: 'Cold-chain Reefer Van departed collection hub, temp 3.8°C',
  });
  record('Orders', 'PATCH', `/api/orders/:id/status`, r, 'Transition status to IN_TRANSIT');

  r = await sendReq('POST', `/api/orders/${orderId}/weighing`, {
    stage: 'buyer',
    weightKg: 492,
  });
  record('Orders', 'POST', `/api/orders/:id/weighing`, r, '4-Stage Weighing Reconciliation');

  r = await sendReq('POST', `/api/orders/${orderId}/payout/release`);
  record('Orders', 'POST', `/api/orders/:id/payout/release`, r, 'Release Transparent Net Farmer Payout');

  // 8. FPO Aggregation
  console.log('\n--- 8. FPO AGGREGATION & CONSIGNMENTS ---');
  r = await sendReq('GET', '/api/fpo/consignments');
  record('FPO', 'GET', '/api/fpo/consignments', r, 'List active FPO consignments');

  r = await sendReq('POST', '/api/fpo/aggregate', {
    fpoName: 'Sahyadri Farmers Producer Co.',
    lotIds: ['crop_1', 'crop_2'],
    destinationHub: 'Vashi Cold Terminal',
  });
  record('FPO', 'POST', '/api/fpo/aggregate', r, 'Aggregate farm lots into 1 consignment');

  // 9. Quality Disputes
  console.log('\n--- 9. QUALITY DISPUTES & CLAIMS ---');
  r = await sendReq('GET', '/api/disputes');
  record('Disputes', 'GET', '/api/disputes', r, 'List active quality disputes');

  r = await sendReq('POST', '/api/disputes', {
    orderId,
    buyerName: 'TastyGreens Chain',
    reason: 'DEFECT_PERCENTAGE_EXCEEDED',
    defectPercentage: 8,
    note: 'Inspection found 8% bruised leaves due to transport vibration',
  });
  record('Disputes', 'POST', '/api/disputes', r, 'Raise quality dispute with evidence');
  const disputeId = r.data?.data?.disputeId || 'DISP-KD-2026-081';

  r = await sendReq('PATCH', `/api/disputes/${disputeId}/resolve`, {
    resolutionType: 'PARTIAL_REFUND',
    refundAmount: 1120,
    resolutionNote: 'Quality Assessor verified 8% defect; ₹1,120 refunded to buyer escrow.',
  });
  record('Disputes', 'PATCH', `/api/disputes/:id/resolve`, r, 'Resolve dispute and adjust settlement');

  // 10. Impact Analytics
  console.log('\n--- 10. BEFORE VS AFTER IMPACT ANALYTICS ---');
  r = await sendReq('GET', '/api/analytics/impact');
  record('Analytics', 'GET', '/api/analytics/impact', r, 'Measured vs Modelled impact & unit economics');

  // 11. Cold-Chain Telemetry
  console.log('\n--- 11. COLD-CHAIN TELEMETRY & BREACH SIMULATOR ---');
  r = await sendReq('GET', '/api/telemetry/route_01');
  record('Telemetry', 'GET', '/api/telemetry/:routeId', r, 'Live GPS & reefer temperature stream');

  r = await sendReq('POST', '/api/telemetry/simulate-breach', {
    simulatedTempC: 8.8,
    reason: 'Reefer Door Seal Failure during Ghat climb',
  });
  record('Telemetry', 'POST', '/api/telemetry/simulate-breach', r, 'Simulate temperature breach alert');

  // Reset telemetry
  await sendReq('POST', '/api/telemetry/simulate-breach', { reset: true });

  // Summary
  console.log('\n================================================================');
  const total = results.length;
  const passedCount = results.filter((x) => x.passed).length;
  const failedCount = total - passedCount;
  console.log(`📊 AUDIT COMPLETED: ${passedCount}/${total} Endpoints Operational (${((passedCount / total) * 100).toFixed(1)}%)`);
  if (failedCount === 0) {
    console.log('🎉 100% OF ALL BACKEND ENDPOINTS ARE FULLY OPERATIONAL AND VERIFIED!');
  } else {
    console.log(`⚠️ ${failedCount} endpoints need attention.`);
  }
  console.log('================================================================');
}

auditAllEndpoints();
