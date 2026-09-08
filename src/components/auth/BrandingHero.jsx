import React from 'react';
import {
  Check,
  Cpu,
  Truck,
  TrendingUp,
  ShieldCheck,
  Users,
  Sparkles,
} from 'lucide-react';
import { AgriLeafIcon, AgriSproutIcon, AgriWheatIcon } from '../common/AgriPattern';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';

export const BrandingHero = () => {
  const { t } = useLanguage();

  return (
    <div className="relative h-full w-full min-h-[600px] lg:min-h-full flex flex-col justify-between p-8 sm:p-12 lg:p-14 overflow-hidden bg-slate-950 text-white select-none">
      {/* High-quality Agricultural Background Image with Multi-layer Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80"
          alt="Lush green agricultural farm fields in India"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.78] contrast-[1.08] transition-transform duration-10000 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-emerald-950/80 to-emerald-900/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
        <div className="absolute inset-0 bg-agri-grid opacity-30" />
      </div>

      {/* Floating ambient glowing orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Branding Bar */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-emerald-300/30">
              <AgriSproutIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                  Kisan<span className="text-emerald-400">Direct</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  {t('agriTechBadge')}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 font-medium">
                {t('gridSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle variant="dark" />
            <div className="hidden sm:flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">{t('mandiLive')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Hero Content */}
      <div className="relative z-10 my-auto py-8">
        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-200 text-xs font-semibold mb-5">
          <AgriLeafIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t('heroTaglineBadge')}</span>
          <span className="text-white/40">•</span>
          <span className="text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {t('zeroMiddlemenBadge')}
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.2] mb-4">
          {t('heroHeadline1')} <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
            {t('heroHeadline2')}
          </span>
        </h2>

        {/* Supporting Narrative */}
        <p className="text-base sm:text-lg text-emerald-100/90 max-w-xl leading-relaxed font-normal mb-8">
          {t('heroNarrative')}
        </p>

        {/* 3 Explicit Small Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl">
          {/* Benefit 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 transition-all group">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                {t('benefit1Title')}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal pl-8">
              {t('benefit1Desc')}
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 transition-all group">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                {t('benefit2Title')}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal pl-8">
              {t('benefit2Desc')}
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 transition-all group">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                {t('benefit3Title')}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal pl-8">
              {t('benefit3Desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Floating Stats & Live Activity Banner */}
      <div className="relative z-10 pt-4 border-t border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-lg font-extrabold text-white tracking-tight">12,400+</p>
              <p className="text-[11px] text-emerald-300/80 uppercase font-semibold">{t('statFarmers')}</p>
            </div>
            <div className="h-7 w-px bg-white/15" />
            <div>
              <p className="text-lg font-extrabold text-white tracking-tight">480+</p>
              <p className="text-[11px] text-emerald-300/80 uppercase font-semibold">{t('statBuyers')}</p>
            </div>
            <div className="h-7 w-px bg-white/15 hidden sm:block" />
            <div className="hidden sm:block">
              <p className="text-lg font-extrabold text-white tracking-tight">{t('statMiddlemanFee')}</p>
              <p className="text-[11px] text-emerald-300/80 uppercase font-semibold">{t('statPayouts')}</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-emerald-200/90 bg-emerald-950/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-500/30">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('statFleet')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
