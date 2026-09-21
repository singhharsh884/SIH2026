import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './server/src/config/db.js';
import { CropModel } from './server/src/models/Crop.js';
import { OrderModel } from './server/src/models/Order.js';

async function seed() {
  await connectDB();

  // 1. Seed Lucknow Crops
  const existingCrop = await CropModel.findOne({ location: { $regex: 'Lucknow', $options: 'i' } });
  if (!existingCrop) {
    await CropModel.insertMany([
      {
        cropName: 'Awadh Organic Baby Spinach (पालक)',
        category: 'Vegetables',
        quantity: '1.2 Tons',
        price: '₹34 / kg',
        mandi: '₹24 / kg',
        status: 'Active • Ready for Dispatch',
        harvestDate: 'Fresh Morning Harvest',
        farmerName: 'Ramprasad Maurya',
        farmName: 'Awadh Krishi FPO (Malihabad)',
        farmerMobile: '+91 94151 88721',
        location: 'Gram Kasmandi Kalan, Malihabad, Lucknow, UP',
      },
      {
        cropName: 'Desi Tender Bhindi / Okra (भिंडी)',
        category: 'Vegetables',
        quantity: '950 kg',
        price: '₹36 / kg',
        mandi: '₹26 / kg',
        status: 'Active • Ready for Dispatch',
        harvestDate: 'Harvested Today',
        farmerName: 'Dinesh Chandra Verma',
        farmName: 'Gomti Kisan Vikas FPO (Mohanlalganj)',
        farmerMobile: '+91 98390 44512',
        location: 'Kisan Path Junction, Mohanlalganj, Lucknow, UP',
      },
      {
        cropName: 'Polyhouse Fresh Vine Tomatoes',
        category: 'Vegetables',
        quantity: '1.5 Tons',
        price: '₹32 / kg',
        mandi: '₹24 / kg',
        status: 'Active • Ready for Dispatch',
        harvestDate: 'Ready for Dispatch',
        farmerName: 'Satyendra Pratap Singh',
        farmName: 'BKT Agri Cooperative FPO',
        farmerMobile: '+91 94500 77631',
        location: 'Sitapur Road Highway Cluster, Bakshi Ka Talab, Lucknow, UP',
      },
    ]);
    console.log('✅ Seeded Lucknow crops into MongoDB Atlas!');
  } else {
    console.log('ℹ️ Lucknow crops already exist in MongoDB Atlas.');
  }

  // 2. Seed Lucknow Sample Order
  const existingOrder = await OrderModel.findOne({ orderId: 'KD-LKO-2026-9901' });
  if (!existingOrder) {
    await OrderModel.create({
      orderId: 'KD-LKO-2026-9901',
      orderType: 'bulk',
      customerName: 'Awadh Fresh Supermarket & Cloud Kitchen',
      customerMobile: '+91 94150 78901',
      items: [
        {
          productId: 'crop_lucknow_1',
          name: 'Awadh Organic Baby Spinach (पालक)',
          farm: 'Awadh Krishi FPO (Malihabad)',
          price: 30,
          quantity: 600,
          unit: 'kg',
        },
        {
          productId: 'crop_lucknow_2',
          name: 'Desi Tender Bhindi / Okra (भिंडी)',
          farm: 'Gomti Kisan Vikas FPO (Mohanlalganj)',
          price: 35,
          quantity: 400,
          unit: 'kg',
        },
      ],
      totalAmount: 32000,
      deliveryAddress: 'Shop No. 14, Rohtas Presidential Arcade, Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010',
      deliverySlot: 'Tomorrow 06:30 AM Direct Farm Harvest Delivery',
      paymentMethod: 'UPI / KisanPay Direct',
      status: 'IN_TRANSIT',
      statusHistory: [
        { status: 'ORDER_CREATED', timestamp: new Date(), note: 'Wholesale order placed for Gomti Nagar, Lucknow' },
        { status: 'PAYMENT_CONFIRMED', timestamp: new Date(), note: '₹32,000 locked in KisanDirect Escrow' },
        { status: 'IN_TRANSIT', timestamp: new Date(), note: 'Loaded on UP-32-LN-5026 Reefer moving along Shaheed Path' },
      ],
      weighingReconciliation: {
        farmerDeclaredKg: 1000,
        farmgateWeighedKg: 996,
        hubWeighedKg: 990,
        buyerReceivedKg: 988,
        shrinkageVarianceKg: 12,
        shrinkagePercent: 1.2,
        status: 'WITHIN_TOLERANCE',
      },
      payout: {
        grossBuyerAmount: 32000,
        logisticsDeduction: 2720,
        platformFee: 480,
        netFarmerPayout: 28800,
        payoutStatus: 'HELD_IN_ESCROW',
      },
    });
    console.log('✅ Seeded Lucknow sample order into MongoDB Atlas!');
  } else {
    console.log('ℹ️ Lucknow order already in MongoDB Atlas.');
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error('Error seeding Lucknow data:', err);
  process.exit(1);
});
