/**
 * KisanDirect Crop Catalog Service
 * Handles listing, adding, and removing crop lots from MongoDB API
 * with local fallback support.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const LOCAL_STORAGE_KEY = 'kisandirect_crops';

const DEFAULT_CROPS = [
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
    mandi: '₹29 / kg',
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
    cropName: 'Vine Ripe Hybrid Tomatoes',
    category: 'Vegetables',
    quantity: '1.8 Tons',
    price: '₹32 / kg',
    mandi: '₹25 / kg',
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

export const cropService = {
  /**
   * Fetch all crops
   */
  async getCrops() {
    try {
      const res = await fetch(`${API_BASE_URL}/crops`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Backend crops API unavailable, using local cache:', err.message);
    }

    // Fallback
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_CROPS));
    return DEFAULT_CROPS;
  },

  /**
   * Add a new crop lot
   */
  async addCrop(cropData) {
    try {
      const res = await fetch(`${API_BASE_URL}/crops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cropData),
      });

      if (res.ok) {
        const json = await res.json();
        // Update local cache as well
        const current = await this.getCrops();
        const updated = [json.data, ...current.filter((c) => c._id !== json.data._id)];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('kisandirect_crops_updated', { detail: json.data }));
        }
        return json.data;
      }
    } catch (err) {
      console.warn('Using client-side crop creation fallback:', err.message);
    }

    // Client fallback
    const newCrop = {
      _id: 'crop_local_' + Date.now(),
      ...cropData,
      price: cropData.price.includes('₹') ? cropData.price : `₹${cropData.price} / kg`,
      mandi: cropData.mandi ? (cropData.mandi.includes('₹') ? cropData.mandi : `₹${cropData.mandi} / kg`) : '₹22 / kg',
      status: 'Active • Ready for Dispatch',
      createdAt: new Date().toISOString(),
    };

    const current = await this.getCrops();
    const updated = [newCrop, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kisandirect_crops_updated', { detail: newCrop }));
    }

    return newCrop;
  },

  /**
   * Delete a crop lot
   */
  async deleteCrop(id) {
    try {
      await fetch(`${API_BASE_URL}/crops/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Using client-side crop deletion fallback:', err.message);
    }

    const current = await this.getCrops();
    const updated = current.filter((c) => c._id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kisandirect_crops_updated', { detail: { id, deleted: true } }));
    }

    return true;
  },
};
