import React, { useState } from 'react';
import { X, Building2, Plus, Sparkles, TrendingDown, AlertCircle, Thermometer, ShieldCheck } from 'lucide-react';
import { AuthInput } from '../common/AuthInput';
import { useLanguage } from '../../context/LanguageContext';

export const CreateRFQModal = ({ isOpen, onClose, onRFQCreated, buyerBusinessName = 'TastyGreens Chain' }) => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    title: '',
    commodity: 'Nashik Red Onions (Medium)',
    volumeAmount: '10',
    volumeUnit: 'Tons / week',
    frequency: 'Weekly Recurring Contract',
    targetRate: '26',
    deliveryHub: 'Navi Mumbai Cold Chain Hub',
    coldChainRequired: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.commodity.trim()) {
      setError('Please specify the commodity required.');
      return;
    }
    if (!formData.volumeAmount.trim()) {
      setError('Please enter volume quantity.');
      return;
    }
    if (!formData.targetRate.trim()) {
      setError('Please enter your target procurement rate.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: formData.title.trim() || `${formData.commodity} Wholesale Procurement`,
        commodity: formData.commodity.trim(),
        volume: `${formData.volumeAmount.trim()} ${formData.volumeUnit}`,
        frequency: formData.frequency,
        targetRate: `₹${formData.targetRate.trim()}/kg`,
        buyerBusinessName,
        deliveryHub: formData.deliveryHub,
        coldChainRequired: formData.coldChainRequired,
      };

      await onRFQCreated(payload);
      setIsLoading(false);
      onClose();
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to publish wholesale RFQ');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {t('createRFQModalTitle')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('createRFQModalSub')}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          {/* Commodity */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
              {t('commodityRequiredLabel')}
            </label>
            <input
              type="text"
              name="commodity"
              value={formData.commodity}
              onChange={handleChange}
              placeholder="e.g. Nashik Red Onions (45mm+), Fresh Salad Tomatoes, Sharbati Wheat"
              required
              className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
            />
          </div>

          {/* Volume & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                {t('volumeRequiredLabel')}
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                name="volumeAmount"
                value={formData.volumeAmount}
                onChange={handleChange}
                placeholder="e.g. 10"
                required
                className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                {t('supplyFrequencyLabel')}
              </label>
              <select
                name="volumeUnit"
                value={formData.volumeUnit}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-3 text-xs font-bold text-slate-700 focus:border-emerald-600 focus:outline-none"
              >
                <option value="Tons / week">Tons / week (Weekly Supply)</option>
                <option value="Tons / month">Tons / month (Monthly Supply)</option>
                <option value="Tons One-Time">Tons (Spot Consignment)</option>
                <option value="Quintals / week">Quintals / week</option>
              </select>
            </div>
          </div>

          {/* Target Procurement Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                {t('targetBuyingRateLabel')}
              </label>
              <div className="relative rounded-xl shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  name="targetRate"
                  value={formData.targetRate}
                  onChange={handleChange}
                  placeholder="26"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-8 pr-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                {t('deliveryHubLabel')}
              </label>
              <input
                type="text"
                name="deliveryHub"
                value={formData.deliveryHub}
                onChange={handleChange}
                placeholder="e.g. Navi Mumbai Hub, Bengaluru Warehouse"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Cold chain option */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">{t('coldChainTelemetryTitle')}</p>
                <p className="text-[11px] text-slate-500">{t('coldChainTelemetrySub')}</p>
              </div>
            </div>
            <input
              type="checkbox"
              name="coldChainRequired"
              checked={formData.coldChainRequired}
              onChange={handleChange}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
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
              className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{t('publishRFQBtn')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
