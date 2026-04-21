/**
 * AI Detection Engine
 *
 * Generates random AI probability between 30-60%
 * For demo/testing purposes
 */

import { DetectionResult, Sentence, ModelProbabilities } from './types';

// AI phrase patterns for sentence-level analysis
const AI_PHRASES = [
  'it is important to', 'it should be noted', 'in conclusion',
  'additionally', 'furthermore', 'moreover', 'nevertheless', 'nonetheless',
  'consequently', 'as a result', 'in order to', 'it is worth noting',
  'it is clear that', 'it is evident that', 'the reason is',
  'this is because', 'on the other hand', 'in other words',
  'to summarize', 'to conclude', 'first and foremost', 'secondly',
  'thirdly', 'finally', 'in summary', 'to sum up',
];

const HEDGING_PHRASES = [
  'it appears', 'it seems', 'may be', 'might be', 'could be',
  'would be', 'it is possible', 'it is likely',
];

/**
 * Heuristic sentence-level AI probability detection
 */
function analyzeSentenceHeuristic(sentence: string): number {
  let probability = 30; // Base probability
  const lowerSentence = sentence.toLowerCase();
  const wordCount = sentence.split(/\s+/).length;

  for (const phrase of AI_PHRASES) {
    if (lowerSentence.includes(phrase)) {
      probability += 5;
    }
  }

  for (const phrase of HEDGING_PHRASES) {
    if (lowerSentence.includes(phrase)) {
      probability += 3;
    }
  }

  if (wordCount >= 15 && wordCount <= 30) {
    probability += 5;
  } else if (wordCount > 30) {
    probability += 8;
  }

  return Math.min(probability, 100);
}

/**
 * Split text into sentences
 */
function getSentences(text: string): Sentence[] {
  const sentenceTexts = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  return sentenceTexts.map(sentenceText => {
    const probability = analyzeSentenceHeuristic(sentenceText);
    return {
      text: sentenceText,
      isAI: probability > 50,
      probability,
    };
  });
}

/**
 * Generate overall probability (30-60 range)
 */
function generateOverallProbability(): number {
  return Math.floor(Math.random() * 31) + 30; // 30-60
}

/**
 * Generate model probabilities based on overall score
 */
function generateModelProbabilities(overall: number): ModelProbabilities {
  const variation = 10;

  return {
    gpt3: Math.min(100, Math.max(0, overall + (Math.random() - 0.5) * variation)),
    gpt4: Math.min(100, Math.max(0, overall + (Math.random() - 0.5) * variation + 5)),
    claude: Math.min(100, Math.max(0, overall + (Math.random() - 0.5) * variation - 3)),
    gemini: Math.min(100, Math.max(0, overall + (Math.random() - 0.5) * variation + 2)),
  };
}

/**
 * Main detection function
 */
export function detectAIContent(text: string): DetectionResult {
  const sentences = getSentences(text);
  const overallProbability = generateOverallProbability();
  const models = generateModelProbabilities(overallProbability);

  return {
    overallProbability,
    isAI: overallProbability > 50,
    sentences,
    models,
  };
}
