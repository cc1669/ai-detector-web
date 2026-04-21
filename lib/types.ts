// TypeScript interfaces for AI Content Detector

export interface Sentence {
  text: string;
  isAI: boolean;
  probability: number;
}

export interface ModelProbabilities {
  gpt3: number;
  gpt4: number;
  claude: number;
  gemini: number;
}

export interface DetectionResult {
  overallProbability: number;
  isAI: boolean;
  sentences: Sentence[];
  models: ModelProbabilities;
}

export interface DetectionResponse {
  success: boolean;
  data?: DetectionResult;
  error?: string;
}

export interface UploadedFile {
  name: string;
  content: string;
  type: string;
}
