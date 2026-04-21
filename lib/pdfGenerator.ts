/**
 * PDF Report Generator
 *
 * Generates a PDF report containing:
 * - Overall AI probability
 * - Highlighted text analysis
 * - Per-model detection results
 * - Timestamp
 */

import jsPDF from 'jspdf';
import { DetectionResult, Sentence } from './types';

/**
 * Format a date for the report
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Add header to PDF
 */
function addHeader(doc: jsPDF, title: string): void {
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Content Detector', 20, 25);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('Analysis Report', 20, 33);

  doc.setDrawColor(200);
  doc.line(20, 40, 190, 40);
  doc.setTextColor(0);
}

/**
 * Add overall probability section
 */
function addProbabilitySection(doc: jsPDF, result: DetectionResult): void {
  let yPos = 55;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Probability Analysis', 20, yPos);
  yPos += 10;

  // Overall probability box
  const probColor = result.isAI ? [220, 53, 69] : [40, 167, 69]; // Red for AI, Green for Human
  doc.setFillColor(...probColor);
  doc.roundedRect(20, yPos, 170, 30, 3, 3, 'F');

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255);
  doc.text(`Overall AI Probability: ${result.overallProbability}%`, 105, yPos + 12, { align: 'center' });

  doc.setFontSize(11);
  doc.text(result.isAI ? 'Likely AI-Generated' : 'Likely Human-Written', 105, yPos + 22, { align: 'center' });

  yPos += 40;

  // AI vs Human bar
  doc.setFillColor(220, 53, 69);
  doc.roundedRect(20, yPos, result.overallProbability * 1.7, 12, 2, 2, 'F');
  doc.setFillColor(40, 167, 69);
  doc.roundedRect(20 + result.overallProbability * 1.7, yPos, (100 - result.overallProbability) * 1.7, 12, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setTextColor(255);
  doc.text(`AI: ${result.overallProbability}%`, 25 + (result.overallProbability * 0.85), yPos + 8);

  yPos += 20;
  doc.setTextColor(0);
}

/**
 * Add model analysis section
 */
function addModelSection(doc: jsPDF, result: DetectionResult): void {
  let yPos = doc.getLastBreakPoint() || 130;

  // Ensure we have enough space
  if (yPos < 130) yPos = 130;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Model Detection Probabilities', 20, yPos);
  yPos += 10;

  const models = [
    { name: 'GPT-3', value: result.models.gpt3 },
    { name: 'GPT-4', value: result.models.gpt4 },
    { name: 'Claude', value: result.models.claude },
    { name: 'Gemini', value: result.models.gemini },
  ];

  models.forEach((model, index) => {
    const barY = yPos + index * 12;

    // Model name
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(model.name, 20, barY + 8);

    // Bar background
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(50, barY + 2, 120, 8, 1, 1, 'F');

    // Bar fill
    const barColor = model.value > 50 ? [220, 53, 69] : [40, 167, 69];
    doc.setFillColor(...barColor);
    doc.roundedRect(50, barY + 2, model.value * 1.2, 8, 1, 1, 'F');

    // Percentage
    doc.setTextColor(0);
    doc.text(`${Math.round(model.value)}%`, 175, barY + 8);
  });

  return yPos + models.length * 12 + 15;
}

/**
 * Add highlighted text section
 */
function addTextSection(doc: jsPDF, sentences: Sentence[]): void {
  let yPos = 165;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Text Analysis', 20, yPos);
  yPos += 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('Orange highlight = Likely AI | Green highlight = Likely Human', 20, yPos);
  yPos += 8;
  doc.setTextColor(0);

  sentences.forEach((sentence, index) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    const label = sentence.isAI ? '[AI]' : '[Human]';
    const labelColor = sentence.isAI ? [220, 53, 69] : [40, 167, 69];

    // Label
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...labelColor);
    doc.text(`${label} (${sentence.probability}%)`, 20, yPos);

    // Sentence text
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
}

/**
 * Generate PDF report from detection results
 */
export function generatePDFReport(result: DetectionResult, originalText?: string): jsPDF {
  const doc = new jsPDF();
  const timestamp = formatDate(new Date());

  // Add header
  addHeader(doc, 'AI Content Detector');

  // Add timestamp
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128);
  doc.text(`Generated: ${timestamp}`, 20, 47);

  // Add probability section
  addProbabilitySection(doc, result);

  // Add page for model analysis
  doc.addPage();

  // Add model section
  addModelSection(doc, result);

  // Add text section (may span multiple pages)
  doc.addPage();
  addTextSection(doc, result.sentences);

  // Add footer on last page
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

  return doc;
}

/**
 * Download PDF report
 */
export function downloadPDF(result: DetectionResult, originalText?: string, filename = 'ai-detection-report.pdf'): void {
  const doc = generatePDFReport(result, originalText);
  doc.save(filename);
}
