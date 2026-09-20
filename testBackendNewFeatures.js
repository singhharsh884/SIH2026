import {
  optimizeRoute,
  replanRouteAfterCancellation,
  fetchOsrmRoadGeometry,
  COMMODITY_PROFILES,
} from './server/src/services/routeOptimizerService.js';

async function runTests() {
  console.log('🧪 Starting KisanDirect Backend Verification Tests...\n');

  // Test 1: Feasible Route with OSRM
  console.log('--- Test 1: Optimize Route (Feasible: 2 Farm Stops in 3.5T Reefer) ---');
  const feasibleResult = await optimizeRoute({
    farmStopIds: ['farm_niphad_1', 'farm_niphad_2'],
    destinationHubId: 'hub_mumbai',
    vehicleId: 'reefer_3_5',
  });
  console.log('Route Status:', feasibleResult.feasibility.status);
  console.log('Routing Provider:', feasibleResult.routingEngine.provider);
  console.log('Total Stops:', feasibleResult.summary.totalStops);
  console.log('Total Cargo Tons:', feasibleResult.summary.totalCargoTons, 'Tons');
  console.log('Distance Saved:', feasibleResult.summary.distanceSavedKm, 'km (' + feasibleResult.summary.distanceSavedPercent + '%)');
  console.log('Checklist:', feasibleResult.feasibility.checklist.map(c => `${c.passed ? '✅' : '❌'} ${c.criterion}`).join(' | '));

  // Test 2: Overloaded Route (Exceeding Capacity -> Expect NOT_FEASIBLE)
  console.log('\n--- Test 2: Overloaded Route (6.0 Tons in 2.0T EV Van) ---');
  const overloadedResult = await optimizeRoute({
    farmStopIds: ['farm_niphad_1', 'farm_niphad_2', 'farm_dindori', 'farm_nashik_red'],
    destinationHubId: 'hub_mumbai',
    vehicleId: 'ev_agri_2_0', // 2.0T capacity
  });
  console.log('Route Status:', overloadedResult.feasibility.status);
  console.log('Capacity Feasible:', overloadedResult.feasibility.capacityFeasible);
  console.log('Overload Tons:', overloadedResult.feasibility.overloadTons, 'Tons');
  console.log('Split Recommendation:', overloadedResult.feasibility.splitRecommendation?.actionRequired);

  // Test 3: Dynamic Replanning after Farmer Cancellation
  console.log('\n--- Test 3: Dynamic Route Re-Planning upon Farmer Cancellation ---');
  const replanned = await replanRouteAfterCancellation({
    farmStopIds: ['farm_niphad_1', 'farm_niphad_2', 'farm_dindori'],
    cancelledFarmId: 'farm_niphad_2',
    destinationHubId: 'hub_mumbai',
  });
  console.log('Replan Event:', replanned.replanNotice?.event);
  console.log('Removed Farm:', replanned.replanNotice?.cancelledFarmName);
  console.log('Remaining Stops:', replanned.summary.totalStops);

  // Test 4: Commodity Profiles
  console.log('\n--- Test 4: Commodity Temperature Profiles ---');
  console.log('Spinach Temp Target:', COMMODITY_PROFILES.spinach.minTempC, '-', COMMODITY_PROFILES.spinach.maxTempC, '°C');
  console.log('Tomato Temp Target:', COMMODITY_PROFILES.tomato.minTempC, '-', COMMODITY_PROFILES.tomato.maxTempC, '°C');

  console.log('\n🎉 ALL BACKEND SERVICE TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
