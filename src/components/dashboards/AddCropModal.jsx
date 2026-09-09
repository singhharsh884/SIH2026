import React, { useState } from 'react';
import { X, Sprout, Plus, Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthInput } from '../common/AuthInput';
import { useLanguage } from '../../context/LanguageContext';

export const AddCropModal = ({
  isOpen,
  onClose,
  onCropAdded,
  defaultLocation = 'Nashik, Maharashtra',
  defaultFarm = 'Patel Organic FPO',
  defaultFarmerName = 'Rameshwar Patel',
  defaultFarmerMobile = '+91 98231 45678',
}) => {
  const { t } = useLanguage();

  const CATEGORIES = [
    { value: 'Vegetables', label: t('categoryVegetables') || 'Vegetables' },
    { value: 'Fruits', label: t('categoryFruits') || 'Fruits' },
    { value: 'Grains & Cereals', label: t('categoryGrains') || 'Grains & Cereals' },
    { value: 'Pulses', label: t('categoryPulses') || 'Pulses' },
    { value: 'Spices & Cash Crops', label: t('categorySpices') || 'Spices & Cash Crops' },
  ];

  const [formData, setFormData] = useState({
    cropName: '',
    category: 'Vegetables',
    quantity: '',
    unit: 'Tons',
    price: '',
    mandi: '',
    harvestDate: 'Ready for Dispatch',
    farmName: defaultFarm,
    location: defaultLocation,
    farmerName: defaultFarmerName,
    farmerMobile: defaultFarmerMobile,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // Calculate profit comparison
  const directPriceNum = parseFloat(formData.price) || 0;
  const mandiPriceNum = parseFloat(formData.mandi) || 0;
  const extraProfitPercent =
    directPriceNum > 0 && mandiPriceNum > 0
      ? (((directPriceNum - mandiPriceNum) / mandiPriceNum) * 100).toFixed(1)
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cropName.trim()) {
      setError('Please enter the crop name');
      return;
    }
    if (!formData.quantity.trim()) {
      setError('Please specify available harvest quantity');
      return;
    }
    if (!formData.price.trim()) {
      setError('Please enter your direct selling price per kg');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        cropName: formData.cropName.trim(),
        category: formData.category,
        quantity: `${formData.quantity.trim()} ${formData.unit}`,
        price: `₹${formData.price.trim()} / kg`,
        mandi: formData.mandi ? `₹${formData.mandi.trim()} / kg` : '₹22 / kg',
        status: 'Active • Ready for Dispatch',
        harvestDate: formData.harvestDate,
        farmName: formData.farmName || defaultFarm,
        location: formData.location || defaultLocation,
        farmerName: formData.farmerName || defaultFarmerName,
        farmerMobile: formData.farmerMobile || defaultFarmerMobile,
      };

      await onCropAdded(payload);
      setIsLoading(false);
      onClose();
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to publish crop lot');
    }
  };

  const QUICK_VEGETABLE_PRESETS = [
    { name: 'Fresh Hydroponic Baby Spinach (पालक)', label: '🥬 Palak / Spinach', price: '35', mandi: '26', unit: 'kg' },
    { name: 'Organic Fresh Methi (मेथी)', label: '🌿 Methi / Fenugreek', price: '30', mandi: '22', unit: 'kg' },
    { name: 'Tender Farm Okra / Bhindi (भिंडी)', label: '🟢 Bhindi / Okra', price: '38', mandi: '28', unit: 'kg' },
    { name: 'Crisp Green Capsicum (शिमला मिर्च)', label: '🫑 Green Capsicum', price: '42', mandi: '32', unit: 'kg' },
    { name: 'Farm-Fresh Country Cucumbers (खीरा)', label: '🥒 Country Cucumber', price: '28', mandi: '20', unit: 'kg' },
    { name: 'Fresh Green Coriander (धनिया)', label: '🌿 Coriander', price: '25', mandi: '18', unit: 'kg' },
    { name: 'Fresh Vine Tomatoes (टमाटर)', label: '🍅 Hybrid Tomato', price: '32', mandi: '24', unit: 'kg' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {t('addCropModalTitle')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('addCropModalSub')}
            </p>
          </div>
        </div>

        {/* Quick Green Vegetable Pick Chips */}
        <div className="mb-4 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80">
          <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>{t('quickAddVegChips')}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_VEGETABLE_PRESETS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    cropName: item.name,
                    category: 'Vegetables',
                    price: item.price,
                    mandi: item.mandi,
                    unit: item.unit,
                    quantity: prev.quantity || '500',
                  }));
                  if (error) setError('');
                }}
                className={`text-xs px-2.5 py-1 rounded-xl font-semibold border transition-all cursor-pointer ${
                  formData.cropName === item.name
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white hover:bg-emerald-100 text-slate-700 border-emerald-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Crop Name */}
          <AuthInput
            id="cropName"
            name="cropName"
            label={t('cropVarietyLabel')}
            value={formData.cropName}
            onChange={handleChange}
            placeholder="e.g. Nashik Red Onions, Alphonso Mangoes, Hybrid Tomatoes"
            required
          />

          {/* Category & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                {t('categoryLabel')} *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                {t('quantityLabel')} *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 2.5"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-slate-50 py-3 px-2 text-xs font-bold text-slate-700 focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Tons">{t('tonsCount') || 'Tons'}</option>
                  <option value="Quintals">Quintals</option>
                  <option value="kg">kg</option>
                  <option value="Crates">Crates</option>
                </select>
              </div>
            </div>
          </div>

          {/* Price & Mandi Benchmark */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                {t('directPriceLabel')} *
              </label>
              <div className="relative rounded-xl shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="34"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-8 pr-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                {t('mandiPriceLabel')}
              </label>
              <div className="relative rounded-xl shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  name="mandi"
                  value={formData.mandi}
                  onChange={handleChange}
                  placeholder="27"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-8 pr-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          {/* Profit advantage badge */}
          {extraProfitPercent && extraProfitPercent > 0 && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 font-semibold animate-fadeIn">
              <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {t('profitAdvantageNotice')} <strong className="text-emerald-700 font-bold">+{extraProfitPercent}%</strong> {t('moreDirectNotice')}
              </span>
            </div>
          )}

          {/* Harvest Readiness & Farm Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                {t('dispatchReadinessLabel')}
              </label>
              <select
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="Ready for Dispatch">{t('dispatchReadyNow')}</option>
                <option value="Harvesting in 24 hrs">{t('dispatch24h')}</option>
                <option value="Harvesting in 3 days">{t('dispatch3d')}</option>
                <option value="Standing Crop (1-2 weeks)">{t('dispatchStanding')}</option>
              </select>
            </div>

            <AuthInput
              id="location"
              name="location"
              label={t('farmLocationLabel')}
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Niphad, Nashik, MH"
            />
          </div>

          {/* Direct Farmer Contact for Buyers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AuthInput
              id="farmerName"
              name="farmerName"
              label={t('farmerNameLabel') || 'Farmer / Contact Person'}
              value={formData.farmerName}
              onChange={handleChange}
              placeholder="e.g. Rameshwar Patel"
            />

            <AuthInput
              id="farmerMobile"
              name="farmerMobile"
              label={t('farmerMobileLabel') || 'Farmer Mobile Number'}
              value={formData.farmerMobile}
              onChange={handleChange}
              placeholder="e.g. +91 98231 45678"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
            >
              {t('cancelBtn')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{t('publishCropBtn')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
