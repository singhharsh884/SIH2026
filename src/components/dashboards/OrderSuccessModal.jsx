import React from 'react';
import { CheckCircle2, Clock, MapPin, Truck, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import { AgriSproutIcon } from '../common/AgriPattern';
import { useLanguage } from '../../context/LanguageContext';

export const OrderSuccessModal = ({ isOpen, onClose, order }) => {
  const { t } = useLanguage();

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 text-center">
        {/* Top Success Badge */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-emerald-200">
          <AgriSproutIcon className="w-3.5 h-3.5" />
          <span>{t('orderSuccessBadge')}</span>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
          {t('orderSuccessTitle')}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          {t('orderIdLabel')}: <strong className="font-mono text-emerald-700">{order.orderId}</strong>
        </p>

        {/* Impact Callout Card */}
        <div className="bg-[#f0fdf4] rounded-2xl p-4 border border-emerald-200 text-left mb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
            <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>{t('directImpactHeading')}</span>
          </div>
          <p className="text-xs text-emerald-800/90 leading-relaxed">
            <strong>₹{order.totalAmount}</strong> {t('directImpactText')}
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs text-left space-y-2.5 mb-6">
          <div className="flex items-start justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              {t('deliverySlotReceipt')}
            </span>
            <span className="font-semibold text-slate-800 text-right">
              {order.deliverySlot}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              {t('deliveringToReceipt')}
            </span>
            <span className="font-semibold text-slate-800 text-right max-w-[200px] line-clamp-1">
              {order.deliveryAddress}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-700" />
              {t('orderStatusReceipt')}
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
              {order.status || t('statusHarvesting')}
            </span>
          </div>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{t('continueShoppingBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
