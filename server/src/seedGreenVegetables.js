import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CropModel } from './models/Crop.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kisandirect';

const cropsToSeedOrUpdate = [
  {
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
    cropName: 'Organic Fresh Methi (मेथी)',
    category: 'Vegetables',
    quantity: '400 kg',
    price: '₹30 / kg',
    mandi: '₹22 / kg',
    status: 'Active • 5 Orders',
    harvestDate: 'Fresh Harvest',
    farmerName: 'Vitthalrao Gaikwad',
    farmName: 'Sahyadri Green FPO',
    farmerMobile: '+91 98901 23456',
    location: 'Baramati, Maharashtra',
  },
  {
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

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB to sync farmer contact details...');

    for (const crop of cropsToSeedOrUpdate) {
      const existing = await CropModel.findOne({ cropName: crop.cropName });
      if (!existing) {
        await CropModel.create(crop);
        console.log(`+ Created: ${crop.cropName} (${crop.farmerName}, ${crop.farmerMobile})`);
      } else {
        await CropModel.updateOne(
          { _id: existing._id },
          {
            $set: {
              farmerName: crop.farmerName,
              farmName: crop.farmName,
              farmerMobile: crop.farmerMobile,
              location: crop.location,
            },
          }
        );
        console.log(`✓ Updated farmer contact: ${crop.cropName} -> ${crop.farmerName} (${crop.farmerMobile})`);
      }
    }

    console.log('All crop lots updated with verified farmer contacts!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
