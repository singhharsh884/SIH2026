import React, { useState } from 'react';
import { X, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthInput } from '../common/AuthInput';
import { isValidIdentifier } from '../../utils/validation';
import { useLanguage } from '../../context/LanguageContext';

export const ForgotPasswordModal = ({ isOpen, onClose, initialIdentifier = '' }) => {
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your registered mobile number or email');
      return;
    }
    if (!isValidIdentifier(identifier)) {
      setError('Please enter a valid 10-digit mobile number or email address');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setIdentifier('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100">
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('resetDispatchedTitle')}</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {t('resetDispatchedDesc')} <span className="font-semibold text-slate-900">{identifier}</span>. {t('checkMessages')}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              {t('returnToLogin')}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center border border-emerald-200">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t('forgotPasswordTitle')}</h3>
                <p className="text-xs text-slate-500">{t('forgotPasswordSub')}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-5">
              {t('forgotPasswordInstruction')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AuthInput
                id="reset-identifier"
                label={t('identifierLabel')}
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t('identifierPlaceholder')}
                error={error}
                required
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t('sendOtpBtn')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
