import React from 'react';
import { ArrowLeft, Truck, ShieldCheck, Cpu } from 'lucide-react';
import { AgriSproutIcon } from '../common/AgriPattern';
import { RouteOptimizer } from './RouteOptimizer';
import { LanguageToggle } from '../common/LanguageToggle';
import { useLanguage } from '../../context/LanguageContext';

export const RouteOptimizerPreview = ({ session, onLogout, onBackToBuyer }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <div className="min-h-screen bg-[#f7f9f7] text-slate-800">
      {/* Top Banner indicating mock route */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold">{t('liveRoute')}:</span>
          <code className="bg-slate-950 px-2 py-0.5 rounded font-mono text-emerald-300">
            /logistics/routes
          </code>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-emerald-300">
            {t('activeRole')}: <strong>{t('routeOptimizerBadge')}</strong>
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

      {/* Main Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md">
              <Truck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                Kisan<span className="text-emerald-700">Direct</span>
              </span>
              <span className="ml-2 text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {t('routeOptimizerBadge')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onBackToBuyer && (
              <button
                type="button"
                onClick={onBackToBuyer}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('buyerDashboard')}</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Optimizer Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RouteOptimizer />
      </main>
    </div>
  );
};
