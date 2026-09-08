/**
 * Form validation utilities for KisanDirect Auth
 */

export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const isValidMobile = (phone) => {
  if (!phone) return false;
  // Cleans spaces, dashes, +91 prefix
  const cleaned = phone.replace(/\D/g, '');
  // Matches 10 digit Indian mobile numbers (optionally prefixed by 91)
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return /^[6-9]\d{9}$/.test(cleaned.slice(2));
  }
  return /^[6-9]\d{9}$/.test(cleaned);
};

export const isValidIdentifier = (value) => {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed.includes('@')) {
    return isValidEmail(trimmed);
  }
  return isValidMobile(trimmed);
};

export const getIdentifierType = (value) => {
  if (!value) return 'empty';
  const trimmed = value.trim();
  if (trimmed.includes('@')) return 'email';
  if (/^\+?\d[\d\s-]*$/.test(trimmed)) return 'mobile';
  return 'unknown';
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Empty', color: 'bg-slate-200' };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 1:
      return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    case 2:
      return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    case 3:
      return { score: 3, label: 'Good', color: 'bg-blue-500' };
    case 4:
      return { score: 4, label: 'Strong', color: 'bg-emerald-600' };
    default:
      return { score: 0, label: 'Too short', color: 'bg-slate-300' };
  }
};
