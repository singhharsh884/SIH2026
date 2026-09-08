import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { getPasswordStrength } from '../../utils/validation';

/**
 * Reusable password input with show/hide toggle and optional strength meter
 */
export const PasswordInput = ({
  id = 'password',
  name = 'password',
  label = 'Password',
  value,
  onChange,
  placeholder = 'Enter your password',
  error,
  required = false,
  autoComplete = 'current-password',
  disabled = false,
  showStrengthMeter = false,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const strength = showStrengthMeter ? getPasswordStrength(value) : null;

  return (
    <div className={`w-full text-left ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5"
        >
          {label} {required && <span className="text-emerald-700 font-bold">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Lock className="h-5 w-5 transition-colors" />
        </div>

        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`
            w-full rounded-xl border bg-white py-3 pl-11 pr-11 text-sm text-slate-900 transition-all duration-200
            placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0
            ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200/70 bg-rose-50/20'
                : 'border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-emerald-500/20'
            }
            ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-75' : ''}
          `}
        />

        <button
          type="button"
          onClick={toggleVisibility}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
          title={showPassword ? 'Hide password' : 'Show password'}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4.5 w-4.5 text-slate-600" />
          ) : (
            <Eye className="h-4.5 w-4.5 text-slate-400" />
          )}
        </button>
      </div>

      {showStrengthMeter && value && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-500">Password strength:</span>
            <span className="font-semibold text-slate-700">{strength.label}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-1.5">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-full rounded-full transition-all duration-300 ${
                  strength.score >= step ? strength.color : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};
