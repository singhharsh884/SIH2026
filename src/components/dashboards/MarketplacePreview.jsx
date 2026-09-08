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
} from 'lucide-react';
import { AgriSproutIcon } from '../common/AgriPattern';
import { CartDrawer } from './CartDrawer';
import { OrderSuccessModal } from './OrderSuccessModal';
import { LanguageToggle } from '../common/LanguageToggle';
import { orderService } from '../../services/orderService';
import { useLanguage } from '../../context/LanguageContext';

export const MarketplacePreview = ({ session, onLogout }) => {
  const { t, language } = useLanguage();

  const user = session?.user || {
    name: 'Ananya Sharma',
    location: 'Indiranagar, Bengaluru - 560038',
    badge: 'Premium Household Buyer',
  };

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Initialize cart from storage
  useEffect(() => {
    setCart(orderService.getCart());
  }, []);

  const isHindi = language === 'hi';

  const PRODUCTS = [
    {
      id: 1,
      name: isHindi ? 'हाइड्रोपोनिक पालक व हरी पत्तियां' : 'Hydroponic Spinach & Baby Greens',
      farm: isHindi ? 'पटेल ग्रीन फार्म्स, नासिक' : 'Patel Green Farms, Nashik',
      harvestTime: isHindi ? '5 घंटे पहले काटा गया' : 'Harvested 5 hrs ago',
      price: 35,
      unit: isHindi ? '250g गुच्छा' : '250g bunch',
      mrp: isHindi ? 'सुपरमार्केट में ₹55' : '₹55 in Supermarkets',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80',
      tag: isHindi ? '100% कीटनाशक मुक्त' : '100% Pesticide Free',
    },
    {
      id: 2,
      name: isHindi ? 'देसी मीठी गाजर (किसान स्पेशल)' : 'Sweet Country Carrots (Kisan Special)',
      farm: isHindi ? 'विकास सहकारी FPO, ऊटी' : 'Vikas Sahakari FPO, Ooty',
      harvestTime: isHindi ? 'सीधा खेत से' : 'Direct Farm Lot',
      price: 42,
      unit: isHindi ? '1 किग्रा' : '1 kg',
      mrp: isHindi ? 'सुपरमार्केट में ₹68' : '₹68 in Supermarkets',
      image: 'https://images.unsplash.com/photo-1741515044901-58696421d24a?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      tag: isHindi ? 'ताज़ा व मीठी' : 'Crisp & Sweet',
    },
    {
      id: 3,
      name: isHindi ? 'रत्नागिरी हापुस आम (Alphonso)' : 'Farm-Fresh Ratnagiri Alphonso Mangoes',
      farm: isHindi ? 'कोंकण मैंगो उत्पादक सहकारी' : 'Konkan Mango Growers Cooperative',
      harvestTime: isHindi ? 'GI-टैग प्रमाणित' : 'GI-Tagged Origin',
      price: 680,
      unit: isHindi ? 'दर्जन (12 नग)' : 'Dozen (12 pcs)',
      mrp: isHindi ? 'बिचौलियों के साथ ₹950' : '₹950 with middlemen',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80',
      tag: isHindi ? 'प्राकृतिक रूप से पका' : 'Naturally Ripened',
    },
    {
      id: 4,
      name: isHindi ? 'खेत के ताज़ा लाल टमाटर' : 'Vine-Ripened Salad Tomatoes',
      farm: isHindi ? 'रामेश्वर पटेल फार्म, निफाड़' : 'Rameshwar Patel Farms, Niphad',
      harvestTime: isHindi ? 'आज सुबह की कटाई' : 'Harvested Today morning',
      price: 32,
      unit: isHindi ? '1 किग्रा' : '1 kg',
      mrp: isHindi ? 'खुदरा में ₹48' : '₹48 retail',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
      tag: isHindi ? 'रसीले व ठोस' : 'Juicy & Firm',
    },
  ];

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

        {/* Products Grid with WORKING ADD TO CART */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((p) => {
            const inCart = cart.find((item) => item.id === p.id);

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-emerald-900/80 backdrop-blur-md text-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {p.tag}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3" />
                      {p.harvestTime}
                    </p>
                    <h2 className="text-sm font-bold text-slate-900 line-clamp-1">{p.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{t('farmLabel')}: {p.farm}</p>
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
    </div>
  );
};
