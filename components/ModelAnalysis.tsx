'use client';

/**
 * ModelAnalysis Component
 *
 * Displays detailed probability breakdown by model
 * Shows horizontal progress bars for each AI model
 */

import React from 'react';
import { ModelProbabilities } from '@/lib/types';

interface ModelAnalysisProps {
  models: ModelProbabilities;
}

interface ModelInfo {
  key: keyof ModelProbabilities;
  name: string;
  color: string;
  description: string;
}

const modelInfo: ModelInfo[] = [
  {
    key: 'gpt3',
    name: 'GPT-3',
    color: 'bg-blue-500',
    description: 'OpenAI GPT-3 detection',
  },
  {
    key: 'gpt4',
    name: 'GPT-4',
    color: 'bg-purple-500',
    description: 'OpenAI GPT-4 detection',
  },
  {
    key: 'claude',
    name: 'Claude',
    color: 'bg-amber-500',
    description: 'Anthropic Claude detection',
  },
  {
    key: 'gemini',
    name: 'Gemini',
    color: 'bg-emerald-500',
    description: 'Google Gemini detection',
  },
];

export default function ModelAnalysis({ models }: ModelAnalysisProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Model Analysis
      </h3>

      <div className="space-y-4">
        {modelInfo.map((model) => {
          const probability = Math.round(models[model.key]);
          const isHighProbability = probability > 50;

          return (
            <div key={model.key} className="space-y-2">
              {/* Model Name and Percentage */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${model.color}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {model.name}
                  </span>
                </div>
                <span
                  className={`text-sm font-bold ${
                    isHighProbability ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {probability}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    model.color
                  }`}
                  style={{ width: `${probability}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Each model analyzes text patterns typical of its training data
        </p>
      </div>
    </div>
  );
}
