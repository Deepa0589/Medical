
export enum PredictionResult {
  NORMAL = 'Normal',
  PNEUMONIA = 'Pneumonia'
}

export interface AnalysisData {
  prediction: PredictionResult;
  confidence: number;
  timestamp: string;
  explanation: string;
}

export interface FileData {
  file: File;
  previewUrl: string;
}
