/**
 * Produce Image & Category Helper
 * Provides high-quality images and vegetable classifications for KisanDirect
 */

// Image map for produce varieties
const PRODUCE_IMAGE_MAP = [
  {
    keywords: ['spinach', 'palak', 'paalak', 'baby greens', 'leafy'],
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['methi', 'fenugreek'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['bhindi', 'okra', 'lady finger', 'ladyfinger'],
    image: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['coriander', 'dhaniya', 'cilantro', 'kothmir'],
    image: 'https://images.unsplash.com/photo-1526346698789-22fd84314424?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['capsicum', 'shimla mirch', 'bell pepper', 'green pepper'],
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['cucumber', 'kheera', 'kakdi'],
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['cabbage', 'patta gobhi', 'band gobhi'],
    image: 'https://images.unsplash.com/photo-1551893478-d726eaf0442c?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['cauliflower', 'phool gobhi', 'gobhi'],
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['peas', 'matar', 'green peas'],
    image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['bean', 'beans', 'french bean', 'cluster beans', 'gawar'],
    image: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['gourd', 'lauki', 'doodhi', 'karela', 'bitter gourd', 'tinda', 'turai', 'sponge gourd'],
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['chili', 'chilli', 'mirch', 'green chili', 'hari mirch'],
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['carrot', 'gajar'],
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['tomato', 'tamatar'],
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['onion', 'pyaaz', 'pyaz', 'kanda'],
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['potato', 'aloo', 'batata'],
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['mango', 'aam', 'alphonso', 'kesar', 'hapus'],
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['wheat', 'gehu', 'sharbati', 'grain'],
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
  },
];

/**
 * Returns a suitable produce photograph matching the given crop name and category.
 */
export const getProduceImage = (name = '', category = '') => {
  const n = (name || '').toLowerCase();

  for (const item of PRODUCE_IMAGE_MAP) {
    if (item.keywords.some((kw) => n.includes(kw))) {
      return item.image;
    }
  }

  if (category === 'Vegetables' || n.includes('green') || n.includes('veg') || n.includes('sabzi')) {
    return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
  }

  if (category === 'Fruits' || n.includes('fruit')) {
    return 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80';
  }

  return 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80';
};

/**
 * Checks if the crop is specifically a green vegetable.
 */
export const isGreenVegetable = (name = '', category = '') => {
  const n = (name || '').toLowerCase();
  const greenKeywords = [
    'spinach',
    'palak',
    'paalak',
    'methi',
    'fenugreek',
    'coriander',
    'dhaniya',
    'cilantro',
    'bhindi',
    'okra',
    'lady finger',
    'ladyfinger',
    'capsicum',
    'shimla',
    'cucumber',
    'kheera',
    'kakdi',
    'cabbage',
    'patta gobhi',
    'peas',
    'matar',
    'bean',
    'beans',
    'gourd',
    'lauki',
    'karela',
    'turai',
    'tinda',
    'chili',
    'mirch',
    'green',
    'leafy',
    'lettuce',
    'broccoli',
    'mint',
    'pudina',
    'saag',
    'sarson',
    'hari',
  ];

  return greenKeywords.some((kw) => n.includes(kw)) || (category === 'Vegetables' && (n.includes('green') || n.includes('fresh')));
};

/**
 * Converts a raw crop from the Farmer Dashboard / DB into a Consumer Marketplace item.
 */
export const formatProduceForMarketplace = (crop, isHindi = false) => {
  const cropName = crop.cropName || crop.crop || crop.name || 'Fresh Produce';
  const isGreen = isGreenVegetable(cropName, crop.category);

  // Extract numeric price
  const priceStr = crop.price ? crop.price.toString() : '35';
  const numericPrice = parseFloat(priceStr.replace(/[^\d.]/g, '')) || 35;

  // Compute realistic retail supermarket price (approx 35-45% higher with middleman cut)
  const mrpNum = Math.round(numericPrice * 1.38);
  const mrpText = isHindi ? `सुपरमार्केट में ₹${mrpNum}` : `₹${mrpNum} in Supermarkets`;

  return {
    id: crop._id || crop.id || `crop_${Math.random()}`,
    name: cropName,
    farm: crop.farmName ? `${crop.farmName}, ${crop.location || 'Nashik'}` : (crop.farm || 'Krishi Vikas FPO, Nashik'),
    harvestTime: crop.harvestDate || (isHindi ? 'खेत से ताज़ा कटाई' : 'Fresh Farm Harvest'),
    price: numericPrice,
    unit: crop.unit || '1 kg',
    mrp: mrpText,
    image: crop.image || getProduceImage(cropName, crop.category),
    tag: isGreen
      ? (isHindi ? '🌿 100% ताज़ी हरी सब्जी' : '🌿 100% Fresh Green Veg')
      : (isHindi ? '🚜 सीधा किसान से' : '🚜 Direct Farm Harvest'),
    category: crop.category || 'Vegetables',
    isGreen,
    isFarmerListing: true,
    rawQuantity: crop.quantity || crop.qty || 'Available Stock',
  };
};
