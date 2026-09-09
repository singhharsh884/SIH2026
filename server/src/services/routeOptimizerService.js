/**
 * KisanDirect AI Cold-Chain Route Optimizer Service
 * Solves multi-stop farm produce collection and cold-chain routing
 * minimizing total travel distance, transit hours, fuel consumption, and produce spoilage.
 */

// Regional Hubs Database (Destinations & Central Depots)
export const REGIONAL_HUBS = [
  {
    id: 'hub_mumbai',
    name: 'Navi Mumbai Central Cold-Chain Terminal',
    shortName: 'Navi Mumbai (APMC Vashi)',
    city: 'Mumbai',
    lat: 19.076,
    lng: 73.001,
    coldStorageCapacity: '500 Tons',
    tempRange: '2°C - 4°C',
    type: 'Central Wholesale Terminal',
  },
  {
    id: 'hub_pune',
    name: 'Pune Agri-Logistics Terminal (Hadapsar)',
    shortName: 'Pune (Hadapsar Hub)',
    city: 'Pune',
    lat: 18.508,
    lng: 73.926,
    coldStorageCapacity: '350 Tons',
    tempRange: '3°C - 5°C',
    type: 'Regional Distribution Center',
  },
  {
    id: 'hub_thane',
    name: 'Thane & MMR Fulfillment Depot (Bhiwandi)',
    shortName: 'Thane (Bhiwandi Cold Depot)',
    city: 'Thane',
    lat: 19.296,
    lng: 73.063,
    coldStorageCapacity: '400 Tons',
    tempRange: '2°C - 4°C',
    type: 'Supermarket Sorting Center',
  },
  {
    id: 'hub_nashik',
    name: 'Nashik Consolidation & Sorting Hub (Ambad)',
    shortName: 'Nashik (Ambad Hub)',
    city: 'Nashik',
    lat: 19.952,
    lng: 73.738,
    coldStorageCapacity: '250 Tons',
    tempRange: '4°C - 6°C',
    type: 'Cluster Consolidation Hub',
  },
];

// Farm Clusters & Coordinates Database
export const FARM_CLUSTERS = [
  {
    id: 'farm_niphad_1',
    farmName: 'Patel Green Farms',
    farmerName: 'Rameshwar Patel',
    farmerMobile: '+91 98231 45678',
    location: 'Niphad, Nashik',
    crop: 'Baby Spinach (पालक)',
    quantity: '850 kg',
    weightTons: 0.85,
    lat: 20.082,
    lng: 74.112,
    cluster: 'Niphad Valley',
    tempTarget: '3.5°C',
    priority: 'high', // leafy greens spoil faster
  },
  {
    id: 'farm_niphad_2',
    farmName: 'Krishi Vikas Organic FPO',
    farmerName: 'Santosh Deshmukh',
    farmerMobile: '+91 94222 18901',
    location: 'Niphad East, Nashik',
    crop: 'Tender Okra / Bhindi (भिंडी)',
    quantity: '600 kg',
    weightTons: 0.6,
    lat: 20.068,
    lng: 74.135,
    cluster: 'Niphad Valley',
    tempTarget: '4.0°C',
    priority: 'medium',
  },
  {
    id: 'farm_dindori',
    farmName: 'Vikas Sahakari FPO',
    farmerName: 'Balasaheb Shinde',
    farmerMobile: '+91 98210 33412',
    location: 'Dindori Cluster, Nashik',
    crop: 'Country Cucumbers (खीरा)',
    quantity: '1.2 Tons',
    weightTons: 1.2,
    lat: 20.198,
    lng: 73.834,
    cluster: 'Dindori Hills',
    tempTarget: '5.0°C',
    priority: 'medium',
  },
  {
    id: 'farm_pune_valley',
    farmName: 'Sahyadri Agri FPO',
    farmerName: 'Dr. Aniket Jadhav',
    farmerMobile: '+91 97654 89012',
    location: 'Narayangaon / Junnar, Pune',
    crop: 'Green Capsicum (शिमला मिर्च)',
    quantity: '500 kg',
    weightTons: 0.5,
    lat: 19.124,
    lng: 73.978,
    cluster: 'Sahyadri Valley',
    tempTarget: '4.2°C',
    priority: 'high',
  },
  {
    id: 'farm_baramati',
    farmName: 'Sahyadri Green FPO',
    farmerName: 'Vitthalrao Gaikwad',
    farmerMobile: '+91 98901 23456',
    location: 'Baramati, Pune',
    crop: 'Organic Fresh Methi (मेथी)',
    quantity: '400 kg',
    weightTons: 0.4,
    lat: 18.156,
    lng: 74.582,
    cluster: 'Baramati Green Belt',
    tempTarget: '3.5°C',
    priority: 'high',
  },
  {
    id: 'farm_nashik_red',
    farmName: 'Krishi Vikas FPO (Onion Yard)',
    farmerName: 'Rameshwar Patel',
    farmerMobile: '+91 98231 45678',
    location: 'Nashik Rural, MH',
    crop: 'Grade-A Red Onions',
    quantity: '3.5 Tons',
    weightTons: 3.5,
    lat: 20.015,
    lng: 73.791,
    cluster: 'Nashik Rural',
    tempTarget: '12.0°C',
    priority: 'low',
  },
  {
    id: 'farm_tomatoes',
    farmName: 'Krishi Vikas FPO (Tomato Hub)',
    farmerName: 'Dinkar Khairnar',
    farmerMobile: '+91 98225 67890',
    location: 'Niphad West, Nashik',
    crop: 'Hybrid Tomatoes (टमाटर)',
    quantity: '1.8 Tons',
    weightTons: 1.8,
    lat: 20.091,
    lng: 74.088,
    cluster: 'Niphad Valley',
    tempTarget: '5.5°C',
    priority: 'medium',
  },
];

