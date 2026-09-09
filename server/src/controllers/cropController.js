import { CropModel, memoryCropStore } from '../models/Crop.js';
import { isConnectedToMongo } from '../config/db.js';

/**
 * @desc    Get all active crops listed by farmers
 * @route   GET /api/crops
 * @access  Public
 */
export const getCrops = async (req, res, next) => {
  try {
    let crops;
    if (isConnectedToMongo) {
      crops = await CropModel.find().sort({ createdAt: -1 });
      // If DB has no crops, seed them once
      if (crops.length === 0) {
        const seedData = await memoryCropStore.find();
        crops = await CropModel.insertMany(
          seedData.map((s) => ({
            cropName: s.cropName,
            category: s.category,
            quantity: s.quantity,
            price: s.price,
            mandi: s.mandi,
            status: s.status,
            harvestDate: s.harvestDate,
            farmName: s.farmName,
            location: s.location,
          }))
        );
      }
    } else {
      crops = await memoryCropStore.find();
    }

    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new crop lot to the marketplace
 * @route   POST /api/crops
 * @access  Public
 */
export const addCrop = async (req, res, next) => {
  try {
    const {
      cropName,
      category,
      quantity,
      price,
      mandi,
      status,
      harvestDate,
      farmerName,
      farmName,
      location,
      farmerMobile,
    } = req.body;

    if (!cropName || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide crop name, available quantity, and expected price.',
      });
    }

    const formatPrice = (val, defaultVal = '₹20 / kg') => {
      if (!val) return defaultVal;
      const numMatch = String(val).match(/[\d.]+/);
      const num = numMatch ? numMatch[0] : '20';
      return `₹${num} / kg`;
    };

    const cropData = {
      cropName: cropName.trim(),
      category: category || 'Vegetables',
      quantity: quantity.trim(),
      price: formatPrice(price, '₹35 / kg'),
      mandi: formatPrice(mandi, '₹22 / kg'),
      status: status || 'Active • Ready for Dispatch',
      harvestDate: harvestDate || 'Ready for Dispatch',
      farmerName: farmerName ? farmerName.trim() : (farmName ? farmName.split(' ')[0] + ' Farmer' : 'Rameshwar Patel'),
      farmName: farmName || 'Krishi Vikas FPO',
      location: location || 'Nashik, Maharashtra',
      farmerMobile: farmerMobile ? farmerMobile.trim() : '+91 98231 45678',
    };

    let createdCrop;
    if (isConnectedToMongo) {
      createdCrop = await CropModel.create(cropData);
    } else {
      createdCrop = await memoryCropStore.create(cropData);
    }

    res.status(201).json({
      success: true,
      message: 'Crop lot added successfully to the marketplace!',
      data: createdCrop,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a crop lot
 * @route   DELETE /api/crops/:id
 * @access  Public
 */
export const deleteCrop = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      await CropModel.findByIdAndDelete(id);
    } else {
      await memoryCropStore.findByIdAndDelete(id);
    }

    res.status(200).json({
      success: true,
      message: 'Crop lot removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
