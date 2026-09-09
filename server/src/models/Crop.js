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
    farmerName: {
      type: String,
      default: 'Rameshwar Patel',
      trim: true,
    },
    farmerMobile: {
      type: String,
      default: '+91 98231 45678',
      trim: true,
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
        cropName: 'Fresh Hydroponic Baby Spinach (पालक)',
        category: 'Vegetables',
        quantity: '850 kg',
        price: '₹35 / kg',
        mandi: '₹26 / kg',
        status: 'Active • 15 Orders',
        harvestDate: 'Fresh Morning Harvest',
        farmerName: 'Rameshwar Patel',
        farmName: 'Patel Green Farms',
        farmerMobile: '+91 98231 45678',
        location: 'Nashik, Maharashtra',
      },
      {
        _id: 'crop_2',
        cropName: 'Tender Farm Okra / Bhindi (भिंडी)',
        category: 'Vegetables',
        quantity: '600 kg',
        price: '₹38 / kg',
        mandi: '₹28 / kg',
        status: 'Active • 9 Orders',
        harvestDate: 'Ready for Dispatch',
        farmerName: 'Santosh Deshmukh',
        farmName: 'Krishi Vikas Organic FPO',
        farmerMobile: '+91 94222 18901',
        location: 'Niphad, Nashik',
      },
      {
        _id: 'crop_3',
        cropName: 'Crisp Country Cucumbers (देसी खीरा)',
        category: 'Vegetables',
        quantity: '1.2 Tons',
        price: '₹28 / kg',
        mandi: '₹20 / kg',
        status: 'Active • Ready for Dispatch',
        harvestDate: 'Harvested Today',
        farmerName: 'Balasaheb Shinde',
        farmName: 'Vikas Sahakari FPO',
        farmerMobile: '+91 98210 33412',
        location: 'Nashik Cluster',
      },
      {
        _id: 'crop_4',
        cropName: 'Fresh Green Capsicum (शिमला मिर्च)',
        category: 'Vegetables',
        quantity: '500 kg',
        price: '₹44 / kg',
        mandi: '₹32 / kg',
        status: 'Active • 6 Orders',
        harvestDate: 'Ready for Dispatch',
        farmerName: 'Dr. Aniket Jadhav',
        farmName: 'Sahyadri Agri FPO',
        farmerMobile: '+91 97654 89012',
        location: 'Pune / Nashik Valley',
      },
      {
        _id: 'crop_5',
        cropName: 'Grade-A Nashik Red Onions',
        category: 'Vegetables',
        quantity: '3.5 Tons',
        price: '₹28 / kg',
        mandi: '₹23 / kg',
        status: 'Active • 12 Orders',
        harvestDate: 'Fresh Harvest',
        farmerName: 'Rameshwar Patel',
        farmName: 'Krishi Vikas FPO',
        farmerMobile: '+91 98231 45678',
        location: 'Nashik, Maharashtra',
      },
      {
        _id: 'crop_6',
        cropName: 'Fresh Vine Ripe Hybrid Tomatoes',
        category: 'Vegetables',
        quantity: '1.8 Tons',
        price: '₹34 / kg',
        mandi: '₹27 / kg',
        status: 'Active • 8 Orders',
        harvestDate: 'Ready for Dispatch',
        farmerName: 'Dinkar Khairnar',
        farmName: 'Krishi Vikas FPO',
        farmerMobile: '+91 98225 67890',
        location: 'Niphad, Nashik',
      },
      {
        _id: 'crop_7',
        cropName: 'Organic Sharbati Wheat (M.P. Certified)',
        category: 'Grains & Cereals',
        quantity: '5.0 Tons',
        price: '₹46 / kg',
        mandi: '₹38 / kg',
        status: 'Reserved for Wholesale',
        harvestDate: 'Cured & Bagged',
        farmerName: 'Mahendra Singh Chouhan',
        farmName: 'Malwa Krishi FPO',
        farmerMobile: '+91 94250 87654',
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
