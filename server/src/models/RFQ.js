import mongoose from 'mongoose';

const RFQSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Commodity / RFQ title is required'],
      trim: true,
    },
    commodity: {
      type: String,
      required: true,
    },
    volume: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      default: 'One-Time Delivery',
    },
    targetRate: {
      type: String,
      required: true,
    },
    buyerBusinessName: {
      type: String,
      default: 'Bulk Buyer',
    },
    supplierFPO: {
      type: String,
      default: 'Matched via AI Fleet',
    },
    deliveryHub: {
      type: String,
      default: 'Central Cold Storage Hub',
    },
    coldChainRequired: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Bidding Open', 'Contract Active', 'Contract Signed', 'In Transit', 'Completed'],
      default: 'Contract Active',
    },
  },
  {
    timestamps: true,
  }
);

export const RFQModel = mongoose.model('RFQ', RFQSchema);

class MemoryRFQStore {
  constructor() {
    this.rfqs = [
      {
        _id: 'rfq_1',
        title: 'Red Onions (Nashik Medium)',
        commodity: 'Red Onions',
        volume: '10 Tons / week',
        targetRate: '₹26/kg',
        supplierFPO: 'Krishi Vikas FPO',
        deliveryHub: 'Navi Mumbai Central Hub',
        status: 'Contract Active',
        coldChainRequired: false,
      },
      {
        _id: 'rfq_2',
        title: 'Fresh English Cucumbers',
        commodity: 'English Cucumbers',
        volume: '2.5 Tons / week',
        targetRate: '₹19/kg',
        supplierFPO: 'Sahyadri Agri Clusters',
        deliveryHub: 'Pune Logistics Depot',
        status: 'In Transit',
        coldChainRequired: true,
      },
      {
        _id: 'rfq_3',
        title: 'Organic Certified Wheat Flours',
        commodity: 'Wheat Flours',
        volume: '5 Tons / month',
        targetRate: '₹41/kg',
        supplierFPO: 'Malwa Organic Producers',
        deliveryHub: 'Bhiwandi Warehouse',
        status: 'Contract Signed',
        coldChainRequired: false,
      },
    ];
  }

  async find() {
    return [...this.rfqs];
  }

  async create(data) {
    const newRFQ = {
      _id: 'rfq_' + Date.now(),
      ...data,
      createdAt: new Date(),
    };
    this.rfqs.unshift(newRFQ);
    return newRFQ;
  }

  async findByIdAndDelete(id) {
    const index = this.rfqs.findIndex((r) => r._id === id);
    if (index !== -1) {
      return this.rfqs.splice(index, 1)[0];
    }
    return null;
  }
}

export const memoryRFQStore = new MemoryRFQStore();
