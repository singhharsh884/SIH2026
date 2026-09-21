import mongoose from 'mongoose';
import { CropModel, memoryCropStore } from '../models/Crop.js';
import { RFQModel, memoryRFQStore } from '../models/RFQ.js';
import { isConnectedToMongo } from '../config/db.js';
import { calculateDistanceKm, FARM_CLUSTERS } from '../services/routeOptimizerService.js';

/**
 * Parses numeric quantity in kilograms from strings like "850 kg", "1.2 Tons", "3.5 Tons", "600"
 */
function parseQuantityToKg(qtyStr) {
  if (typeof qtyStr === 'number') return qtyStr;
  if (!qtyStr) return 0;
  const lower = String(qtyStr).toLowerCase();
  const num = parseFloat(lower.replace(/[^\d.]/g, '')) || 0;
  if (lower.includes('ton')) {
    return Math.round(num * 1000);
  }
  if (lower.includes('quintal')) {
    return Math.round(num * 100);
  }
  return Math.round(num);
}

/**
 * Demand-to-Supply Auto-Matching Engine (PRD v2.0.0 Section 12)
 * Matches buyer wholesale requirements with compatible smallholder farm lots
 */
export const findMatchesForDemand = async (req, res, next) => {
  try {
    const targetRfqId = req.params?.rfqId || req.params?.id || req.body?.rfqId;
    const {
      commodity,
      volumeKg,
      maxRadiusKm = 250,
      buyerLocation = { lat: 19.076, lng: 73.001, name: 'Mumbai Central Depot' },
      targetRate,
    } = req.body || {};

    let targetCommodity = commodity;
    let requiredKg = parseQuantityToKg(volumeKg);

    const hasLiveMongo = isConnectedToMongo && mongoose.connection.readyState === 1;

    // If an existing rfqId is provided, resolve from database or memory store
    if (targetRfqId) {
      let rfq = null;
      if (hasLiveMongo && mongoose.isValidObjectId(targetRfqId)) {
        rfq = await RFQModel.findById(targetRfqId);
      }
      if (!rfq) {
        rfq = await memoryRFQStore.findById(targetRfqId);
      }

      if (rfq) {
        targetCommodity = targetCommodity || rfq.commodity;
        requiredKg = requiredKg || parseQuantityToKg(rfq.volume);
      }
    }

    if (!targetCommodity) {
      return res.status(400).json({
        success: false,
        message: 'Commodity name is required to match supply',
      });
    }

    requiredKg = requiredKg || 1500; // Default demonstration volume: 1,500 kg

    // 1. Fetch live farm crops
    let availableCrops = [];
    if (hasLiveMongo) {
      availableCrops = await CropModel.find();
    } else {
      availableCrops = await memoryCropStore.find();
    }

    // Merge with registered FARM_CLUSTERS to ensure realistic GPS coordinates and farm contacts
    const candidateLots = availableCrops.map((crop, idx) => {
      let clusterMatch = null;
      if (crop.location) {
        const cropLocLower = crop.location.toLowerCase();
        clusterMatch = FARM_CLUSTERS.find((fc) => {
          const fcLocLower = fc.location.toLowerCase();
          const fcClusterLower = fc.cluster.toLowerCase();
          return (
            (cropLocLower.includes('lucknow') && fcLocLower.includes('lucknow')) ||
            (cropLocLower.includes('malihabad') && fcLocLower.includes('malihabad')) ||
            (cropLocLower.includes('mohanlalganj') && fcLocLower.includes('mohanlalganj')) ||
            (cropLocLower.includes('bakshi') && fcLocLower.includes('bakshi')) ||
            (cropLocLower.includes('niphad') && fcLocLower.includes('niphad')) ||
            (cropLocLower.includes('pune') && fcLocLower.includes('pune')) ||
            (cropLocLower.includes('dindori') && fcLocLower.includes('dindori'))
          );
        });
      }
      if (!clusterMatch) {
        clusterMatch = FARM_CLUSTERS[idx % FARM_CLUSTERS.length];
      }

      const cropKg = parseQuantityToKg(crop.quantity);
      const lat = clusterMatch?.lat || 20.082;
      const lng = clusterMatch?.lng || 74.112;
      const distanceToBuyer = calculateDistanceKm(buyerLocation.lat, buyerLocation.lng, lat, lng);

      return {
        lotId: crop._id || `crop_${idx + 1}`,
        cropName: crop.cropName,
        category: crop.category,
        availableKg: cropKg,
        pricePerKg: crop.price,
        mandiBenchmark: crop.mandi,
        farmerName: crop.farmerName || clusterMatch?.farmerName || 'Rameshwar Patel',
        farmName: crop.farmName || clusterMatch?.farmName || 'Patel Green Farms',
        farmerMobile: crop.farmerMobile || clusterMatch?.farmerMobile || '+91 98231 45678',
        location: crop.location || clusterMatch?.location || 'Nashik, Maharashtra',
        lat,
        lng,
        distanceToBuyerKm: distanceToBuyer,
        harvestDate: crop.harvestDate || 'Harvested Today',
        status: crop.status || 'Active • Ready for Dispatch',
      };
    });

    // 2. Score and Filter candidates
    const searchTerms = targetCommodity.toLowerCase().split(' ');

    const scoredLots = candidateLots
      .map((lot) => {
        const lotName = lot.cropName.toLowerCase();
        let nameMatchScore = 0;

        searchTerms.forEach((term) => {
          if (term.length > 2 && lotName.includes(term)) {
            nameMatchScore += 40;
          }
        });

        // If generic category or high proximity match
        if (nameMatchScore === 0 && lot.category === 'Vegetables') {
          nameMatchScore = 15; // Partial compatibility
        }

        // Distance score (max 30 pts for close proximity)
        const distanceScore = Math.max(0, 30 - Math.round(lot.distanceToBuyerKm / 5));

        // Volume availability score (max 20 pts)
        const volumeScore = Math.min(20, Math.round((lot.availableKg / requiredKg) * 20));

        // Freshness score (10 pts)
        const freshnessScore = 10;

        const totalScore = Math.min(100, nameMatchScore + distanceScore + volumeScore + freshnessScore);

        return {
          ...lot,
          compatibilityScore: totalScore,
        };
      })
      .filter((lot) => lot.compatibilityScore >= 25 && lot.distanceToBuyerKm <= maxRadiusKm)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    // 3. FPO Aggregation: Accumulate lots to meet target volume
    let accumulatedKg = 0;
    const matchedLots = [];

    for (const lot of scoredLots) {
      if (accumulatedKg >= requiredKg) break;

      const neededKg = requiredKg - accumulatedKg;
      const allocatedKg = Math.min(lot.availableKg, neededKg);

      accumulatedKg += allocatedKg;
      matchedLots.push({
        ...lot,
        allocatedKg,
        contributionPercent: Math.round((allocatedKg / requiredKg) * 100),
      });
    }

    const shortfallKg = Math.max(0, requiredKg - accumulatedKg);
    const isFullyMatched = shortfallKg === 0;
    const avgScore =
      matchedLots.length > 0
        ? Math.round(matchedLots.reduce((acc, it) => acc + it.compatibilityScore, 0) / matchedLots.length)
        : 0;

    res.status(200).json({
      success: true,
      demandQuery: {
        commodity: targetCommodity,
        volumeRequiredKg: requiredKg,
        volumeRequiredFormatted: `${(requiredKg / 1000).toFixed(2)} Tons (${requiredKg} kg)`,
        targetRate: targetRate || 'Market Benchmark Rate',
        buyerLocation,
      },
      matchSummary: {
        isFullyMatched,
        totalMatchedKg: accumulatedKg,
        totalMatchedFormatted: `${(accumulatedKg / 1000).toFixed(2)} Tons`,
        shortfallKg,
        lotsAggregatedCount: matchedLots.length,
        overallMatchScore: `${avgScore}%`,
        status: isFullyMatched ? '100% DEMAND FULFILLED' : `PARTIALLY MATCHED (${shortfallKg} kg shortfall)`,
      },
      fpoAggregationStrategy: {
        concept: 'Consolidates multiple fragmented farm lots into a single institutional wholesale contract',
        explanation: `Aggregated ${matchedLots.length} separate farm pickups into one single cold-chain delivery run to fulfill ${requiredKg} kg requirement.`,
      },
      matchedLots,
    });
  } catch (error) {
    next(error);
  }
};
