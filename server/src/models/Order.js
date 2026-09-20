import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  farm: { type: String, default: 'Direct Farm' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, default: 'kg' },
});

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    orderType: {
      type: String,
      enum: ['consumer', 'bulk'],
      default: 'consumer',
    },
    customerName: {
      type: String,
      required: true,
    },
    customerMobile: {
      type: String,
      default: '',
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    deliverySlot: {
      type: String,
      default: 'Tomorrow Morning: 6 AM - 9 AM Direct Farm Harvest',
    },
    paymentMethod: {
      type: String,
      default: 'UPI / Direct Bank Transfer',
    },
    status: {
      type: String,
      default: 'ORDER_CREATED',
    },
    statusHistory: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' },
      },
    ],
    weighingReconciliation: {
      farmerDeclaredKg: { type: Number },
      farmgateWeighedKg: { type: Number },
      hubWeighedKg: { type: Number },
      buyerReceivedKg: { type: Number },
      shrinkageVarianceKg: { type: Number },
      shrinkagePercent: { type: Number },
      status: { type: String, default: 'PENDING' },
    },
    payout: {
      grossBuyerAmount: { type: Number },
      logisticsDeduction: { type: Number },
      platformFee: { type: Number },
      netFarmerPayout: { type: Number },
      payoutStatus: {
        type: String,
        enum: ['HELD_IN_ESCROW', 'RELEASED_TO_FARMER', 'DISPUTE_RESERVED'],
        default: 'HELD_IN_ESCROW',
      },
      payoutReference: { type: String },
      releasedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.model('Order', OrderSchema);

/**
 * Resilient In-Memory Order Store
 */
class MemoryOrderStore {
  constructor() {
    this.orders = [
      {
        _id: 'ord_sample_1',
        orderId: 'KD-2026-7841',
        orderType: 'bulk',
        customerName: 'TastyGreens Chain',
        customerMobile: '+91 98201 12345',
        items: [
          {
            productId: 'crop_1',
            name: 'Fresh Spinach (पालक)',
            farm: 'Patel Green Farms',
            price: 28,
            quantity: 500,
            unit: 'kg',
          },
        ],
        totalAmount: 14000,
        deliveryAddress: 'TastyGreens Central Hub, Vashi Navi Mumbai',
        deliverySlot: 'Tomorrow 07:00 AM Cold-Chain Delivery',
        paymentMethod: 'UPI / KisanPay Direct',
        status: 'PICKUP_SCHEDULED',
        statusHistory: [
          { status: 'ORDER_CREATED', timestamp: new Date(Date.now() - 3600000 * 4), note: 'Wholesale order initiated' },
          { status: 'PAYMENT_CONFIRMED', timestamp: new Date(Date.now() - 3600000 * 3), note: 'Payment held in Escrow' },
          { status: 'PICKUP_SCHEDULED', timestamp: new Date(Date.now() - 3600000 * 1), note: 'Assigned Reefer EV Van' },
        ],
        weighingReconciliation: {
          farmerDeclaredKg: 500,
          farmgateWeighedKg: 494,
          hubWeighedKg: 494,
          buyerReceivedKg: null,
          shrinkageVarianceKg: 6,
          shrinkagePercent: 1.2,
          status: 'WITHIN_TOLERANCE',
        },
        payout: {
          grossBuyerAmount: 14000,
          logisticsDeduction: 1200,
          platformFee: 210,
          netFarmerPayout: 12590,
          payoutStatus: 'HELD_IN_ESCROW',
        },
        createdAt: new Date(),
      },
    ];
  }

  async find() {
    return [...this.orders];
  }

  async findById(id) {
    return this.orders.find((o) => o._id === id || o.orderId === id) || null;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const idx = this.orders.findIndex((o) => o._id === id || o.orderId === id);
    if (idx === -1) return null;

    const current = this.orders[idx];
    const updated = {
      ...current,
      ...update,
      statusHistory: update.status && update.status !== current.status
        ? [
            ...(current.statusHistory || []),
            {
              status: update.status,
              timestamp: new Date(),
              note: update.note || `Transitioned to ${update.status}`,
            },
          ]
        : (current.statusHistory || []),
      updatedAt: new Date(),
    };

    this.orders[idx] = updated;
    return updated;
  }

  async create(data) {
    const orderId = 'KD-' + Math.floor(100000 + Math.random() * 900000);
    const initialStatus = data.status || 'ORDER_CREATED';
    const newOrder = {
      _id: 'ord_' + Date.now(),
      orderId,
      ...data,
      status: initialStatus,
      statusHistory: [
        {
          status: initialStatus,
          timestamp: new Date(),
          note: 'Initial order placement',
        },
      ],
      createdAt: new Date(),
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }
}

export const memoryOrderStore = new MemoryOrderStore();

