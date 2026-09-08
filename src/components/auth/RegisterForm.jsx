import React, { useState } from 'react';
import {
  ArrowRight,
  User,
  Smartphone,
  Mail,
  MapPin,
  Building2,
  Tractor,
  Store,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { RoleSelector } from './RoleSelector';
import { AuthInput } from '../common/AuthInput';
import { PasswordInput } from '../common/PasswordInput';
import { TrustFooter } from './TrustFooter';
import { LanguageToggle } from '../common/LanguageToggle';
import { isValidEmail, isValidMobile } from '../../utils/validation';
import { useLanguage } from '../../context/LanguageContext';

const BUSINESS_TYPES = [
  'Restaurant / Hotel Chain',
  'Retail Grocery Store / Supermarket',
  'Wholesale Mandi Trader',
  'Food Processing & Packaging',
  'Institutional / Export Buyer',
];

export const RegisterForm = ({
  role,
  onRoleChange,
  onRegister,
  onSwitchToLogin,
  isLoading = false,
  apiError = '',
}) => {
  const { t } = useLanguage();

  // Shared & role-specific fields
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Farmer fields
    farmName: '',
    location: '',
    // Consumer fields
    deliveryLocation: '',
    // Bulk Buyer fields
    businessName: '',
    businessType: 'Restaurant / Hotel Chain',
  });

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errors, setErrors] = useState({});
  const [regSuccess, setRegSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Role-specific primary name
    if (role === 'buyer') {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business or company name is required';
      }
      if (!formData.contactPerson.trim()) {
        newErrors.contactPerson = 'Contact person name is required';
      }
      if (!formData.location.trim()) {
        newErrors.location = 'Operating city/state location is required';
      }
    } else {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      }
    }

    if (role === 'farmer') {
      if (!formData.farmName.trim()) {
        newErrors.farmName = 'Farm name or FPO society name is required';
      }
      if (!formData.location.trim()) {
        newErrors.location = 'Village / District / State is required';
      }
    }

    if (role === 'consumer') {
      if (!formData.deliveryLocation.trim()) {
        newErrors.deliveryLocation = 'Delivery address or pincode is required';
      }
    }

    // Common validations
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!isValidMobile(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit Indian mobile number';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the Terms & Privacy Policy to register';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        role,
      };
      const result = await onRegister(payload);
      if (result) {
        setRegSuccess(true);
      }
    } catch (err) {
      // Handled by parent or displayed via apiError
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto">
      {/* Header & Language Switcher */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('joinKisanDirect')} 🌾
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('joinSubtitle')}
          </p>
        </div>

        <LanguageToggle variant="default" className="shrink-0" />
      </div>

      {/* Role Selection for Registration */}
      <div className="mb-5">
        <RoleSelector
          selectedRole={role}
          onSelectRole={(newRole) => {
            onRoleChange(newRole);
            setErrors({});
          }}
        />
      </div>

      {/* API Error Notification */}
      {apiError && (
        <div
          role="alert"
          className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Registration Success */}
      {regSuccess && (
        <div
          role="status"
          className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2.5"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Account created successfully! Preparing your account...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* ================= FARMER / FPO FIELDS ================= */}
        {role === 'farmer' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AuthInput
                id="farmer-name"
                name="name"
                label={t('fullName')}
                value={formData.name}
                onChange={handleChange}
                placeholder={t('fullNamePlaceholder')}
                icon={User}
                error={errors.name}
                required
              />
              <AuthInput
                id="farmer-farmName"
                name="farmName"
                label={t('farmName')}
                value={formData.farmName}
                onChange={handleChange}
                placeholder={t('farmNamePlaceholder')}
                icon={Tractor}
                error={errors.farmName}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AuthInput
                id="farmer-mobile"
                name="mobile"
                label={t('mobileNumber')}
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                placeholder={t('mobilePlaceholder')}
                icon={Smartphone}
                error={errors.mobile}
                maxLength={10}
                required
              />
              <AuthInput
                id="farmer-email"
                name="email"
                label={t('emailOptional')}
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="farmer@example.com"
                icon={Mail}
                error={errors.email}
              />
            </div>

            <AuthInput
              id="farmer-location"
              name="location"
              label={t('farmLocation')}
              value={formData.location}
              onChange={handleChange}
              placeholder={t('farmLocationPlaceholder')}
              icon={MapPin}
              error={errors.location}
              required
            />
          </>
        )}

        {/* ================= CONSUMER FIELDS ================= */}
        {role === 'consumer' && (
          <>
            <AuthInput
              id="consumer-name"
              name="name"
              label={t('fullName')}
              value={formData.name}
              onChange={handleChange}
              placeholder={t('fullNamePlaceholder')}
              icon={User}
              error={errors.name}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AuthInput
                id="consumer-mobile"
                name="mobile"
                label={t('mobileNumber')}
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                placeholder={t('mobilePlaceholder')}
                icon={Smartphone}
                error={errors.mobile}
                maxLength={10}
                required
              />
              <AuthInput
                id="consumer-email"
                name="email"
                label={t('emailRequired')}
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="consumer@example.com"
                icon={Mail}
                error={errors.email}
                required
              />
            </div>

            <AuthInput
              id="consumer-deliveryLocation"
              name="deliveryLocation"
              label={t('deliveryLocation')}
              value={formData.deliveryLocation}
              onChange={handleChange}
              placeholder={t('deliveryLocationPlaceholder')}
              icon={MapPin}
              error={errors.deliveryLocation}
              required
            />
          </>
        )}

        {/* ================= BULK BUYER FIELDS ================= */}
        {role === 'buyer' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AuthInput
                id="buyer-businessName"
                name="businessName"
                label={t('businessName')}
                value={formData.businessName}
                onChange={handleChange}
                placeholder={t('businessNamePlaceholder')}
                icon={Building2}
                error={errors.businessName}
                required
              />
              <AuthInput
                id="buyer-contactPerson"
                name="contactPerson"
                label={t('contactPerson')}
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder={t('contactPersonPlaceholder')}
                icon={User}
                error={errors.contactPerson}
                required
              />
            </div>

            {/* Business Type dropdown */}
            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                {t('businessType')} <span className="text-emerald-700 font-bold">*</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Store className="h-5 w-5" />
                </div>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-8 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {BUSINESS_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AuthInput
                id="buyer-mobile"
                name="mobile"
                label={t('mobileNumber')}
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                placeholder={t('mobilePlaceholder')}
                icon={Smartphone}
                error={errors.mobile}
                maxLength={10}
                required
              />
              <AuthInput
                id="buyer-email"
                name="email"
                label={t('emailRequired')}
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="buyer@company.com"
                icon={Mail}
                error={errors.email}
                required
              />
            </div>

            <AuthInput
              id="buyer-location"
              name="location"
              label={t('operatingLocation')}
              value={formData.location}
              onChange={handleChange}
              placeholder={t('operatingLocationPlaceholder')}
              icon={MapPin}
              error={errors.location}
              required
            />
          </>
        )}

        {/* Common Password Field with Strength Meter */}
        <PasswordInput
          id="register-password"
          name="password"
          label={t('createPassword')}
          value={formData.password}
          onChange={handleChange}
          placeholder={t('createPasswordPlaceholder')}
          error={errors.password}
          showStrengthMeter={true}
          required
        />

        {/* Terms and conditions */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
            />
            <span>
              {t('agreeTermsText')}{' '}
              <a href="#terms" className="text-emerald-700 font-semibold hover:underline">
                {t('termsOfService')}
              </a>{' '}
              {t('andText')}{' '}
              <a href="#privacy" className="text-emerald-700 font-semibold hover:underline">
                {t('fairTradeCharter')}
              </a>
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.terms}</p>
          )}
        </div>

        {/* Register CTA Button */}
        <button
          type="submit"
          disabled={isLoading || regSuccess}
          className="w-full relative mt-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/25 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>{t('creatingAccount')}</span>
            </span>
          ) : (
            <>
              <span>{t('completeRegistration')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-5 text-center text-xs text-slate-600">
        <span>{t('alreadyHaveAccount')} </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors focus:outline-none cursor-pointer"
        >
          {t('signInHere')}
        </button>
      </div>

      <TrustFooter />
    </div>
  );
};
