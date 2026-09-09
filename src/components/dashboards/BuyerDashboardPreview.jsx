import React, { useState, useEffect } from 'react';
import {
  Building2,
  Truck,
  TrendingDown,
  FileText,
  Cpu,
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  Thermometer,
  MapPin,
  Plus,
  Trash2,
  ShoppingBag,
  Sparkles,
  Phone,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import { AgriSproutIcon } from '../common/AgriPattern';
import { CreateRFQModal } from './CreateRFQModal';
import { FarmerContactModal } from './FarmerContactModal';
import { LanguageToggle } from '../common/LanguageToggle';
import { useLanguage } from '../../context/LanguageContext';
import { orderService } from '../../services/orderService';
import { cropService } from '../../services/cropService';

export const BuyerDashboardPreview = ({ session, onLogout }) => {
  const { t, language } = useLanguage();

  const user = session?.user || {
    name: 'Rajiv Mehra',
    businessName: 'TastyGreens Restaurant Chain & Retail',
    location: 'Mumbai Central, Maharashtra',
    badge: 'Bulk Institutional Buyer (5+ Tons/week)',
  };

  const [rfqs, setRfqs] = useState([]);
  const [availableCrops, setAvailableCrops] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const loadCrops = () => {
    cropService.getCrops().then((crops) => setAvailableCrops(crops));
  };

  // Fetch RFQs and Farm Lots on mount and subscribe to updates
  useEffect(() => {
    orderService.getRFQs().then((data) => setRfqs(data));
    loadCrops();

    const handleUpdate = () => {
      loadCrops();
    };

    window.addEventListener('kisandirect_crops_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kisandirect_crops_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleCreateRFQ = async (rfqData) => {
    const created = await orderService.createRFQ(rfqData);
    setRfqs((prev) => [created, ...prev]);
    setNotification(`${t('publishRFQBtn')}: "${rfqData.commodity}"!`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteRFQ = async (id, title) => {
    await orderService.deleteRFQ(id);
    setRfqs((prev) => prev.filter((r) => r._id !== id));
    setNotification(`${t('removeRFQ')}: "${title}".`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleProcureCropLot = async (crop) => {
    const newContract = {
      title: `${crop.cropName || crop.crop} (Direct Farm Lot)`,
      commodity: crop.cropName || crop.crop,
      volume: crop.quantity || crop.qty || '1 Lot',
      frequency: 'Immediate Spot Dispatch',
      targetRate: crop.price,
      buyerBusinessName: user.businessName || 'TastyGreens Chain',
      supplierFPO: crop.farmName || 'Patel Krishi FPO',
      deliveryHub: user.location || 'Central Warehouse',
      coldChainRequired: true,
      status: 'In Transit',
    };

    const created = await orderService.createRFQ(newContract);
    setRfqs((prev) => [created, ...prev]);
    setNotification(`${t('procureLot')}: ${crop.cropName || crop.crop}!`);
    setTimeout(() => setNotification(''), 4500);
  };

  return (
    <div className="min-h-screen bg-[#f7f9f7] text-slate-800">
      {/* Top Banner indicating mock redirect */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold">{t('liveRoute')}:</span>
          <code className="bg-slate-950 px-2 py-0.5 rounded font-mono text-emerald-300">
            /buyer/dashboard
          </code>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-emerald-300">
            {t('activeRole')}: <strong>{t('b2bBuyerTitle')}</strong>
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
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md">
              <AgriSproutIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                Kisan<span className="text-emerald-700">Direct</span>
              </span>
              <span className="ml-2 text-xs font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full">
                {t('buyerPortalBadge')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsRFQModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{t('newWholesaleRFQBtn')}</span>
            </button>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 justify-end">
                <Building2 className="w-3 h-3 text-emerald-700" />
                {user.businessName || 'Procurement Hub'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 text-slate-800 font-bold flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification Toast */}
        {notification && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-900 text-white text-sm font-semibold flex items-center justify-between shadow-lg animate-fadeIn border border-emerald-500/30">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification('')}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-emerald-400/30">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{user.badge || 'Verified B2B Buyer'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              {t('buyerGreeting')}, {user.name} ({user.businessName || 'TastyGreens Chain'})
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              {t('buyerBannerDesc')}
            </p>
          </div>
        </div>

        {/* AI Cold Chain Status Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-emerald-950">
                {t('coldChainShipmentTitle')}
              </h2>
              <p className="text-xs text-emerald-800/90 mt-0.5">
                {t('coldChainShipmentSub')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-emerald-900 bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-sm">
            <span className="flex items-center gap-1">
              <Thermometer className="w-4 h-4 text-emerald-600" /> {t('optimalText')}
            </span>
            <span>•</span>
            <span className="text-emerald-700">{t('etaText')}</span>
          </div>
        </div>

        {/* Bulk KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('procuredMonthLabel')}</p>
            <p className="text-2xl font-black text-slate-900 mt-2">18.4 {t('tonsCount')}</p>
            <p className="text-xs text-emerald-700 mt-1 font-semibold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> {t('savingsVsTrad')}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('activeContractsLabel')}</p>
            <p className="text-2xl font-black text-emerald-800 mt-2">{rfqs.length} {t('contractsCount')}</p>
            <p className="text-xs text-slate-500 mt-1">{t('directFromClusters')}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('gstComplianceLabel')}</p>
            <p className="text-2xl font-black text-slate-900 mt-2">100%</p>
            <p className="text-xs text-slate-500 mt-1">{t('autoTaxBills')}</p>
          </div>
        </div>

        {/* Direct Farm Lots Available for Instant Procurement */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>{t('directFarmLotsHeading')}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {t('liveFarmStock')} ({availableCrops.length} {t('lotsCount') || 'Lots'})
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('availableLotsSub')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableCrops.map((crop) => {
              const farmerPhone = crop.farmerMobile || '+91 98231 45678';
              const farmerName = crop.farmerName || 'Rameshwar Patel';
              const cleanDigits = farmerPhone.replace(/[^\d]/g, '');
              const cropTitle = crop.cropName || crop.crop || 'Produce Lot';
              const waText = language === 'hi'
                ? `नमस्ते ${farmerName} जी! मैं किसानडायरेक्ट (KisanDirect) से आपके थोक लॉट "${cropTitle}" (${crop.quantity || crop.qty}) की खरीद के लिए संपर्क कर रहा हूँ।`
                : `Namaste ${farmerName} ji! Inquiring via KisanDirect about your wholesale crop lot "${cropTitle}" (${crop.quantity || crop.qty}).`;

              return (
                <div
                  key={crop._id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-emerald-300 transition-all flex flex-col justify-between shadow-xs hover:shadow-md group"
                >
                  <div>
                    {/* Farmer Identity & Farm Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100/90 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[130px]">{farmerName}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[140px]">
                        {crop.farmName || 'Patel Green Farms'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                      {cropTitle}
                    </h3>

                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      <p className="flex items-center justify-between">
                        <span>{t('availableLabel')}:</span>
                        <strong className="text-slate-900">{crop.quantity || crop.qty}</strong>
                      </p>
                      <p className="flex items-center justify-between">
                        <span>{t('locationLabel')}:</span>
                        <span className="text-slate-700 font-medium truncate max-w-[160px]">{crop.location || 'Nashik Cluster'}</span>
                      </p>
                    </div>

                    {/* Direct Farmer Contact & Calling Box */}
                    <div className="my-3.5 p-3 rounded-xl bg-white border border-emerald-200/90 shadow-xs">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-950 font-mono">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{farmerPhone}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFarmer(crop)}
                          className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
                        >
                          {t('contactFarmerBtn')} →
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                        {/* Direct Phone Call Button */}
                        <a
                          href={`tel:${farmerPhone.replace(/\s+/g, '')}`}
                          className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
                          title={`Call ${farmerName}`}
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>{t('callNowBtn') || 'Call'}</span>
                        </a>

                        {/* Direct WhatsApp Button */}
                        <a
                          href={`https://wa.me/${cleanDigits}?text=${encodeURIComponent(waText)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
                          title={`WhatsApp ${farmerName}`}
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>{t('whatsappBtn') || 'WhatsApp'}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-emerald-800">{crop.price}</span>
                      <p className="text-[10px] text-slate-400">{t('mandiRate')}: {crop.mandi}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleProcureCropLot(crop)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:scale-105 cursor-pointer flex items-center gap-1"
                    >
                      <span>{t('procureLot')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Direct Farmer & FPO Network Directory */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg mb-8 border border-emerald-700/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-emerald-400/30">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{t('directContactNotice')}</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">
                {t('farmerDirectoryHeading')}
              </h2>
              <p className="text-xs text-emerald-200/90 mt-1 max-w-2xl">
                {t('farmerDirectorySub')}
              </p>
            </div>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(
              new Map(
                availableCrops.map((c) => [
                  c.farmerName || 'Rameshwar Patel',
                  {
                    farmerName: c.farmerName || 'Rameshwar Patel',
                    farmName: c.farmName || 'Krishi Vikas FPO',
                    farmerMobile: c.farmerMobile || '+91 98231 45678',
                    location: c.location || 'Nashik, Maharashtra',
                    sampleCrop: c.cropName || c.crop,
                    cropData: c,
                  },
                ])
              ).values()
            ).map((farmer) => {
              const cleanDigits = farmer.farmerMobile.replace(/[^\d]/g, '');
              const waText = language === 'hi'
                ? `नमस्ते ${farmer.farmerName} जी! मैं किसानडायरेक्ट पर एक थोक खरीदार हूँ और आपके फार्म से सीधी आपूर्ति के संबंध में बात करना चाहता हूँ।`
                : `Namaste ${farmer.farmerName} ji! I am a verified bulk buyer on KisanDirect inquiring about direct farm produce contracts.`;

              return (
                <div
                  key={farmer.farmerName}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-emerald-950 font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                        {farmer.farmerName.charAt(0)}
                      </div>
                      <div className="truncate">
                        <h3 className="text-sm font-bold text-white truncate">
                          {farmer.farmerName}
                        </h3>
                        <p className="text-[11px] text-emerald-300 font-semibold truncate">
                          {farmer.farmName}
                        </p>
                        <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                          <span>{farmer.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs mb-3">
                      <div className="flex items-center justify-between font-mono font-bold text-emerald-200 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>{farmer.farmerMobile}</span>
                        </span>
                        <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded">
                          {language === 'hi' ? 'सत्यापित' : 'Verified'}
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-200/80 line-clamp-1">
                        🌾 {farmer.sampleCrop}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                    <a
                      href={`tel:${farmer.farmerMobile.replace(/\s+/g, '')}`}
                      className="inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{t('callNowBtn') || 'Call'}</span>
                    </a>
                    <a
                      href={`https://wa.me/${cleanDigits}?text=${encodeURIComponent(waText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{t('whatsappBtn') || 'WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Wholesale RFQs & Forward Contracts Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">{t('activeWholesaleRFQs')}</h2>
              <p className="text-xs text-slate-500">{t('wholesaleSub')}</p>
            </div>

            {/* WORKING CREATE RFQ BUTTON */}
            <button
              type="button"
              onClick={() => setIsRFQModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{t('createRFQBtn')}</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {rfqs.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">{t('noRFQsText')}</p>
            ) : (
              rfqs.map((rfq) => (
                <div
                  key={rfq._id}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group hover:bg-slate-50/60 p-2 rounded-xl transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{rfq.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t('requirementLabel')}: <strong className="text-slate-700">{rfq.volume}</strong> • {t('supplierLabel')}: {rfq.supplierFPO}
                      {rfq.deliveryHub && <span> • {t('hubLocation')}: {rfq.deliveryHub}</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-sm font-bold text-emerald-700">{rfq.targetRate || rfq.rate}</span>
                    <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full font-medium border border-slate-200">
                      {rfq.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteRFQ(rfq._id, rfq.title)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title={t('removeRFQ')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Create RFQ Modal */}
      <CreateRFQModal
        isOpen={isRFQModalOpen}
        onClose={() => setIsRFQModalOpen(false)}
        onRFQCreated={handleCreateRFQ}
        buyerBusinessName={user.businessName}
      />

      {/* Farmer Contact & Direct Phone Profile Modal */}
      <FarmerContactModal
        isOpen={!!selectedFarmer}
        onClose={() => setSelectedFarmer(null)}
        farmer={selectedFarmer}
      />
    </div>
  );
};
