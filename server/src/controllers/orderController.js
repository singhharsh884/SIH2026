import mongoose from 'mongoose';
import { OrderModel, memoryOrderStore } from '../models/Order.js';
import { RFQModel, memoryRFQStore } from '../models/RFQ.js';
import { isConnectedToMongo } from '../config/db.js';

/**
 * Safe Order Lookup that prevents CastError on non-ObjectId in memory mode
 */
const findOrderSafely = async (id) => {
  const hasLiveMongo = isConnectedToMongo && mongoose.connection.readyState === 1;
  let order = null;
  if (hasLiveMongo) {
    try {
      const query = mongoose.isValidObjectId(id)
        ? { $or: [{ _id: id }, { orderId: id }] }
        : { orderId: id };
      order = await OrderModel.findOne(query);
    } catch (e) {
      order = null;
    }
  }
  if (!order) {
    order = await memoryOrderStore.findById(id);
  }
  return order;
};

/**
 * Safe Order Update
 */
const updateOrderSafely = async (id, updateDoc) => {
  const hasLiveMongo = isConnectedToMongo && mongoose.connection.readyState === 1;
  let updated = null;
  if (hasLiveMongo) {
    try {
      const query = mongoose.isValidObjectId(id)
        ? { $or: [{ _id: id }, { orderId: id }] }
        : { orderId: id };
      updated = await OrderModel.findOneAndUpdate(query, updateDoc, { new: true });
    } catch (e) {
      updated = null;
    }
  }
  if (!updated) {
    updated = await memoryOrderStore.findByIdAndUpdate(id, updateDoc);
  }
  return updated;
};

/**
 * @desc    Place a new consumer or bulk order
 * @route   POST /api/orders
 */
