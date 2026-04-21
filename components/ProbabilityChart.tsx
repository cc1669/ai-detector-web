'use client';

/**
 * ProbabilityChart Component
 *
 * Bar chart displaying AI probability for each model
 * Uses Recharts library
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ModelProbabilities } from '@/lib/types';

interface ProbabilityChartProps {
  models: ModelProbabilities;
}

interface ChartData {
  name: string;
  probability: number;
  fill: string;
}

export default function ProbabilityChart({ models }: ProbabilityChartProps) {
  const data: ChartData[] = [
    { name: 'GPT-3', probability: Math.round(models.gpt3), fill: '#3b82f6' },
    { name: 'GPT-4', probability: Math.round(models.gpt4), fill: '#8b5cf6' },
    { name: 'Claude', probability: Math.round(models.claude), fill: '#f59e0b' },
    { name: 'Gemini', probability: Math.round(models.gemini), fill: '#10b981' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Model Detection Probabilities
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#9ca3af"
              fontSize={12}
              width={60}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'AI Probability']}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar
              dataKey="probability"
              radius={[0, 4, 4, 0]}
              maxBarSize={40}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
