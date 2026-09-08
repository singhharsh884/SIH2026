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
      enum: ['Harvesting at Farm', 'Quality Inspection', 'In Cold-Chain Transit', 'Delivered'],
      default: 'Harvesting at Farm',
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
    this.orders = [];
  }

  async find() {
    return [...this.orders];
  }

  async create(data) {
    const newOrder = {
      _id: 'ord_' + Date.now(),
      orderId: 'KD-' + Math.floor(100000 + Math.random() * 900000),
      ...data,
      createdAt: new Date(),
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }
}

export const memoryOrderStore = new MemoryOrderStore();
