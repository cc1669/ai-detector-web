'use client';

/**
 * Landing Page - AI Content Detector
 *
 * Main entry point with text input and file upload
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextInput from '@/components/TextInput';
import FileUpload from '@/components/FileUpload';
import DetectButton from '@/components/DetectButton';
import { DetectionResponse } from '@/lib/types';

export default function Home() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isValidInput = text.length >= 50 || (file && file.size > 0);

  const handleDetect = async () => {
    if (!isValidInput) return;

    setLoading(true);
    setError(null);

    try {
      let response: Response;

      if (file) {
        // File upload via FormData
        const formData = new FormData();
        formData.append('file', file);

        response = await fetch('/api/detect', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Text detection via JSON
        response = await fetch('/api/detect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
      }

      const result: DetectionResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Detection failed');
      }

      // Store result in sessionStorage for result page
      sessionStorage.setItem('detectionResult', JSON.stringify(result.data));
      sessionStorage.setItem('originalText', text);

      // Navigate to result page
      router.push('/result');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="py-6 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Detect AI-Generated Content
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Paste your text or upload a document to analyze whether it was likely
            written by AI or human. Get detailed insights powered by multiple
            detection models.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Text Input Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Enter Text
            </label>
            <TextInput
              value={text}
              onChange={setText}
              placeholder="Paste the content you want to analyze here. The more text you provide, the more accurate the detection will be..."
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* File Upload Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Upload Document
            </label>
            <FileUpload onFileSelect={setFile} selectedFile={file} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 text-red-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Detect Button */}
          <DetectButton
            onClick={handleDetect}
            disabled={!isValidInput}
            loading={loading}
          />

          {/* Helper Text */}
          {!isValidInput && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Please enter at least 50 characters of text or upload a file to continue
            </p>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="Multiple Models"
            description="Analyzes content using GPT-3, GPT-4, Claude, and Gemini detection models"
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="Instant Results"
            description="Get detailed analysis in seconds with sentence-level highlighting"
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="PDF Reports"
            description="Download comprehensive PDF reports with all detection details"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>AI Content Detector - Detect AI-Generated Text</p>
          <p className="mt-1">Powered by advanced detection algorithms</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
