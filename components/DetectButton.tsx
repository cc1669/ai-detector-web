'use client';

/**
 * DetectButton Component
 *
 * Primary action button to trigger AI detection
 */

import React from 'react';

interface DetectButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function DetectButton({ onClick, disabled, loading }: DetectButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full py-4 px-6 rounded-xl font-semibold text-white
        transition-all duration-200
        flex items-center justify-center gap-2
        ${disabled || loading
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40'
        }
      `}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Analyzing...</span>
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Detect AI Content</span>
        </>
      )}
    </button>
  );
}
