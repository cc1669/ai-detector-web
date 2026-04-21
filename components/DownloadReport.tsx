'use client';

/**
 * DownloadReport Component
 *
 * Button to download PDF report
 * Uses client-side PDF generation
 */

'use client';

import React from 'react';
import { DetectionResult } from '@/lib/types';

interface DownloadReportProps {
  result: DetectionResult;
  originalText?: string;
}

export default function DownloadReport({ result, originalText }: DownloadReportProps) {
  const handleDownload = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const { jsPDF } = await import('jspdf');

      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();

      // Header
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Content Detector', 20, 25);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text('Analysis Report', 20, 33);
      doc.text(`Generated: ${timestamp}`, 20, 40);

      doc.setDrawColor(200);
      doc.line(20, 45, 190, 45);
      doc.setTextColor(0);

      // Overall Probability
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Probability Analysis', 20, 58);

      const probColor = result.isAI ? [220, 53, 69] : [40, 167, 69];
      doc.setFillColor(probColor[0], probColor[1], probColor[2]);
      doc.roundedRect(20, 65, 170, 25, 3, 3, 'F');

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255);
      doc.text(`Overall AI Probability: ${result.overallProbability}%`, 105, 77, { align: 'center' });

      doc.setFontSize(11);
      doc.text(result.isAI ? 'Likely AI-Generated' : 'Likely Human-Written', 105, 85, { align: 'center' });

      // Model Analysis
      doc.setTextColor(0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Model Detection Probabilities', 20, 105);

      const models = [
        { name: 'GPT-3', value: result.models.gpt3 },
        { name: 'GPT-4', value: result.models.gpt4 },
        { name: 'Claude', value: result.models.claude },
        { name: 'Gemini', value: result.models.gemini },
      ];

      let yPos = 115;
      models.forEach((model, index) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(model.name, 20, yPos);

        // Bar background
        doc.setFillColor(230, 230, 230);
        doc.roundedRect(50, yPos - 4, 120, 8, 1, 1, 'F');

        // Bar fill
        const barColor = model.value > 50 ? [220, 53, 69] : [40, 167, 69];
        doc.setFillColor(barColor[0], barColor[1], barColor[2]);
        doc.roundedRect(50, yPos - 4, model.value * 1.2, 8, 1, 1, 'F');

        doc.setTextColor(0);
        doc.text(`${Math.round(model.value)}%`, 175, yPos);
        yPos += 12;
      });

      // Text Analysis
      doc.addPage();
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Text Analysis', 20, 25);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text('Orange = Likely AI | Green = Likely Human', 20, 33);
      doc.setTextColor(0);

      yPos = 45;
      result.sentences.forEach((sentence, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        const label = sentence.isAI ? '[AI]' : '[Human]';
        const labelColor = sentence.isAI ? [220, 53, 69] : [40, 167, 69];

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
        doc.text(`${label} (${sentence.probability}%)`, 20, yPos);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0);

        const lines = doc.splitTextToSize(sentence.text, 165);
        lines.forEach((line: string, i: number) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 25, yPos + 4 + i * 4);
        });

        yPos += lines.length * 4 + 6;
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} | AI Content Detector Report`,
          105,
          290,
          { align: 'center' }
        );
      }

      // Save
      doc.save(`ai-detection-report-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="
        w-full py-3 px-6 rounded-xl font-semibold text-white
        bg-gray-800 hover:bg-gray-900 active:bg-black
        transition-all duration-200
        flex items-center justify-center gap-2
        shadow-lg hover:shadow-xl
      "
    >
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
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span>Download PDF Report</span>
    </button>
  );
}
