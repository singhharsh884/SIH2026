import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Star,
  Plus,
  Minus,
  CheckCircle,
  Heart,
  Sparkles,
  Layers,
  Sprout,
  Filter,
  Phone,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';
import { AgriSproutIcon } from '../common/AgriPattern';
import { CartDrawer } from './CartDrawer';
import { OrderSuccessModal } from './OrderSuccessModal';
import { FarmerContactModal } from './FarmerContactModal';
import { LanguageToggle } from '../common/LanguageToggle';
import { orderService } from '../../services/orderService';
import { cropService } from '../../services/cropService';
import { useLanguage } from '../../context/LanguageContext';
import { formatProduceForMarketplace, isGreenVegetable, getProduceImage } from '../../utils/produceHelper';

export const MarketplacePreview = ({ session, onLogout }) => {
  const { t, language } = useLanguage();

  const user = session?.user || {
    name: 'Ananya Sharma',
    location: 'Indiranagar, Bengaluru - 560038',
    badge: 'Premium Household Buyer',
  };

  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'green_veg' | 'farmer_direct' | 'fruits'
  const [isLoadingCrops, setIsLoadingCrops] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  const isHindi = language === 'hi';

  // Initialize cart from storage
  useEffect(() => {
    setCart(orderService.getCart());
  }, []);

  // Load live farmer crops & produce catalog
  const loadProduce = async () => {
    try {
      const dbCrops = await cropService.getCrops();
      const formattedCrops = dbCrops.map((c) => formatProduceForMarketplace(c, isHindi));

      // Featured seasonal specialties
      const featuredItems = [
        {
          id: 'feat_mango',
          name: isHindi ? 'रत्नागिरी हापुस आम (Alphonso)' : 'Farm-Fresh Ratnagiri Alphonso Mangoes',
          farm: isHindi ? 'कोंकण मैंगो उत्पादक सहकारी, रत्नागिरी' : 'Konkan Mango Growers Cooperative, Ratnagiri',
          harvestTime: isHindi ? 'GI-टैग प्रमाणित' : 'GI-Tagged Origin',
          price: 680,
          unit: isHindi ? 'दर्जन (12 नग)' : 'Dozen (12 pcs)',
          mrp: isHindi ? 'बिचौलियों के साथ ₹950' : '₹950 with middlemen',
          image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80',
          tag: isHindi ? 'प्राकृतिक रूप से पका' : 'Naturally Ripened',
          category: 'Fruits',
          isGreen: false,
          isFarmerListing: true,
          rawQuantity: '80 Crates',
        },
        {
          id: 'feat_carrots',
          name: isHindi ? 'देसी मीठी गाजर (किसान स्पेशल)' : 'Sweet Country Carrots (Kisan Special)',
          farm: isHindi ? 'विकास सहकारी FPO, ऊटी' : 'Vikas Sahakari FPO, Ooty',
          harvestTime: isHindi ? 'सीधा खेत से' : 'Direct Farm Lot',
          price: 42,
          unit: isHindi ? '1 किग्रा' : '1 kg',
          mrp: isHindi ? 'सुपरमार्केट में ₹68' : '₹68 in Supermarkets',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEXDJb3mAZdIcSxHZA_mrwBbm6CaVPhnTBZ8LMWnNItA&s=10',
          tag: isHindi ? 'ताज़ा व मीठी' : 'Crisp & Sweet',
          category: 'Vegetables',
          isGreen: false,
          isFarmerListing: true,
          rawQuantity: '1.5 Tons',
        },
      ];

      // Merge farmer crops with featured items, ensuring green vegetables added by farmers are prioritized!
      const existingNames = new Set(formattedCrops.map((f) => f.name.toLowerCase()));
      const uniqueFeatured = featuredItems.filter((f) => !existingNames.has(f.name.toLowerCase()));

      const combined = [...formattedCrops, ...uniqueFeatured].sort((a, b) => {
        // Prioritize green vegetables at the top
        if (a.isGreen && !b.isGreen) return -1;
        if (!a.isGreen && b.isGreen) return 1;
        return 0;
      });

      setProducts(combined);
      setIsLoadingCrops(false);
    } catch (err) {
      console.error('Failed to load produce:', err);
      setIsLoadingCrops(false);
    }
  };

  useEffect(() => {
    loadProduce();

    const handleUpdate = () => {
      loadProduce();
    };

    window.addEventListener('kisandirect_crops_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kisandirect_crops_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [language]);

  // Filtered produce items
  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'green_veg') {
      return p.isGreen || isGreenVegetable(p.name, p.category);
    }
    if (activeFilter === 'farmer_direct') {
      return p.isFarmerListing;
    }
    if (activeFilter === 'fruits') {
      return p.category === 'Fruits' || p.category === 'Grains & Cereals';
    }
    return true; // 'all'
  });

  const greenVegCount = products.filter((p) => p.isGreen || isGreenVegetable(p.name, p.category)).length;

  // Cart operations
  const handleAddToCart = (product) => {
    const updated = orderService.addToCart(product);
    setCart([...updated]);
    setToastMessage(`"${product.name}" ${t('addedToCartAlert')}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleUpdateQuantity = (productId, delta) => {
    const updated = orderService.updateQuantity(productId, delta);
    setCart([...updated]);
  };

  const handleRemoveItem = (productId) => {
    const updated = orderService.removeFromCart(productId);
    setCart([...updated]);
  };

  const handleOrderPlaced = (order) => {
    setCart([]);
    setIsCartOpen(false);
    setCompletedOrder(order);
  };

  const totals = orderService.getCartTotals();

  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-800">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-emerald-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold">{t('liveRoute')}:</span>
          <code className="bg-emerald-950 px-2 py-0.5 rounded font-mono text-emerald-300">
            /marketplace
          </code>
          <span className="hidden sm:inline text-emerald-300/80">|</span>
          <span className="hidden sm:inline text-emerald-200">
            {t('activeRole')}: <strong>{t('roleConsumer')}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle variant="dark" />
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('switchUser')}</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <AgriSproutIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                Kisan<span className="text-emerald-700">Direct</span>
              </span>
              <span className="ml-2 text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {t('marketplaceBadge')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Interactive Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('cartButton')} ({totals.count})</span>
              {totals.subtotal > 0 && (
                <span className="bg-emerald-900/60 px-1.5 py-0.5 rounded-md text-[11px] font-black">
                  ₹{totals.subtotal}
                </span>
              )}
            </button>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 justify-end">
                <MapPin className="w-3 h-3 text-emerald-700" />
                {t('deliveringTo')}: {user.location || 'Bengaluru'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast alert */}
        {toastMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-700 text-white text-xs font-bold flex items-center justify-between shadow-lg shadow-emerald-800/20 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="underline hover:text-emerald-200 cursor-pointer"
            >
              {t('viewCartLink')}
            </button>
          </div>
        )}

        {/* Marketplace Banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-3 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('marketplaceHeroTag')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              {t('marketplaceHeroHeading')}
            </h1>
            <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
              {t('marketplaceHeroSub')}
            </p>
          </div>
        </div>

        {/* Live Green Vegetable & Farmer Harvest Broadcast Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white border border-emerald-700/60 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-700 shadow-sm">
              <span className="text-xl">🥬</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{t('greenVegBroadcastTitle')}</span>
                <span className="bg-emerald-500 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                  {greenVegCount} {isHindi ? 'हरी सब्जियाँ लाइव' : 'Green Veg Live'}
                </span>
              </h2>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                {t('greenVegBroadcastSub')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveFilter('green_veg')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'green_veg'
                ? 'bg-emerald-400 text-emerald-950 ring-2 ring-white'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
          >
            <span>{isHindi ? 'केवल हरी सब्जियाँ देखें' : 'View Green Veg Only'}</span>
            <span>→</span>
          </button>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: t('filterAll') || 'All Farm Produce', count: products.length },
            { id: 'green_veg', label: t('filterGreenVeg') || '🥦 Green Vegetables', count: greenVegCount },
            { id: 'farmer_direct', label: t('filterFarmerDirect') || '🚜 Direct Farmer Lots', count: products.filter((p) => p.isFarmerListing).length },
            { id: 'fruits', label: t('filterFruits') || '🍎 Fruits & Grains', count: products.filter((p) => p.category === 'Fruits' || p.category === 'Grains & Cereals').length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-800/20'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeFilter === tab.id
                    ? 'bg-emerald-900 text-emerald-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Products Grid with Dynamic Farmer Crops & Green Vegetables */}
        {isLoadingCrops ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-600">
              {isHindi ? 'खेतों से ताज़ा हरी सब्जियाँ लोड हो रही हैं...' : 'Loading fresh farm harvests...'}
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sprout className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              {t('noProductsInCategory')}
            </h3>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="mt-3 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-emerald-700"
            >
              {isHindi ? 'सभी फसलें देखें' : 'View All Produce'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const inCart = cart.find((item) => item.id === p.id);

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between relative"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Green Veg / Farmer Tag */}
                      <span
                        className={`absolute top-2.5 left-2.5 backdrop-blur-md text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs ${
                          p.isGreen
                            ? 'bg-emerald-800/90 text-emerald-100 border border-emerald-500/30'
                            : 'bg-slate-900/80 text-emerald-200 border border-slate-700/50'
                        }`}
                      >
                        {p.tag}
                      </span>

                      {/* Live Stock Badge */}
                      {p.rawQuantity && (
                        <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                          {p.rawQuantity}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {p.harvestTime}
                        </p>

                        {/* Direct Farmer Contact Pill */}
                        <button
                          type="button"
                          onClick={() => setSelectedFarmer(p)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-900 hover:text-emerald-950 bg-emerald-100/90 hover:bg-emerald-200 px-2 py-0.5 rounded-full transition-all border border-emerald-300/60 cursor-pointer"
                          title={t('contactFarmerBtn')}
                        >
                          <Phone className="w-2.5 h-2.5 text-emerald-700" />
                          <span>{p.farmerMobile ? p.farmerMobile.replace('+91 ', '') : 'Call'}</span>
                        </button>
                      </div>

                      <h2 className="text-sm font-bold text-slate-900 line-clamp-1">{p.name}</h2>

                      <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                        <p className="line-clamp-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-[150px]">{p.farm}</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedFarmer(p)}
                          className="text-[10px] font-bold text-emerald-700 hover:underline shrink-0 ml-1 cursor-pointer"
                        >
                          {p.farmerName ? p.farmerName.split(' ')[0] : 'Farmer'} 📞
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-base font-black text-slate-900">
                        ₹{p.price}{' '}
                        <span className="text-xs font-normal text-slate-500">/ {p.unit}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 line-through">{p.mrp}</p>
                    </div>

                    {/* Interactive Quantity / Add to Cart Button */}
                    {inCart ? (
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(p.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white text-emerald-800 flex items-center justify-center shadow-xs hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-emerald-950 min-w-4 text-center">
                          {inCart.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(p.id, 1)}
                          className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(p)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer transform hover:scale-105"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {t('addToCartBtn')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOrderPlaced={handleOrderPlaced}
        userDeliveryAddress={user.location}
        userName={user.name}
      />

      {/* Order Success Receipt Modal */}
      <OrderSuccessModal
        isOpen={!!completedOrder}
        onClose={() => setCompletedOrder(null)}
        order={completedOrder}
      />

      {/* Farmer Direct Contact & Phone Profile Modal */}
      <FarmerContactModal
        isOpen={!!selectedFarmer}
        onClose={() => setSelectedFarmer(null)}
        farmer={selectedFarmer}
      />
    </div>
  );
};
