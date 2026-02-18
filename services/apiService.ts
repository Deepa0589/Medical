
import { PredictionResult } from "../types";

const BACKEND_URL = "http://localhost:5000";

export interface BackendResponse {
  prediction: PredictionResult;
  confidence: number;
}

export const predictPneumonia = async (file: File): Promise<BackendResponse> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`${BACKEND_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return {
      prediction: data.prediction as PredictionResult,
      confidence: data.confidence * 100, // Normalize to percentage if backend returns 0-1
    };
  } catch (error) {
    console.error("Backend connection error:", error);
    throw new Error("Could not connect to the Flask backend. Please ensure it is running on port 5000.");
  }
};
