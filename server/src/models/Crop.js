import mongoose from 'mongoose';

const CropSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Vegetables', 'Fruits', 'Grains & Cereals', 'Pulses', 'Spices & Cash Crops'],
      default: 'Vegetables',
    },
    quantity: {
      type: String,
      required: [true, 'Harvest quantity is required'],
      trim: true,
    },
    price: {
      type: String,
      required: [true, 'Direct selling price is required'],
      trim: true,
    },
    mandi: {
      type: String,
      default: '₹22 / kg',
      trim: true,
    },
    status: {
      type: String,
      default: 'Active • Ready for Dispatch',
    },
    harvestDate: {
      type: String,
      default: 'Harvested Today',
    },
    farmName: {
      type: String,
      default: 'Patel Krishi FPO',
    },
    location: {
      type: String,
      default: 'Nashik, Maharashtra',
    },
    farmerMobile: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

CropSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export const CropModel = mongoose.model('Crop', CropSchema);

/**
 * Resilient In-Memory Crop Store
 */
class MemoryCropStore {
  constructor() {
    this.crops = [
      {
        _id: 'crop_1',
        cropName: 'Grade-A Nashik Red Onions',
        category: 'Vegetables',
        quantity: '3.5 Tons',
        price: '₹28 / kg',
        mandi: '₹23 / kg',
        status: 'Active • 12 Orders',
        harvestDate: 'Fresh Harvest',
        farmName: 'Krishi Vikas FPO',
        location: 'Nashik, Maharashtra',
      },
      {
        _id: 'crop_2',
        cropName: 'Fresh Vine Ripe Hybrid Tomatoes',
        category: 'Vegetables',
        quantity: '1.8 Tons',
        price: '₹34 / kg',
        mandi: '₹27 / kg',
        status: 'Active • 8 Orders',
        harvestDate: 'Ready for Dispatch',
        farmName: 'Krishi Vikas FPO',
        location: 'Niphad, Nashik',
      },
      {
        _id: 'crop_3',
        cropName: 'Organic Sharbati Wheat (M.P. Certified)',
        category: 'Grains & Cereals',
        quantity: '5.0 Tons',
        price: '₹46 / kg',
        mandi: '₹38 / kg',
        status: 'Reserved for Wholesale',
        harvestDate: 'Cured & Bagged',
        farmName: 'Krishi Vikas FPO',
        location: 'Malwa / Nashik Hub',
      },
    ];
  }

  async find() {
    return [...this.crops];
  }

  async create(data) {
    const newCrop = {
      _id: 'crop_' + Date.now(),
      ...data,
      createdAt: new Date(),
    };
    this.crops.unshift(newCrop);
    return newCrop;
  }

  async findByIdAndDelete(id) {
    const index = this.crops.findIndex((c) => c._id === id);
    if (index !== -1) {
      return this.crops.splice(index, 1)[0];
    }
    return null;
  }
}

export const memoryCropStore = new MemoryCropStore();
