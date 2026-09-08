import React, { useState } from 'react';
import { ArrowRight, Smartphone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { RoleSelector } from './RoleSelector';
import { AuthInput } from '../common/AuthInput';
import { PasswordInput } from '../common/PasswordInput';
import { SocialLogin } from './SocialLogin';
import { TrustFooter } from './TrustFooter';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { LanguageToggle } from '../common/LanguageToggle';
import { isValidIdentifier } from '../../utils/validation';
import { DEMO_CREDENTIALS } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';

export const LoginForm = ({
  role,
  onRoleChange,
  onLogin,
  onSwitchToRegister,
  onGoogleLogin,
  isLoading = false,
  apiError = '',
}) => {
  const { t } = useLanguage();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Quick helper to fill demo credentials
  const handleQuickFillDemo = (targetRole) => {
    const creds = DEMO_CREDENTIALS[targetRole || role];
    if (creds) {
      setIdentifier(creds.identifier);
      setPassword(creds.password);
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!identifier.trim()) {
      newErrors.identifier = 'Please enter your mobile number or email address';
    } else if (!isValidIdentifier(identifier)) {
      newErrors.identifier = 'Enter a valid 10-digit mobile number or standard email';
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await onLogin({
        identifier: identifier.trim(),
        password,
        role,
        rememberMe,
      });

      if (result) {
        setLoginSuccess(true);
      }
    } catch (err) {
      // Handled by parent or displayed via apiError
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto">
      {/* Header & Language Switcher */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t('welcomeBack')}</span>
            <span className="inline-block animate-bounce origin-bottom-right">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('loginSubheading')}{' '}
            <span className="font-semibold text-emerald-800">KisanDirect</span>
          </p>
        </div>

        {/* Card level Language Toggle */}
        <LanguageToggle variant="default" className="shrink-0" />
      </div>

      {/* Role Selector */}
      <div className="mb-5">
        <RoleSelector
          selectedRole={role}
          onSelectRole={(newRole) => {
            onRoleChange(newRole);
            setErrors({});
          }}
          onQuickFillDemo={handleQuickFillDemo}
        />
      </div>

      {/* Global API error notification */}
      {apiError && (
        <div
          role="alert"
          className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{apiError}</p>
            <p className="text-[11px] text-rose-600 mt-1">
              Tip: Click the <span className="font-semibold underline cursor-pointer" onClick={() => handleQuickFillDemo(role)}>{t('fillDemo')}</span> button above to test instantly.
            </p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {loginSuccess && (
        <div
          role="status"
          className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2.5"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Login successful! Redirecting to your dashboard...</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Mobile Number / Email Input */}
        <AuthInput
          id="identifier"
          name="identifier"
          label={t('identifierLabel')}
          type="text"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: '' }));
          }}
          placeholder={t('identifierPlaceholder')}
          icon={Smartphone}
          error={errors.identifier}
          autoComplete="username"
          required
        />

        {/* Password Input */}
        <div>
          <PasswordInput
            id="password"
            name="password"
            label={t('passwordLabel')}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
            }}
            placeholder={t('passwordPlaceholder')}
            error={errors.password}
            autoComplete="current-password"
            required
          />

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between mt-2.5 text-xs">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 transition-colors cursor-pointer"
              />
              <span className="font-medium">{t('rememberMe')}</span>
            </label>

            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors focus:outline-none hover:underline cursor-pointer"
            >
              {t('forgotPassword')}
            </button>
          </div>
        </div>

        {/* Primary Login Button */}
        <button
          type="submit"
          disabled={isLoading || loginSuccess}
          className="w-full relative py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/25 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>{t('authenticating')}</span>
            </span>
          ) : (
            <>
              <span>{t('loginButton')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Social Login with Google */}
      <SocialLogin onGoogleLogin={onGoogleLogin} loading={isLoading} />

      {/* Switch to Registration */}
      <div className="mt-6 text-center text-xs text-slate-600">
        <span>{t('dontHaveAccount')} </span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors focus:outline-none cursor-pointer"
        >
          {t('createAccount')}
        </button>
      </div>

      {/* Trust Message & Security Badge */}
      <TrustFooter />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialIdentifier={identifier}
      />
    </div>
  );
};
