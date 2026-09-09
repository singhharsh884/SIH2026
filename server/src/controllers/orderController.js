import { OrderModel, memoryOrderStore } from '../models/Order.js';
import { RFQModel, memoryRFQStore } from '../models/RFQ.js';
import { isConnectedToMongo } from '../config/db.js';

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
