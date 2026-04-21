'use client';

/**
 * Result Page - Display AI Detection Results
 *
 * Shows comprehensive analysis including:
 * - Overall AI probability with visual gauge
 * - Per-model detection probabilities
 * - Sentence-level highlighting
 * - PDF download option
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import ProbabilityChart from '@/components/ProbabilityChart';
import ModelAnalysis from '@/components/ModelAnalysis';
import HighlightedText from '@/components/HighlightedText';
import DownloadReport from '@/components/DownloadReport';
import { DetectionResult } from '@/lib/types';

export default function ResultPage() {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [originalText, setOriginalText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Retrieve stored detection result
    const storedResult = sessionStorage.getItem('detectionResult');
    const storedText = sessionStorage.getItem('originalText');

    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }

    if (storedText) {
      setOriginalText(storedText);
    }

    setLoading(false);

    // If no result, redirect to home
    if (!storedResult) {
      router.push('/');
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4"
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
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const aiSentenceCount = result.sentences.filter(s => s.isAI).length;
  const humanSentenceCount = result.sentences.length - aiSentenceCount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="py-6 px-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">AI Content Detector</h1>
          </Link>

          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            New Detection
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Detection Results</h2>
          <p className="text-gray-600 mt-1">Analysis complete - here are the findings</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Overall AI Probability"
            value={`${result.overallProbability}%`}
            color={result.isAI ? 'text-red-600' : 'text-green-600'}
          />
          <StatCard
            label="Verdict"
            value={result.isAI ? 'AI-Generated' : 'Human-Written'}
            color={result.isAI ? 'text-red-600' : 'text-green-600'}
          />
          <StatCard
            label="AI Sentences"
            value={String(aiSentenceCount)}
            color="text-red-600"
          />
          <StatCard
            label="Human Sentences"
            value={String(humanSentenceCount)}
            color="text-green-600"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Result Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ResultCard result={result} />

              {/* Download Button */}
              <div className="mt-6">
                <DownloadReport result={result} originalText={originalText} />
              </div>

              {/* Share Section */}
              <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Share Results
                </h4>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                    Copy Link
                  </button>
                  <button className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium text-white transition-colors">
                    Twitter
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Analysis Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Model Analysis Chart */}
            <ProbabilityChart models={result.models} />

            {/* Model Analysis Details */}
            <ModelAnalysis models={result.models} />

            {/* Highlighted Text Analysis */}
            <HighlightedText sentences={result.sentences} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>AI Content Detector - Detect AI-Generated Text</p>
          <p className="mt-1">Powered by advanced detection algorithms</p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
