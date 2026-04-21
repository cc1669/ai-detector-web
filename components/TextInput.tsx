'use client';

/**
 * TextInput Component
 *
 * Large textarea for user to paste text content
 */

import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextInput({ value, onChange, placeholder }: TextInputProps) {
  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Paste your text here for AI detection...'}
        className="w-full h-64 p-4 text-gray-700 bg-white border border-gray-200 rounded-xl
                   resize-none focus:outline-none focus:ring-2 focus:ring-primary-500
                   focus:border-transparent transition-all duration-200
                   placeholder:text-gray-400 text-sm leading-relaxed"
        spellCheck={false}
      />
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>{value.length} characters</span>
        <span>Minimum 50 characters</span>
      </div>
    </div>
  );
}
