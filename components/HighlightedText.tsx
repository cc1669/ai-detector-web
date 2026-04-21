'use client';

/**
 * HighlightedText Component
 *
 * Displays text with AI/Human highlighting
 * Each sentence is labeled with Likely AI or Likely Human
 */

import React from 'react';
import { Sentence } from '@/lib/types';

interface HighlightedTextProps {
  sentences: Sentence[];
}

export default function HighlightedText({ sentences }: HighlightedTextProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Text Analysis
      </h3>

      <div className="bg-amber-50 text-amber-700 text-xs px-3 py-2 rounded-lg mb-4 inline-flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Orange = Likely AI | Green = Likely Human</span>
      </div>

      <div className="space-y-4">
        {sentences.map((sentence, index) => (
          <div
            key={index}
            className={`
              p-4 rounded-xl border-l-4 transition-all duration-200
              ${sentence.isAI
                ? 'bg-orange-50 border-orange-400'
                : 'bg-green-50 border-green-400'
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* Label Badge */}
              <span
                className={`
                  px-2 py-1 rounded text-xs font-semibold whitespace-nowrap
                  ${sentence.isAI
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-green-100 text-green-700'
                  }
                `}
              >
                {sentence.isAI ? 'Likely AI' : 'Likely Human'}
              </span>

              {/* Probability */}
              <span className="text-xs text-gray-500">
                {sentence.probability}%
              </span>
            </div>

            {/* Sentence Text */}
            <p className="mt-2 text-gray-700 leading-relaxed">
              {sentence.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