// Available Fleet Vehicles
export const FLEET_VEHICLES = [
  {
    id: 'reefer_3_5',
    name: 'Tata 407 Reefer Van (3.5T)',
    type: 'Light Commercial Reefer',
    capacityTons: 3.5,
    mileageKmPerL: 6.2,
    co2KgPerKm: 0.48,
    minTempC: 2.0,
    idealFor: 'Delicate Green Vegetables & Rapid Transit',
  },
  {
    id: 'cold_truck_8_5',
    name: 'Eicher Pro Cold-Chain Truck (8.5T)',
    type: 'Multi-Axle Heavy Cold Carrier',
    capacityTons: 8.5,
    mileageKmPerL: 4.2,
    co2KgPerKm: 0.74,
    minTempC: -2.0,
    idealFor: 'Bulk Harvest Consolidation & Inter-City Hubs',
  },
  {
    id: 'ev_agri_2_0',
    name: 'Euler Turbo EV Cold Carrier (2.0T)',
    type: '100% Electric Green Corridor Van',
    capacityTons: 2.0,
    mileageKmPerL: 0, // Electric
    co2KgPerKm: 0.08,
    minTempC: 4.0,
    idealFor: 'Zero-Emission Eco Deliveries within 180 km',
  },
];

/**
 * Haversine distance with real-world road curvature factor (1.28x in Western Ghats/rural MH)
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLine = R * c;

  // Road curvature factor (Indian highways & rural approaches average ~1.28x straight line)
  return Math.round(straightLine * 1.28 * 10) / 10;
}

/**
 * Estimate transit duration in minutes based on distance & road type
 */
function calculateDurationMinutes(distanceKm) {
  // Average commercial vehicle speed in MH corridors: ~48 km/h including tolls & rural approaches
  const avgSpeedKmH = 48;
  return Math.round((distanceKm / avgSpeedKmH) * 60);
}

/**
 * Nearest Neighbor + 2-Opt Shortest Path Heuristic
 */
