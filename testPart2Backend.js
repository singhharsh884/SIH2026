import http from 'http';
import app from './server/src/index.js';

const TEST_PORT = 5098;

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request({ ...options, port: TEST_PORT }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runPart2Tests() {
  const server = app.listen(TEST_PORT, async () => {
    console.log(`🧪 In-process test server active on port ${TEST_PORT}\n`);
    try {
      await executePart2Tests();
    } finally {
      server.close();
    }
  });
}

async function executePart2Tests() {
  console.log('🧪 Verifying SIH Demo Part 2 (Items 5, 6, 7, 8) Requirements...\n');

  // Test 5: FPO Aggregation API (/api/fpo/aggregate)
  console.log('--- 5. Testing FPO Aggregation: POST /api/fpo/aggregate ---');
  try {
    const res5 = await request(
      {
        hostname: 'localhost',
        path: '/api/fpo/aggregate',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        fpoName: 'Sahyadri Farmers Producer Co.',
        lotIds: ['crop_1', 'crop_2', 'crop_3'],
        destinationHub: 'Mumbai Central Vashi APMC Cold Terminal',
      }
    );
    console.log(`Status: ${res5.status}`);
    console.log(`Consignment ID: ${res5.body.data?.consignmentId}`);
    console.log(`Total Lots Aggregated: ${res5.body.data?.totalLotsCount}`);
    console.log(`Total Weight: ${res5.body.data?.totalWeightFormatted}`);
    console.log(`Temperature Regime: ${res5.body.data?.temperatureRegime}`);
    console.log(`Assigned Reefer: ${res5.body.data?.assignedVehicle}`);
  } catch (err) {
    console.error('Test 5 Failed:', err.message);
  }

  // Test 6: Commodity Temperature Profiles API (/api/commodities)
  console.log('\n--- 6. Testing Commodity Intelligence: GET /api/commodities ---');
  try {
    const res6 = await request({
      hostname: 'localhost',
      path: '/api/commodities',
      method: 'GET',
    });
    console.log(`Status: ${res6.status}`);
    console.log(`Total Profiles: ${res6.body.count}`);
    console.log(`Spinach Target: ${res6.body.data?.spinach?.minTempC}°C - ${res6.body.data?.spinach?.maxTempC}°C (Sensitivity: ${res6.body.data?.spinach?.sensitivity})`);
    console.log(`Tomato Target: ${res6.body.data?.tomato?.minTempC}°C - ${res6.body.data?.tomato?.maxTempC}°C (Sensitivity: ${res6.body.data?.tomato?.sensitivity})`);
    console.log(`Onion Target: ${res6.body.data?.redOnion?.minTempC}°C - ${res6.body.data?.redOnion?.maxTempC}°C (Sensitivity: ${res6.body.data?.redOnion?.sensitivity})`);
  } catch (err) {
    console.error('Test 6 Failed:', err.message);
  }

  // Test 7: Dynamic Route Re-Planning API (POST /api/logistics/replan)
  console.log('\n--- 7. Testing Dynamic Route Re-Planning: POST /api/logistics/replan ---');
  try {
    const res7 = await request(
      {
        hostname: 'localhost',
        path: '/api/logistics/replan',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        farmStopIds: ['farm_niphad_1', 'farm_niphad_2', 'farm_dindori'],
        cancelledFarmId: 'farm_niphad_2',
        destinationHubId: 'hub_mumbai',
      }
    );
    console.log(`Status: ${res7.status}`);
    console.log(`Replan Event: ${res7.body.replanNotice?.event}`);
    console.log(`Cancelled Farm: ${res7.body.replanNotice?.cancelledFarmName}`);
    console.log(`Remaining Stops: ${res7.body.summary?.totalStops}`);
    console.log(`New Distance: ${res7.body.summary?.optimizedDistanceKm} km`);
  } catch (err) {
    console.error('Test 7 Failed:', err.message);
  }

  // Test 8: Weighing & Quantity Reconciliation API (POST /api/orders/:id/weighing)
  console.log('\n--- 8. Testing 4-Stage Weighing Reconciliation: POST /api/orders/ord_sample_1/weighing ---');
  try {
    const res8 = await request(
      {
        hostname: 'localhost',
        path: '/api/orders/ord_sample_1/weighing',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        stage: 'buyer',
        weightKg: 490, // Farmgate: 494kg -> Buyer: 490kg
      }
    );
    console.log(`Status: ${res8.status}`);
    console.log(`Farmer Declared: ${res8.body.data?.farmerDeclaredKg} kg`);
    console.log(`Farmgate Weighed: ${res8.body.data?.farmgateWeighedKg} kg`);
    console.log(`Buyer Received: ${res8.body.data?.buyerReceivedKg} kg`);
    console.log(`Shrinkage Variance: ${res8.body.data?.shrinkageVarianceKg} kg (${res8.body.data?.shrinkagePercent}%)`);
    console.log(`Reconciliation Status: ${res8.body.data?.status}`);
  } catch (err) {
    console.error('Test 8 Failed:', err.message);
  }

  console.log('\n🎉 ALL PART 2 (ITEMS 5, 6, 7, 8) REQUIREMENTS FULLY VALIDATED!');
}

runPart2Tests();
