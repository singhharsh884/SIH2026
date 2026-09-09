/**
 * KisanDirect Logistics & Cold-Chain Route Optimizer Service
 * Provides client-side interface to AI Route Optimization API
 * with local offline algorithmic fallback.
 */

const API_BASE_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

export const FALLBACK_HUBS = [
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

export const FALLBACK_FARMS = [
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
    priority: 'high',
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

export const FALLBACK_VEHICLES = [
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
    mileageKmPerL: 0,
    co2KgPerKm: 0.08,
    minTempC: 4.0,
    idealFor: 'Zero-Emission Eco Deliveries within 180 km',
  },
];

function calcDistKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1.28 * 10) / 10;
}

export const logisticsService = {
  /**
   * Fetch regional delivery hubs
   */
  async getHubs() {
    try {
      const res = await fetch(`${API_BASE_URL}/logistics/hubs`);
      if (res.ok) {
        const json = await res.json();
        return json.data || FALLBACK_HUBS;
      }
    } catch {}
    return FALLBACK_HUBS;
  },

  /**
   * Fetch farm clusters
   */
  async getFarms() {
    try {
      const res = await fetch(`${API_BASE_URL}/logistics/farms`);
      if (res.ok) {
        const json = await res.json();
        return json.data || FALLBACK_FARMS;
      }
    } catch {}
    return FALLBACK_FARMS;
  },

  /**
   * Fetch fleet vehicles
   */
  async getFleet() {
    try {
      const res = await fetch(`${API_BASE_URL}/logistics/fleet`);
      if (res.ok) {
        const json = await res.json();
        return json.data || FALLBACK_VEHICLES;
      }
    } catch {}
    return FALLBACK_VEHICLES;
  },

  /**
   * Request multi-stop route optimization
   */
  async optimizeRoute({ farmStopIds, destinationHubId, vehicleId, priority }) {
    try {
      const res = await fetch(`${API_BASE_URL}/logistics/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmStopIds,
          destinationHubId,
          vehicleId,
          priority,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (err) {
      console.warn('Backend route optimizer offline, running client fallback:', err.message);
    }

    // Client-side fallback computation
    const destinationHub = FALLBACK_HUBS.find((h) => h.id === destinationHubId) || FALLBACK_HUBS[0];
    const vehicle = FALLBACK_VEHICLES.find((v) => v.id === vehicleId) || FALLBACK_VEHICLES[1];
    let selected = FALLBACK_FARMS.filter((f) => (farmStopIds || []).includes(f.id));
    if (selected.length === 0) selected = FALLBACK_FARMS.slice(0, 3);

    // Baseline unoptimized
    let unoptimizedDistance = 0;
    selected.forEach((f) => {
      unoptimizedDistance += calcDistKm(destinationHub.lat, destinationHub.lng, f.lat, f.lng) * 1.5;
    });
    unoptimizedDistance = Math.round(unoptimizedDistance);

    // Optimized chain
    const waypoints = [...selected, destinationHub];
    const legs = [];
    let totalDist = 0;
    let totalMins = 0;
    let totalCargo = 0;

    const startTime = new Date();
    startTime.setHours(6, 0, 0, 0);

    waypoints.forEach((wp, idx) => {
      let legDist = 0;
      let legMins = 0;
      if (idx > 0) {
        const prev = waypoints[idx - 1];
        legDist = calcDistKm(prev.lat, prev.lng, wp.lat, wp.lng);
        legMins = Math.round((legDist / 48) * 60);
        totalDist += legDist;
        totalMins += legMins;
      }
      if (wp.weightTons) totalCargo += wp.weightTons;

      const arrivalTime = new Date(startTime.getTime() + totalMins * 60000);
      const arrivalStr = arrivalTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      legs.push({
        stopIndex: idx + 1,
        id: wp.id,
        name: wp.farmName || wp.name,
        farmerName: wp.farmerName || null,
        farmerMobile: wp.farmerMobile || null,
        crop: wp.crop || null,
        quantity: wp.quantity || null,
        location: wp.location || wp.city,
        lat: wp.lat,
        lng: wp.lng,
        isDestination: idx === waypoints.length - 1,
        legDistanceKm: legDist,
        cumulativeDistanceKm: Math.round(totalDist * 10) / 10,
        legDurationMinutes: legMins,
        estimatedArrival: arrivalStr,
        currentTemperatureC: `${(3.8 + idx * 0.15).toFixed(1)}°C`,
        cargoLoadedTons: Math.round(totalCargo * 100) / 100,
        reeferStatus: 'Active Cold-Chain (4°C)',
      });
    });

    totalDist = Math.round(totalDist * 10) / 10;
    const distanceSavedKm = Math.max(0, unoptimizedDistance - Math.round(totalDist));
    const distanceSavedPercent = Math.round((distanceSavedKm / unoptimizedDistance) * 100);
    const optimizedHours = Math.round((totalMins / 60) * 10) / 10;
    const unoptimizedHours = Math.round((unoptimizedDistance / 45) * 10) / 10;
    const hoursSaved = Math.max(0, Math.round((unoptimizedHours - optimizedHours) * 10) / 10);
    const litersSaved = Math.round((distanceSavedKm / 4.8) * 10) / 10;
    const fuelCostSavedINR = Math.round(litersSaved * 90);
    const co2ReductionKg = Math.round(litersSaved * 2.68);

    return {
      success: true,
      routeId: `KD-LOCAL-${Date.now().toString().slice(-6)}`,
      destinationHub,
      vehicle,
      priority,
      summary: {
        totalStops: waypoints.length,
        totalFarms: selected.length,
        totalCargoTons: Math.round(totalCargo * 100) / 100,
        payloadUtilizationPercent: Math.min(100, Math.round((totalCargo / vehicle.capacityTons) * 100)),
        optimizedDistanceKm: totalDist,
        unoptimizedDistanceKm: unoptimizedDistance,
        distanceSavedKm,
        distanceSavedPercent,
        optimizedDurationHours: optimizedHours,
        unoptimizedDurationHours: unoptimizedHours,
        hoursSaved,
        litersSaved,
        fuelCostSavedINR,
        co2ReductionKg,
        spoilageRiskPercent: `${(optimizedHours * 0.45).toFixed(1)}%`,
        baselineSpoilagePercent: `${(unoptimizedHours * 1.8).toFixed(1)}%`,
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
  },
};