function optimizeWaypointSequence(stops, destinationHub) {
  if (stops.length <= 1) {
    return [...stops, destinationHub];
  }

  // Find the stop furthest away from the destination to serve as realistic origin
  let furthestIndex = 0;
  let maxDist = -1;
  stops.forEach((s, idx) => {
    const d = calculateDistanceKm(destinationHub.lat, destinationHub.lng, s.lat, s.lng);
    if (d > maxDist) {
      maxDist = d;
      furthestIndex = idx;
    }
  });

  const unvisited = [...stops];
  const ordered = [unvisited.splice(furthestIndex, 1)[0]];

  // Greedy Nearest Neighbor
  while (unvisited.length > 0) {
    const current = ordered[ordered.length - 1];
    let nearestIdx = 0;
    let shortestDist = Infinity;

    unvisited.forEach((candidate, idx) => {
      const dist = calculateDistanceKm(current.lat, current.lng, candidate.lat, candidate.lng);
      if (dist < shortestDist) {
        shortestDist = dist;
        nearestIdx = idx;
      }
    });

    ordered.push(unvisited.splice(nearestIdx, 1)[0]);
  }

  // 2-Opt Improvement heuristic for up to 8 waypoints
  let improved = true;
  let iterations = 0;
  while (improved && iterations < 20) {
    improved = false;
    iterations++;

    for (let i = 0; i < ordered.length - 1; i++) {
      for (let k = i + 1; k < ordered.length; k++) {
        const currentDist =
          (i > 0 ? calculateDistanceKm(ordered[i - 1].lat, ordered[i - 1].lng, ordered[i].lat, ordered[i].lng) : 0) +
          (k < ordered.length - 1
            ? calculateDistanceKm(ordered[k].lat, ordered[k].lng, ordered[k + 1].lat, ordered[k + 1].lng)
            : calculateDistanceKm(ordered[k].lat, ordered[k].lng, destinationHub.lat, destinationHub.lng));

        // Try reversed segment
        const newDist =
          (i > 0 ? calculateDistanceKm(ordered[i - 1].lat, ordered[i - 1].lng, ordered[k].lat, ordered[k].lng) : 0) +
          (k < ordered.length - 1
            ? calculateDistanceKm(ordered[i].lat, ordered[i].lng, ordered[k + 1].lat, ordered[k + 1].lng)
            : calculateDistanceKm(ordered[i].lat, ordered[i].lng, destinationHub.lat, destinationHub.lng));

        if (newDist < currentDist - 2) {
          // Reverse slice
          const reversed = ordered.slice(i, k + 1).reverse();
          ordered.splice(i, k - i + 1, ...reversed);
          improved = true;
        }
      }
    }
  }

  ordered.push(destinationHub);
  return ordered;
}

/**
 * Main AI Route Optimization function
 */
