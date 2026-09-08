import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { AgriLeafIcon } from '../common/AgriPattern';
import { useLanguage } from '../../context/LanguageContext';

export const TrustFooter = () => {
  const { t } = useLanguage();

  return (
    <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col items-center justify-center gap-1.5 text-center">
      <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-200/80">
        <Lock className="w-3.5 h-3.5 text-emerald-700" />
        <span>{t('trustProtected')}</span>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 ml-0.5" />
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
        <span className="flex items-center gap-1">
          <AgriLeafIcon className="w-3 h-3 text-emerald-600/70" />
          {t('empoweringAgri')}
        </span>
        <span>•</span>
        <span>{t('sslEncrypted')}</span>
      </div>
    </div>
  );
};
