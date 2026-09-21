import React, { useState } from 'react';
import { X, Check, User, Plus, ArrowRight, Shield } from 'lucide-react';

export const GoogleAuthModal = ({ isOpen, onClose, onSelectAccount, selectedRole = 'farmer' }) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authAccount, setAuthAccount] = useState(null);

  if (!isOpen) return null;

  const defaultAccounts = [
    {
      id: 'acc_1',
      name: 'Gaurav',
      email: 'gy60540@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      tag: 'Verified User Account',
    },
    {
      id: 'acc_2',
      name: 'KisanDirect Agro Partner',
      email: 'partner.krishi@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      tag: 'Verified Enterprise Workspace',
    },
  ];

  const handleAccountClick = (acc) => {
    setAuthAccount(acc);
    setIsAuthenticating(true);
    setTimeout(() => {
      onSelectAccount({
        name: acc.name,
        email: acc.email,
        role: selectedRole,
      });
      setIsAuthenticating(false);
      onClose();
    }, 650);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const name = customName.trim() || customEmail.split('@')[0];
    handleAccountClick({
      name,
      email: customEmail.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google Dialog Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Google G Logo */}
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Sign in with Google</h3>
              <p className="text-xs text-slate-500">to continue to <span className="font-semibold text-emerald-700">KisanDirect</span></p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading Overlay when authenticating */}
        {isAuthenticating && (
          <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-800">
              Verifying Google Token for {authAccount?.name}...
            </p>
            <p className="text-xs text-slate-500">Establishing encrypted OAuth 2.0 session</p>
          </div>
        )}

        {/* Accounts List */}
        <div className="p-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Choose an account
          </p>

          {defaultAccounts.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => handleAccountClick(acc)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src={acc.avatar}
                  alt={acc.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-800">
                      {acc.name}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                      Google
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{acc.email}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}

          {/* Use Another Account Toggle */}
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <Plus className="w-4 h-4" />
              </div>
              <span>Use another Google account</span>
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <p className="text-xs font-semibold text-slate-700">Enter custom Gmail account</p>
              <input
                type="text"
                placeholder="Full Name (e.g., Ramesh Kumar)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <input
                type="email"
                required
                placeholder="email@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Sign In with this Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="py-1.5 px-3 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Dialog Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Google Secure Single Sign-On</span>
          </div>
          <span>Active Role: <strong className="capitalize text-slate-700">{selectedRole}</strong></span>
        </div>
      </div>
    </div>
  );
};