export function optimizeRoute({
  farmStopIds = [],
  destinationHubId = 'hub_mumbai',
  vehicleId = 'cold_truck_8_5',
  priority = 'freshness', // 'freshness' | 'cost' | 'eco'
}) {
  const destinationHub = REGIONAL_HUBS.find((h) => h.id === destinationHubId) || REGIONAL_HUBS[0];
  const vehicle = FLEET_VEHICLES.find((v) => v.id === vehicleId) || FLEET_VEHICLES[1];

  // Resolve selected farm stops (or default to top 4 farms if empty)
  let selectedFarms = FARM_CLUSTERS.filter((f) => farmStopIds.includes(f.id));
  if (selectedFarms.length === 0) {
    selectedFarms = FARM_CLUSTERS.slice(0, 4);
  }

  // 1. Calculate Unoptimized Baseline (random back-and-forth order with separate returns)
  let unoptimizedDistance = 0;
  selectedFarms.forEach((farm) => {
    // Round-trip baseline from hub to individual farm
    unoptimizedDistance += calculateDistanceKm(destinationHub.lat, destinationHub.lng, farm.lat, farm.lng) * 1.55;
  });
  unoptimizedDistance = Math.round(unoptimizedDistance);

  // 2. Calculate AI Optimized Waypoint Order (Consolidated Milk Run)
  const optimizedWaypoints = optimizeWaypointSequence(selectedFarms, destinationHub);

  // 3. Build Leg-by-Leg Dispatch Itinerary
  const legs = [];
  let totalDistanceKm = 0;
  let totalMinutes = 0;
  let accumulatedCargoTons = 0;
  const startTime = new Date();
  startTime.setHours(5, 30, 0, 0); // Morning 5:30 AM dispatch for sunrise freshness

  for (let i = 0; i < optimizedWaypoints.length; i++) {
    const waypoint = optimizedWaypoints[i];
    let legDist = 0;
    let legMins = 0;

    if (i > 0) {
      const prev = optimizedWaypoints[i - 1];
      legDist = calculateDistanceKm(prev.lat, prev.lng, waypoint.lat, waypoint.lng);
      legMins = calculateDurationMinutes(legDist);
      totalDistanceKm += legDist;
      totalMinutes += legMins;
    }

    if (waypoint.weightTons) {
      accumulatedCargoTons += waypoint.weightTons;
    }

    // Projected arrival time
    const arrivalTime = new Date(startTime.getTime() + totalMinutes * 60000);
    const arrivalFormatted = arrivalTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Simulated cold-chain temperature (calibrated between 3.6°C and 4.4°C)
    const legTemp = (3.8 + (i * 0.15) - (waypoint.priority === 'high' ? 0.3 : 0)).toFixed(1);

    legs.push({
      stopIndex: i + 1,
      id: waypoint.id,
      name: waypoint.farmName || waypoint.name,
      farmerName: waypoint.farmerName || null,
      farmerMobile: waypoint.farmerMobile || null,
      crop: waypoint.crop || null,
      quantity: waypoint.quantity || null,
      location: waypoint.location || waypoint.city,
      lat: waypoint.lat,
      lng: waypoint.lng,
      isDestination: i === optimizedWaypoints.length - 1,
      legDistanceKm: legDist,
      cumulativeDistanceKm: Math.round(totalDistanceKm * 10) / 10,
      legDurationMinutes: legMins,
      estimatedArrival: arrivalFormatted,
      currentTemperatureC: `${legTemp}°C`,
      cargoLoadedTons: Math.round(accumulatedCargoTons * 100) / 100,
      reeferStatus: 'Active Refrigeration (Optimal 4°C)',
    });
  }

  totalDistanceKm = Math.round(totalDistanceKm * 10) / 10;
  const unoptimizedHours = Math.round((unoptimizedDistance / 45) * 10) / 10;
  const optimizedHours = Math.round((totalMinutes / 60) * 10) / 10;

  // Savings Calculations
  const distanceSavedKm = Math.max(0, Math.round(unoptimizedDistance - totalDistanceKm));
  const distanceSavedPercent = Math.round((distanceSavedKm / unoptimizedDistance) * 100);
  const hoursSaved = Math.max(0, Math.round((unoptimizedHours - optimizedHours) * 10) / 10);

  // Diesel fuel savings (Avg 4.8 km/L for cold reefers, diesel @ ₹90/L)
  const fuelRatePerLiter = 90;
  const litersSaved = Math.round((distanceSavedKm / 4.8) * 10) / 10;
  const fuelCostSavedINR = Math.round(litersSaved * fuelRatePerLiter);

  // Carbon reduction (2.68 kg CO2 per liter of diesel burned)
  const co2ReductionKg = Math.round(litersSaved * 2.68);

  // Spoilage risk reduction (leafy greens degrade 8% per hour of delay in ambient temps)
  const spoilageRiskPercent = Math.max(0.6, (optimizedHours * 0.45)).toFixed(1);
  const baselineSpoilagePercent = (unoptimizedHours * 1.85).toFixed(1);

  // Vehicle payload capacity utilization
  const capacityTons = vehicle.capacityTons;
  const payloadUtilizationPercent = Math.min(100, Math.round((accumulatedCargoTons / capacityTons) * 100));

  return {
    success: true,
    routeId: `KD-ROUTE-${Date.now().toString().slice(-6)}`,
    destinationHub,
    vehicle,
    priority,
    summary: {
      totalStops: selectedFarms.length + 1,
      totalFarms: selectedFarms.length,
      totalCargoTons: Math.round(accumulatedCargoTons * 100) / 100,
      payloadUtilizationPercent,
      optimizedDistanceKm: totalDistanceKm,
      unoptimizedDistanceKm: unoptimizedDistance,
      distanceSavedKm,
      distanceSavedPercent,
      optimizedDurationHours: optimizedHours,
      unoptimizedDurationHours: unoptimizedHours,
      hoursSaved,
      litersSaved,
      fuelCostSavedINR,
      co2ReductionKg,
      spoilageRiskPercent: `${spoilageRiskPercent}%`,
      baselineSpoilagePercent: `${baselineSpoilagePercent}%`,
      avgReeferTemp: '4.1°C',
    },
    legs,
    driverInfo: {
      name: 'Raju Shinde',
      mobile: '+91 98220 98765',
      license: 'MH-15-2021-0044812',
      vehicleNumber: 'MH-15-JC-4892',
      gpsTrackerId: 'TELEMETRY-KD-99',
    },
  };
}
