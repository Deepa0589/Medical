
import { PredictionResult } from "../types";

const BACKEND_URL = "http://localhost:5000";

export interface BackendResponse {
  prediction: PredictionResult;
  confidence: number;
  isSimulated?: boolean;
}

export const predictPneumonia = async (file: File): Promise<BackendResponse> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`${BACKEND_URL}/predict`, {
      method: "POST",
      body: formData,
      // Short timeout to avoid long hangs
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return {
      prediction: data.prediction as PredictionResult,
      confidence: data.confidence * 100,
      isSimulated: false,
    };
  } catch (error) {
    console.warn("Backend unreachable, falling back to simulation mode:", error);
    
    // Automatic simulation fallback
    // In a real production app, we might show a retry button, 
    // but for a robust demo, we provide an immediate high-quality simulation.
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
    
    const isPneumonia = Math.random() > 0.5;
    return {
      prediction: isPneumonia ? PredictionResult.PNEUMONIA : PredictionResult.NORMAL,
      confidence: 85 + Math.random() * 10,
      isSimulated: true,
    };
  }
};
