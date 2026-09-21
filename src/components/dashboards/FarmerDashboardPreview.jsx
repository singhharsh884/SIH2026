import React, { useState, useEffect } from 'react';
import {
  Tractor,
  TrendingUp,
  Package,
  Calendar,
  Sparkles,
  ArrowLeft,
  DollarSign,
  MapPin,
  CheckCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
  Building2,
} from 'lucide-react';
import { AgriSproutIcon } from '../common/AgriPattern';
import { AddCropModal } from './AddCropModal';
import { FpoAggregationModal } from './FpoAggregationModal';
import { LotTraceModal } from './LotTraceModal';
import { cropService } from '../../services/cropService';
import { useLanguage } from '../../context/LanguageContext';

export const FarmerDashboardPreview = ({ session, onLogout }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const user = session?.user || {
    name: 'Rameshwar Patel',
    businessName: 'Krishi Vikas Organic FPO',
    location: 'Nashik, Maharashtra',
    badge: 'Verified Organic FPO (45+ Member Farmers)',
  };

  const [crops, setCrops] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFpoModalOpen, setIsFpoModalOpen] = useState(false);
  const [activeTraceCrop, setActiveTraceCrop] = useState(null);
  const [notification, setNotification] = useState('');

  // Load crops on mount
  useEffect(() => {
    cropService.getCrops().then((data) => {
      setCrops(data);
    });
  }, []);

  const handleAddCrop = async (cropData) => {
    const created = await cropService.addCrop(cropData);
    setCrops((prev) => [created, ...prev]);
    setNotification(`Successfully registered "${cropData.cropName}" into harvest catalog!`);
    setTimeout(() => {
      setNotification('');
    }, 4000);
  };

  const handleDeleteCrop = async (id, name) => {
    await cropService.deleteCrop(id);
    setCrops((prev) => prev.filter((c) => c._id !== id));
    setNotification(`Lot "${name}" archived from active inventory.`);
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  return (
    <div className="bg-[#f8faf8] text-slate-900 pb-16">
      {/* Sub-header / Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              {user.businessName || 'Awadh Krishi FPO'}
            </span>
            <span className="text-slate-300">/</span>
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <MapPin className="w-3 h-3 text-slate-400" />
              {user.location || 'Nashik Agricultural Belt'}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded text-[11px]">
              {user.badge || 'Verified FPO (45+ Farmers)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFpoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-100 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer border border-slate-800"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHindi ? 'FPO कन्साइनमेंट एकत्रीकरण' : 'FPO Aggregation Console'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isHindi ? '+ नया लॉट जोड़ें' : '+ Register Harvest Lot'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Notification Alert */}
        {notification && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-emerald-900 text-white text-xs font-medium flex items-center justify-between shadow-sm animate-fadeIn border border-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification('')}
              className="text-white/70 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Executive FPO Overview Banner */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 mb-6 shadow-card">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {user.name}
                </h1>
                <span className="text-xs font-medium text-slate-500">
                  • {user.businessName}
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                {isHindi
                  ? `आपके क्लस्टर में ${crops.length} सक्रिय लॉट पंजीकृत हैं। कोल्ड-चेन लॉजिस्टिक्स और डायरेक्ट बायर RFQ से लिंक्ड हैं।`
                  : `Managing ${crops.length} active farmgate lots in this regional cluster. Linked with real-time temperature-controlled cold logistics and direct institutional buyer RFQs.`}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-center flex-1 md:flex-initial min-w-[130px]">
                <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  {isHindi ? 'औसत प्रीमियम' : 'Direct Spread'}
                </p>
                <p className="text-lg font-bold text-emerald-700 tabular-nums">+31.4%</p>
                <p className="text-[10px] text-slate-500">{isHindi ? 'मंडी दर से ऊपर' : 'vs APMC Mandi'}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-center flex-1 md:flex-initial min-w-[130px]">
                <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  {isHindi ? 'एस्क्रो प्रोटेक्शन' : 'Escrow Status'}
                </p>
                <p className="text-lg font-bold text-slate-900 tabular-nums">100%</p>
                <p className="text-[10px] text-emerald-600 font-medium">{isHindi ? 'सुरक्षित भुगतान' : 'Pre-Funded'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Operational KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {t('kpiActiveListings')}
              </span>
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">{crops.length} Lots</p>
            <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{isHindi ? '15 डायरेक्ट B2B ऑर्डर्स लिंक्ड' : '15 Direct Institutional Orders'}</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {t('kpiDirectEarnings')}
              </span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">₹1,84,500</p>
            <p className="text-xs text-slate-500 mt-1">
              {isHindi ? 'सीधे बैंक / UPI में 90% नेट पेआउट' : 'Direct UPI Net Payout via Escrow'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {t('kpiMiddlemenSaved')}
              </span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">₹27,675</p>
            <p className="text-xs text-emerald-700 mt-1 font-medium">
              {isHindi ? '0% आढ़तिया / बिचौलिया कमीशन' : 'Zero Middlemen Commission Retained'}
            </p>
          </div>
        </div>

        {/* AI Supply & Demand Forecast Card */}
        <div className="mb-6 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                {t('aiDemandTitle')}
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-200/60 text-emerald-900">
                PRD Sec 14
              </span>
            </div>
            <p className="text-xs text-emerald-900/90 mt-0.5 leading-relaxed">
              {t('aiDemandDesc')}
            </p>
          </div>
        </div>

        {/* Harvest Lots Table / Catalog */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {t('catalogHeading')}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi
                  ? 'रियल-टाइम डिजिटल इन्वेंट्री व तापमान-नियंत्रित लॉजिस्टिक ट्रैकिंग'
                  : 'Real-time farmgate inventory linked to cold-chain dispatch and QR origin audit'}
              </p>
            </div>

            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
              {crops.length} {isHindi ? 'सक्रिय लॉट्स' : 'Active Lots'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {crops.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Layers className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">{t('noCropsYet')}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t('noCropsHelp')}</p>
              </div>
            ) : (
              crops.map((item) => (
                <div
                  key={item._id}
                  className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {item.cropName || item.crop}
                      </p>
                      {item.category && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded border border-slate-200">
                          {item.category}
                        </span>
                      )}
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded border border-emerald-200">
                        {item.status || 'Active'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                      <span>
                        {t('availableStock')}:{' '}
                        <strong className="text-slate-800 tabular-nums">
                          {item.quantity || item.qty}
                        </strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>
                        {t('mandiBenchmark')}:{' '}
                        <span className="line-through text-slate-400 tabular-nums">{item.mandi}</span>
                      </span>
                      {item.location && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {item.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
                    <div className="text-left md:text-right">
                      <div className="text-sm font-bold text-emerald-700 tabular-nums">
                        {item.price}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-medium">
                        +34% Direct Spread
                      </span>
                    </div>

                    {/* QR Traceability Button */}
                    <button
                      type="button"
                      onClick={() => setActiveTraceCrop(item)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="View Digital QR Traceability & Provenance"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isHindi ? 'QR ट्रेस' : 'QR Audit'}</span>
                    </button>

                    {/* Delete Lot */}
                    <button
                      type="button"
                      onClick={() => handleDeleteCrop(item._id, item.cropName || item.crop)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title={t('removeCropLot')}
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

      {/* Lot QR Traceability Modal */}
      {activeTraceCrop && (
        <LotTraceModal
          cropId={activeTraceCrop._id}
          cropName={activeTraceCrop.cropName || activeTraceCrop.crop}
          onClose={() => setActiveTraceCrop(null)}
        />
      )}

      {/* Add Crop Modal Component */}
      <AddCropModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCropAdded={handleAddCrop}
        defaultFarmerName={user.name || 'Rameshwar Patel'}
        defaultFarmerMobile={user.mobile || '+91 98231 45678'}
        defaultFarm={user.businessName || 'Krishi Vikas Organic FPO'}
        defaultLocation={user.location || 'Nashik, Maharashtra'}
      />

      {/* FPO Aggregation Modal Component (PRD Section 9) */}
      <FpoAggregationModal
        isOpen={isFpoModalOpen}
        onClose={() => setIsFpoModalOpen(false)}
        onConsignmentCreated={(consignment) => {
          setNotification(`Consignment #${consignment.consignmentId} aggregated and dispatched!`);
          setTimeout(() => setNotification(''), 5000);
        }}
      />
    </div>
  );
};

