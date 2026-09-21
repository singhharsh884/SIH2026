import express from 'express';
import { OrderModel, memoryOrderStore } from '../models/Order.js';
import { isConnectedToMongo } from '../config/db.js';
import mongoose from 'mongoose';

const router = express.Router();

// Resilient In-Memory Dispute Store
const memoryDisputes = [
  {
    disputeId: 'DISP-KD-2026-081',
    orderId: 'ord_sample_1',
    buyerName: 'TastyGreens Central Hub',
    buyerMobile: '+91 98201 12345',
    cropName: 'Fresh Spinach (पालक)',
    quantityKg: 500,
    reason: 'DEFECT_PERCENTAGE_EXCEEDED',
    reasonDescription: 'Field inspection found 6.5% leaf yellowing due to pre-harvest humidity (Tolerance limit is 5%)',
    defectPercentage: 6.5,
    photoEvidenceUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80',
    requestedResolution: 'PARTIAL_REFUND',
    status: 'SETTLED',
    settlement: {
      type: 'PARTIAL_REFUND',
      refundAmount: 910,
      refundCurrency: '₹',
      refundStatus: 'CREDITED_TO_BUYER_ESCROW',
      adjustedFarmerPayout: 11680,
      resolvedAt: new Date(Date.now() - 3600000 * 2),
      officerNote: '6.5% damage verified by Quality Inspector Ramesh. ₹910 refund credited back to TastyGreens.',
    },
    createdAt: new Date(Date.now() - 3600000 * 5),
  },
];

/**
 * @desc    Raise a Quality Dispute against an order (PRD v2.0.0 Section 27)
 * @route   POST /api/disputes
 * @access  Public / Buyer
 */
router.post('/', async (req, res, next) => {
  try {
    const {
      orderId,
      buyerName = 'TastyGreens Chain',
      buyerMobile = '+91 98201 12345',
      cropName = 'Farm Fresh Produce',
      quantityKg = 500,
      reason = 'DEFECT_PERCENTAGE_EXCEEDED',
      defectPercentage = 8,
      photoEvidenceUrl,
      requestedResolution = 'PARTIAL_REFUND',
      note = 'Produce inspection upon delivery showed physical defects exceeding grade threshold.',
    } = req.body;

    const VALID_REASONS = [
      'DEFECT_PERCENTAGE_EXCEEDED',
      'TEMPERATURE_BREACH',
      'GRADE_MISMATCH',
      'WEIGHT_SHORTFALL',
      'TRANSIT_DELAY',
    ];

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'orderId is required to raise a dispute.',
      });
    }

    const hasLiveMongo = isConnectedToMongo && mongoose.connection.readyState === 1;
    let order = null;
    if (hasLiveMongo) {
      try {
        const query = mongoose.isValidObjectId(orderId)
          ? { $or: [{ _id: orderId }, { orderId }] }
          : { orderId };
        order = await OrderModel.findOne(query);
      } catch (e) {}
    }
    if (!order) {
      order = await memoryOrderStore.findById(orderId);
    }

    const totalOrderAmount = order?.totalAmount || 14000;
    const estimatedDeduction = Math.round(totalOrderAmount * (Math.min(defectPercentage, 50) / 100));

    const disputeId = `DISP-KD-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newDispute = {
      disputeId,
      orderId,
      buyerName,
      buyerMobile,
      cropName: order?.items?.[0]?.name || cropName,
      quantityKg: order?.items?.[0]?.quantity || quantityKg,
      reason: VALID_REASONS.includes(reason) ? reason : 'DEFECT_PERCENTAGE_EXCEEDED',
      reasonDescription: note,
      defectPercentage: Number(defectPercentage) || 5,
      photoEvidenceUrl:
        photoEvidenceUrl ||
        'https://images.unsplash.com/photo-1592417817098-8f3d69102657?auto=format&fit=crop&w=400&q=80',
      requestedResolution,
      status: 'UNDER_REVIEW',
      estimatedClaimAmount: estimatedDeduction,
      createdAt: new Date(),
    };

    memoryDisputes.unshift(newDispute);

    // Update order status to DISPUTED if order exists
    if (order) {
      if (hasLiveMongo) {
        try {
          await OrderModel.findOneAndUpdate(
            { $or: [{ _id: orderId }, { orderId }] },
            {
              status: 'DISPUTED',
              $push: {
                statusHistory: {
                  status: 'DISPUTED',
                  timestamp: new Date(),
                  note: `Quality dispute raised: ${reason} (${defectPercentage}% defect claim)`,
                },
              },
            }
          );
        } catch (e) {}
      } else {
        await memoryOrderStore.findByIdAndUpdate(orderId, {
          status: 'DISPUTED',
          note: `Quality dispute raised: ${reason}`,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Quality dispute successfully registered and sent for FPO / Platform review.',
      data: newDispute,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Get all disputes
 * @route   GET /api/disputes
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: memoryDisputes.length,
    data: memoryDisputes,
  });
});

/**
 * @desc    Get dispute by ID
 * @route   GET /api/disputes/:id
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const dispute = memoryDisputes.find((d) => d.disputeId === id || d._id === id);
  if (!dispute) {
    return res.status(404).json({ success: false, message: 'Dispute not found' });
  }
  res.status(200).json({ success: true, data: dispute });
});

/**
 * @desc    Resolve a quality dispute and adjust payout settlement (PRD v2.0.0 Section 27)
 * @route   PATCH /api/disputes/:id/resolve
 */
router.patch('/:id/resolve', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      resolutionType = 'PARTIAL_REFUND',
      refundAmount,
      resolutionNote = 'Defects verified by Quality Assessor; settlement released to buyer escrow.',
      officerName = 'Quality Lead Ramesh Patil',
    } = req.body;

    const disputeIdx = memoryDisputes.findIndex((d) => d.disputeId === id || d._id === id);
    if (disputeIdx === -1) {
      return res.status(404).json({ success: false, message: 'Dispute not found' });
    }

    const dispute = memoryDisputes[disputeIdx];
    const finalRefund = typeof refundAmount === 'number' ? refundAmount : dispute.estimatedClaimAmount || 850;

    const settlement = {
      type: resolutionType,
      refundAmount: finalRefund,
      refundCurrency: '₹',
      refundStatus: 'CREDITED_TO_BUYER_ESCROW',
      resolutionNote,
      officerName,
      resolvedAt: new Date(),
    };

    dispute.status = 'SETTLED';
    dispute.settlement = settlement;
    memoryDisputes[disputeIdx] = dispute;

    res.status(200).json({
      success: true,
      message: `Dispute ${id} resolved with ${resolutionType}! Buyer escrow refunded ₹${finalRefund}.`,
      data: dispute,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