export const createOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      customerMobile,
      items,
      totalAmount,
      deliveryAddress,
      deliverySlot,
      paymentMethod,
      orderType,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    const orderId = 'KD-' + Math.floor(100000 + Math.random() * 900000);

    const parsedItems = items.map((item, idx) => {
      const priceNum =
        typeof item.price === 'number'
          ? item.price
          : parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 0;
      const qtyNum =
        typeof item.quantity === 'number'
          ? item.quantity
          : parseFloat(String(item.quantity).replace(/[^\d.]/g, '')) || 1;

      return {
        productId: item.productId || item.id || `prod_${idx + 1}`,
        name: item.name || item.cropName || 'Farm Fresh Produce',
        farm: item.farm || item.farmName || 'Direct Farm',
        price: priceNum,
        quantity: Math.max(1, qtyNum),
        unit: item.unit || 'kg',
      };
    });

    const finalTotal =
      typeof totalAmount === 'number'
        ? totalAmount
        : parseFloat(String(totalAmount).replace(/[^\d.]/g, '')) ||
          parsedItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

    const orderPayload = {
      orderId,
      customerName: customerName || 'KisanDirect Customer',
      customerMobile: customerMobile || '',
      items: parsedItems,
      totalAmount: finalTotal,
      deliveryAddress: deliveryAddress || 'Registered Address',
      deliverySlot: deliverySlot || 'Tomorrow Morning: 6 AM - 9 AM Direct Farm Harvest',
      paymentMethod: paymentMethod || 'UPI / KisanPay Direct',
      orderType: orderType || 'consumer',
      status: 'Harvesting at Farm',
    };

    let newOrder;
    if (isConnectedToMongo) {
      newOrder = await OrderModel.create(orderPayload);
    } else {
      newOrder = await memoryOrderStore.create(orderPayload);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Farmer harvesting initiated.',
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 */
export const getOrders = async (req, res, next) => {
  try {
    let orders;
    if (isConnectedToMongo) {
      orders = await OrderModel.find().sort({ createdAt: -1 });
    } else {
      orders = await memoryOrderStore.find();
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order by ID with full lifecycle timeline & payout breakdown
 * @route   GET /api/orders/:id
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await findOrderSafely(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Order Status in PRD Lifecycle State Machine
 * @route   PATCH /api/orders/:id/status
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const PRD_ORDER_LIFECYCLE = [
      'ORDER_CREATED',
      'PAYMENT_CONFIRMED',
      'PICKUP_SCHEDULED',
      'IN_TRANSIT',
      'DELIVERED',
      'QUALITY_CONFIRMED',
      'PAYOUT_RELEASED',
      'DISPUTED',
      'CANCELLED',
      // Legacy UI mapping support
      'Harvesting at Farm',
      'Quality Inspection',
      'In Cold-Chain Transit',
      'Delivered',
    ];

    if (!status || !PRD_ORDER_LIFECYCLE.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${PRD_ORDER_LIFECYCLE.join(', ')}`,
      });
    }

    const order = await findOrderSafely(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with ID: ${id}`,
      });
    }

    const previousStatus = order.status;
    const newTimelineEntry = {
      status,
      timestamp: new Date(),
      note: note || `Order advanced from ${previousStatus} to ${status}`,
    };

    const updatePayload = {
      status,
      note: note || `Advanced to ${status}`,
      $push: { statusHistory: newTimelineEntry },
    };

    if (status === 'PAYOUT_RELEASED' && order.payout) {
      updatePayload['payout.payoutStatus'] = 'RELEASED_TO_FARMER';
      updatePayload['payout.payoutReference'] = 'PAY-KD-' + Math.floor(100000 + Math.random() * 900000);
      updatePayload['payout.releasedAt'] = new Date();
    }

    const updatedOrder = await updateOrderSafely(id, updatePayload);

    res.status(200).json({
      success: true,
      message: `Order status successfully transitioned to: ${status}`,
      data: {
        orderId: updatedOrder.orderId || id,
        previousStatus,
        currentStatus: updatedOrder.status,
        timeline: updatedOrder.statusHistory,
        payout: updatedOrder.payout,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    4-Stage Quantity & Weighing Reconciliation
 * @route   POST /api/orders/:id/weighing
 */
export const recordWeighingReconciliation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stage, weightKg } = req.body; // stage: 'declared' | 'farmgate' | 'hub' | 'buyer'

    if (!stage || typeof weightKg !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'stage (declared | farmgate | hub | buyer) and numeric weightKg are required.',
      });
    }

    const order = await findOrderSafely(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const currentRecon = order.weighingReconciliation || {
      farmerDeclaredKg: 0,
      farmgateWeighedKg: 0,
      hubWeighedKg: 0,
      buyerReceivedKg: 0,
    };

    if (stage === 'declared') currentRecon.farmerDeclaredKg = weightKg;
    if (stage === 'farmgate') currentRecon.farmgateWeighedKg = weightKg;
    if (stage === 'hub') currentRecon.hubWeighedKg = weightKg;
    if (stage === 'buyer') currentRecon.buyerReceivedKg = weightKg;

    // Calculate moisture shrinkage
    const originWeight = currentRecon.farmgateWeighedKg || currentRecon.farmerDeclaredKg || weightKg;
    const receivedWeight = currentRecon.buyerReceivedKg || currentRecon.hubWeighedKg || originWeight;
    const variance = Math.max(0, +(originWeight - receivedWeight).toFixed(2));
    const variancePercent = originWeight > 0 ? +((variance / originWeight) * 100).toFixed(2) : 0;

    currentRecon.shrinkageVarianceKg = variance;
    currentRecon.shrinkagePercent = variancePercent;
    currentRecon.status = variancePercent <= 2.5 ? 'WITHIN_TOLERANCE' : 'EXCESS_SHRINKAGE';

    await updateOrderSafely(id, { weighingReconciliation: currentRecon });

    res.status(200).json({
      success: true,
      message: `Weighing recorded for stage: ${stage}`,
      data: currentRecon,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Release Transparent Farmer Payout with itemized Unit Economics
 * @route   POST /api/orders/:id/payout/release
 */
export const releaseOrderPayout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await findOrderSafely(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const gross = order.totalAmount || 10000;
    const logistics = Math.round(gross * 0.085); // 8.5% transport + cold-chain
    const platform = Math.round(gross * 0.015);  // 1.5% tech platform fee
    const netFarmer = gross - logistics - platform; // ~90% realization

    const payoutData = {
      grossBuyerAmount: gross,
      logisticsDeduction: logistics,
      platformFee: platform,
      netFarmerPayout: netFarmer,
      payoutStatus: 'RELEASED_TO_FARMER',
      payoutReference: 'UPI-FARM-' + Math.floor(10000000 + Math.random() * 90000000),
      releasedAt: new Date(),
    };

    const updatedOrder = await updateOrderSafely(id, {
      payout: payoutData,
      status: 'PAYOUT_RELEASED',
      note: `Farmer Payout ₹${netFarmer} settled directly via UPI`,
      $push: {
        statusHistory: {
          status: 'PAYOUT_RELEASED',
          timestamp: new Date(),
          note: `Farmer Payout ₹${netFarmer} settled directly via UPI`,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Farmer Payout successfully released from Escrow!',
      unitEconomics: {
        grossBuyerPayment: `₹${gross.toLocaleString('en-IN')}`,
        logisticsAndColdChainCost: `₹${logistics.toLocaleString('en-IN')}`,
        platformAggregationFee: `₹${platform.toLocaleString('en-IN')}`,
        netFarmerRealization: `₹${netFarmer.toLocaleString('en-IN')}`,
        farmerSharePercentage: `${((netFarmer / gross) * 100).toFixed(1)}%`,
        status: 'PAID_TO_FARMER',
        reference: payoutData.payoutReference,
      },
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all wholesale RFQs
 * @route   GET /api/rfq
 */
export const getRFQs = async (req, res, next) => {
  try {
    let rfqs;
    if (isConnectedToMongo) {
      rfqs = await RFQModel.find().sort({ createdAt: -1 });
      if (rfqs.length === 0) {
        const seed = await memoryRFQStore.find();
        rfqs = await RFQModel.insertMany(
          seed.map(({ _id, ...rest }) => rest)
        );
      }
    } else {
      rfqs = await memoryRFQStore.find();
    }

    res.status(200).json({
      success: true,
      count: rfqs.length,
      data: rfqs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new wholesale RFQ / Forward Contract
 * @route   POST /api/rfq
 */
export const createRFQ = async (req, res, next) => {
  try {
    const {
      title,
      commodity,
      volume,
      frequency,
      targetRate,
      buyerBusinessName,
      deliveryHub,
      coldChainRequired,
    } = req.body;

    if (!commodity || !volume || !targetRate) {
      return res.status(400).json({
        success: false,
        message: 'Commodity, Volume, and Target Rate are required.',
      });
    }

    const rfqPayload = {
      title: title || `${commodity} Wholesale Contract`,
      commodity,
      volume,
      frequency: frequency || 'Weekly Recurring',
      targetRate: targetRate.includes('₹') ? targetRate : `₹${targetRate}/kg`,
      buyerBusinessName: buyerBusinessName || 'TastyGreens Chain',
      supplierFPO: 'Matched via AI Fleet',
      deliveryHub: deliveryHub || 'Central Cold Storage Hub',
      coldChainRequired: coldChainRequired !== false,
      status: 'Contract Active',
    };

    let newRFQ;
    if (isConnectedToMongo) {
      newRFQ = await RFQModel.create(rfqPayload);
    } else {
      newRFQ = await memoryRFQStore.create(rfqPayload);
    }

    res.status(201).json({
      success: true,
      message: 'Wholesale RFQ published and matched with farm clusters!',
      data: newRFQ,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete / Cancel an RFQ
 * @route   DELETE /api/rfq/:id
 */
export const deleteRFQ = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isConnectedToMongo) {
      await RFQModel.findByIdAndDelete(id);
    } else {
      await memoryRFQStore.findByIdAndDelete(id);
    }
    res.status(200).json({
      success: true,
      message: 'RFQ removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
