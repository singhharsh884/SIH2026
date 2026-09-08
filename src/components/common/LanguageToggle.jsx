import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageToggle = ({ variant = 'default', className = '' }) => {
  const { language, setLanguage } = useLanguage();

  const isDark = variant === 'dark';

  return (
    <div
      className={`inline-flex items-center gap-1 p-1 rounded-full border transition-all ${
        isDark
          ? 'bg-slate-900/80 border-emerald-500/30 text-emerald-200 shadow-sm'
          : 'bg-white border-slate-200 text-slate-700 shadow-xs'
      } ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <Languages className={`w-3.5 h-3.5 ml-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-emerald-600 text-white shadow-xs'
            : isDark
            ? 'text-slate-300 hover:text-white'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-pressed={language === 'en'}
      >
        English
      </button>

      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
          language === 'hi'
            ? 'bg-emerald-600 text-white shadow-xs'
            : isDark
            ? 'text-slate-300 hover:text-white'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-pressed={language === 'hi'}
      >
        हिंदी
      </button>
    </div>
  );
};
