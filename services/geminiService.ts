
import { GoogleGenAI } from "@google/genai";
import { PredictionResult } from "../types";

export const generateMedicalExplanation = async (
  prediction: PredictionResult, 
  confidence: number,
  base64Image?: string
): Promise<string> => {
  // Fix: Initialize GoogleGenAI using process.env.API_KEY directly as required.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Acting as a Senior Radiologist, provide a brief medical-style report for a chest X-ray.
    The AI model has detected: ${prediction} with ${confidence}% confidence.
    
    If PNEUMONIA: Mention common radiographic signs like opacities, consolidation, or pleural effusion patterns.
    If NORMAL: Mention clear lung fields, normal heart size, and clear costophrenic angles.
    
    Structure the response as:
    1. Clinical Findings
    2. Radiographic Impression
    3. Suggested Next Steps
    
    Keep it professional, clinical, and concise. Disclaimer: This is an AI-assisted simulation.
  `;

  try {
    const contents = base64Image 
      ? { parts: [{ inlineData: { mimeType: 'image/png', data: base64Image } }, { text: prompt }] }
      : prompt;

    // Fix: Use 'gemini-3-pro-preview' for complex medical/STEM reasoning tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        temperature: 0.2,
      }
    });

    // Fix: Use .text property directly (not as a method) as per documentation.
    return response.text || "Report generation failed. Please consult a professional.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI clinical explanation. Please check your connectivity.";
  }
};
