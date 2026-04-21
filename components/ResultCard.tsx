'use client';

/**
 * ResultCard Component
 *
 * Main card displaying the detection result
 * Shows overall AI probability and verdict
 */

import React from 'react';
import { DetectionResult } from '@/lib/types';

interface ResultCardProps {
  result: DetectionResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const percentage = result.overallProbability;
  const isAI = result.isAI;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 ${isAI ? 'bg-red-500' : 'bg-green-500'}`}>
        <h2 className="text-xl font-bold text-white text-center">
          {isAI ? 'Likely AI-Generated' : 'Likely Human-Written'}
        </h2>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Probability Display */}
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke={isAI ? '#ef4444' : '#22c55e'}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 3.77} 377`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-800">{percentage}%</span>
              <span className="text-sm text-gray-500">AI Probability</span>
            </div>
          </div>
        </div>

        {/* AI vs Human Bar */}
        <div className="mb-6">
          <div className="flex h-4 rounded-full overflow-hidden">
            <div
              className="bg-red-500 transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
            <div
              className="bg-green-500 transition-all duration-1000 ease-out"
              style={{ width: `${100 - percentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>AI: {percentage}%</span>
            <span>Human: {100 - percentage}%</span>
          </div>
        </div>

        {/* Sentence Count */}
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">
            Analyzed <span className="font-semibold text-gray-800">{result.sentences.length}</span> sentences
          </p>
        </div>
      </div>
    </div>
  );
}
