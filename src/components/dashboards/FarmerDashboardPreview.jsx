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
} from 'lucide-react';
import { AgriSproutIcon } from '../common/AgriPattern';
import { AddCropModal } from './AddCropModal';
import { LanguageToggle } from '../common/LanguageToggle';
import { cropService } from '../../services/cropService';
import { useLanguage } from '../../context/LanguageContext';

export const FarmerDashboardPreview = ({ session, onLogout }) => {
  const { t } = useLanguage();

  const user = session?.user || {
    name: 'Rameshwar Patel',
    businessName: 'Krishi Vikas Organic FPO',
    location: 'Nashik, Maharashtra',
    badge: 'Verified Organic FPO (45+ member farmers)',
  };

  const [crops, setCrops] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
    setNotification(`Successfully added "${cropData.cropName}" to your harvest catalog!`);
    setTimeout(() => {
      setNotification('');
    }, 4000);
  };

  const handleDeleteCrop = async (id, name) => {
    await cropService.deleteCrop(id);
    setCrops((prev) => prev.filter((c) => c._id !== id));
    setNotification(`Removed "${name}" from harvest catalog.`);
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#f7f9f6] text-slate-800">
      {/* Top Banner indicating route */}
      <div className="bg-emerald-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-emerald-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold">{t('liveRoute')}:</span>
          <code className="bg-emerald-950 px-2 py-0.5 rounded font-mono text-emerald-300">
            /farmer/dashboard
          </code>
          <span className="hidden sm:inline text-emerald-300/80">|</span>
          <span className="hidden sm:inline text-emerald-200">
            {t('activeRole')}: <strong>{t('roleFarmer')}</strong>
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

      {/* Main Dashboard Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md">
              <AgriSproutIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                Kisan<span className="text-emerald-700">Direct</span>
              </span>
              <span className="ml-2 text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {t('farmerPortalBadge')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1 justify-end">
                <MapPin className="w-3 h-3" />
                {user.businessName || user.location || 'Nashik Cluster'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Notification Alert */}
        {notification && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-600 text-white text-sm font-semibold flex items-center justify-between shadow-lg shadow-emerald-700/20 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification('')}
              className="text-white/80 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-3 border border-white/15">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>{user.badge || 'Verified KisanDirect Member'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              {t('farmerGreeting')}, {user.name} 👋
            </h1>
            <p className="text-emerald-100 text-sm max-w-xl">
              {t('farmerBannerP1')}{' '}
              <strong>{crops.length} {t('activeLotsText')}</strong> {t('farmerBannerP2')}
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
            <Tractor className="w-64 h-64 text-white" />
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-amber-900">
              {t('aiDemandTitle')}
            </h2>
            <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
              {t('aiDemandDesc')}
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('kpiActiveListings')}</p>
            <p className="text-2xl font-black text-emerald-800 mt-2">{crops.length} Lots</p>
            <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> {t('kpiDirectBuyers')}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('kpiDirectEarnings')}</p>
            <p className="text-2xl font-black text-slate-900 mt-2">₹1,84,500</p>
            <p className="text-xs text-slate-500 mt-1">{t('kpiBankPayout')}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('kpiMiddlemenSaved')}</p>
            <p className="text-2xl font-black text-amber-600 mt-2">₹27,675</p>
            <p className="text-xs text-amber-700 mt-1">{t('kpiZeroCommission')}</p>
          </div>
        </div>

        {/* Active Crops Grid */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">{t('catalogHeading')}</h2>
              <p className="text-xs text-slate-500">{t('catalogSubheading')}</p>
            </div>

            {/* WORKING ADD CROP BUTTON */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t('addCropBtn')}</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {crops.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Layers className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-700">{t('noCropsYet')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('noCropsHelp')}</p>
              </div>
            ) : (
              crops.map((item) => (
                <div
                  key={item._id}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group hover:bg-slate-50/60 p-2 rounded-xl transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">{item.cropName || item.crop}</p>
                      {item.category && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t('availableStock')}: <strong className="text-slate-700">{item.quantity || item.qty}</strong> | {t('mandiBenchmark')}: {item.mandi}
                      {item.location && <span> | {t('hubLocation')}: {item.location}</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
                      <span className="text-base font-extrabold text-emerald-700">{item.price}</span>
                      <p className="text-[10px] text-slate-400">{item.harvestDate || 'Fresh Farm'}</p>
                    </div>

                    <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full font-semibold border border-emerald-200 whitespace-nowrap">
                      {item.status || 'Active'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteCrop(item._id, item.cropName || item.crop)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
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

      {/* Add Crop Modal Component */}
      <AddCropModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCropAdded={handleAddCrop}
        defaultFarmerName={user.name || 'Rameshwar Patel'}
        defaultFarmerMobile={user.mobile || '+91 98231 45678'}
        defaultFarm={user.businessName || 'Krishi Vikas FPO'}
        defaultLocation={user.location || 'Nashik, Maharashtra'}
      />
    </div>
  );
};
