import React from 'react';
import { BrandingHero } from './BrandingHero';
import { AgriLeafIcon, AgriWheatIcon, AgriSproutIcon } from '../common/AgriPattern';

export const AuthLayout = ({ children, mode = 'login' }) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8faf7] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden">
      {/* ================= LEFT SECTION: BRANDING (DESKTOP) ================= */}
      <div className="hidden lg:block lg:w-1/2 xl:w-[52%] sticky top-0 h-screen overflow-hidden">
        <BrandingHero />
      </div>

      {/* ================= MOBILE COMPACT HERO HEADER ================= */}
      <div className="lg:hidden w-full bg-slate-950 text-white relative overflow-hidden px-5 py-7 sm:py-9">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
            alt="Farms"
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-emerald-950/70 to-slate-950" />
        </div>

        {/* Mobile Header Content */}
        <div className="relative z-10 max-w-md mx-auto text-center sm:text-left">
          <div className="inline-flex items-center gap-2 mb-3 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/30">
            <AgriSproutIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white tracking-wide">
              Kisan<span className="text-emerald-400">Direct</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug mb-1.5">
            From Farm to You — <span className="text-emerald-300">Fair Prices, Fresh Produce.</span>
          </h1>

          <p className="text-xs text-emerald-100/80 line-clamp-2 mb-3">
            Connecting farmers, consumers & bulk buyers with AI-powered logistics and zero middlemen.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-emerald-200">
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
              ✓ Direct Farmer Connection
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
              ✓ Fair Pricing
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
              ✓ AI Logistics
            </span>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SECTION: AUTH CARD CONTAINER ================= */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-16 relative">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-6 right-8 opacity-40 pointer-events-none hidden md:block">
          <AgriLeafIcon className="w-16 h-16 text-emerald-300/40" />
        </div>
        <div className="absolute bottom-6 left-8 opacity-40 pointer-events-none hidden md:block">
          <AgriWheatIcon className="w-20 h-20 text-amber-300/30" />
        </div>

        {/* Centered White Card with subtle green/earth accents */}
        <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-10 shadow-soft-lg border border-emerald-900/5 relative z-10 transition-all duration-300 hover:shadow-xl">
          {/* Subtle Top Accent Ribbon */}
          <div className="absolute -top-px left-8 right-8 h-1 bg-gradient-to-r from-emerald-400 via-emerald-600 to-amber-400 rounded-t-full" />

          {/* Render Active Form (Login or Register) */}
          {children}
        </div>
      </div>
    </div>
  );
};
