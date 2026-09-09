import React, { useState } from 'react';
import {
  X,
  Phone,
  PhoneCall,
  MessageCircle,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Sprout,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const FarmerContactModal = ({ isOpen, onClose, farmer }) => {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !farmer) return null;

  const isHindi = language === 'hi';

  const farmerName = farmer.farmerName || 'Rameshwar Patel';
  const farmName = farmer.farmName || 'Krishi Vikas Organic FPO';
  const rawMobile = farmer.farmerMobile || '+91 98231 45678';
  const location = farmer.location || 'Nashik, Maharashtra';
  const cropName = farmer.cropName || farmer.name || 'Fresh Produce';
  const quantity = farmer.quantity || farmer.rawQuantity || 'Available Lot';
  const price = farmer.price ? (typeof farmer.price === 'number' ? `₹${farmer.price}/kg` : farmer.price) : '';

  // Clean phone number for tel: and whatsapp links
  const cleanPhoneDigits = rawMobile.replace(/[^\d]/g, '');
  const telHref = `tel:${rawMobile.replace(/\s+/g, '')}`;

  // WhatsApp inquiry message
  const waMessage = isHindi
    ? `नमस्ते ${farmerName} जी! मैं किसानडायरेक्ट (KisanDirect) पर आपके द्वारा सूचीबद्ध "${cropName}" (${quantity}${price ? ' - ' + price : ''}) को खरीदने के लिए संपर्क कर रहा हूँ। कृपया उठान समय और विवरण बताएं।`
    : `Namaste ${farmerName} ji! I am inquiring via KisanDirect about your listed harvest lot "${cropName}" (${quantity}${price ? ' - ' + price : ''}). Please share dispatch details.`;

  const waHref = `https://wa.me/${cleanPhoneDigits}?text=${encodeURIComponent(waMessage)}`;

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(rawMobile);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-slate-100 my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label={t('closeModal') || 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Avatar & Badge */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-emerald-700/20 shrink-0 border border-emerald-500/30">
            {farmerName.charAt(0)}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('verifiedProducerBadge')}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {farmerName}
            </h2>
            <p className="text-xs font-semibold text-emerald-700">
              {farmName}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{location}</span>
            </p>
          </div>
        </div>

        {/* Inquired Crop Lot Card */}
        {cropName && (
          <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('cropsHarvested')}
              </span>
              <p className="text-sm font-bold text-slate-900 line-clamp-1">
                {cropName}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {quantity} {price && <span>• <strong className="text-emerald-700">{price}</strong></span>}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Direct Contact Phone Box */}
        <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/60 border border-emerald-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('farmerMobileLabel')}</span>
            </span>
            <span className="text-[10px] font-bold bg-emerald-200/70 text-emerald-800 px-2 py-0.5 rounded-full">
              {isHindi ? 'सीधा संपर्क' : 'Direct Line'}
            </span>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-200/80 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-base sm:text-lg font-black text-slate-900 tracking-wide">
                {rawMobile}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyPhone}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              title={t('copyPhoneSuccess')}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">{isHindi ? 'कॉपी हुआ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'कॉपी' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-emerald-800/80 mt-2 leading-relaxed">
            {t('callDirectlyText')}
          </p>
        </div>

        {/* 1-Click Action Buttons: Call Now & WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* Direct Phone Call Button */}
          <a
            href={telHref}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 stroke-[2.5]" />
            <span>{t('callFarmerBtn')}</span>
          </a>

          {/* Direct WhatsApp Button */}
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md shadow-teal-800/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 stroke-[2.5]" />
            <span>{t('whatsappBtn')}</span>
          </a>
        </div>

        {/* Zero Commission / Direct Producer Notice */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-600">
          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="leading-tight">
            <strong>{t('directContactNotice')}</strong>: {isHindi ? 'सीधे किसान से बात करके बेहतर दर, वाहन व्यवस्था और गुणवत्ता सुनिश्चित करें।' : 'Negotiate spot volume rates and direct farm pickups directly with the grower.'}
          </span>
        </div>
      </div>
    </div>
  );
};
