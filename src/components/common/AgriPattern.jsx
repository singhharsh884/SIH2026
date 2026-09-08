import React from 'react';

/**
 * Subtle agricultural SVGs and background decorations
 */
export const AgriLeafIcon = ({ className = 'w-5 h-5 text-emerald-600' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export const AgriSproutIcon = ({ className = 'w-5 h-5 text-emerald-600' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
  </svg>
);

export const AgriWheatIcon = ({ className = 'w-5 h-5 text-amber-500' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 22 16 8" />
    <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" />
    <path d="M11.47 17.47 13 16l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 24l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
  </svg>
);

export const AgriFarmIllustration = ({ className = '' }) => (
  <svg
    viewBox="0 0 400 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full ${className}`}
  >
    {/* Rolling terraced farm hills */}
    <path
      d="M0 100 Q 100 70, 200 85 T 400 65 L 400 120 L 0 120 Z"
      fill="currentColor"
      className="text-emerald-900/40"
    />
    <path
      d="M0 110 Q 120 85, 260 95 T 400 90 L 400 120 L 0 120 Z"
      fill="currentColor"
      className="text-emerald-800/60"
    />
    {/* Sun rays & contour grooves */}
    <path
      d="M30 96 Q 110 76, 210 90"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      className="text-emerald-400/30"
    />
    <path
      d="M50 108 Q 150 90, 280 102"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      className="text-emerald-300/30"
    />
  </svg>
);
