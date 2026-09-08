import React from 'react';
import { UserCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const RoleSelector = ({ selectedRole, onSelectRole, onQuickFillDemo }) => {
  const { t } = useLanguage();

  const ROLES = [
    {
      id: 'farmer',
      label: t('roleFarmer'),
      emoji: '👨🌾',
      subtext: t('roleFarmerSub'),
      tag: 'Direct Payout',
    },
    {
      id: 'consumer',
      label: t('roleConsumer'),
      emoji: '🛒',
      subtext: t('roleConsumerSub'),
      tag: 'Farm-Fresh',
    },
    {
      id: 'buyer',
      label: t('roleBuyer'),
      emoji: '🏢',
      subtext: t('roleBuyerSub'),
      tag: 'Wholesale Rates',
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {t('loginAs')} <span className="text-emerald-700">*</span>
        </label>
        {onQuickFillDemo && (
          <button
            type="button"
            onClick={() => onQuickFillDemo(selectedRole)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 cursor-pointer"
            title="Auto-fill credentials to test this role instantly"
          >
            <Sparkles className="w-3 h-3 text-emerald-700" />
            <span>{t('fillDemo')}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Select your role">
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectRole(role.id)}
              className={`
                group relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer
                ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-sm ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 text-slate-600'
                }
              `}
            >
              {isSelected && (
                <span className="absolute -top-1.5 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                  <UserCheck className="w-2.5 h-2.5" />
                </span>
              )}
              
              <span className="text-2xl mb-1 filter transition-transform group-hover:scale-110">
                {role.emoji}
              </span>
              
              <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                {role.label}
              </span>

              <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 hidden sm:block">
                {role.subtext}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
