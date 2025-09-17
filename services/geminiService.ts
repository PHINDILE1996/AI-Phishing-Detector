
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeEmailContent = async (emailText: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  if (!emailText.trim()) {
    throw new Error("Email content cannot be empty.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following email content for any signs of phishing, scams, or malicious intent. Provide a detailed analysis based on the schema. Email Content: --- ${emailText} ---`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isPhishing: { type: Type.BOOLEAN, description: "True if the email is likely a phishing attempt." },
            probabilityScore: { type: Type.NUMBER, description: "A score from 0 to 100 indicating the likelihood of phishing." },
            riskLevel: { type: Type.STRING, description: "Categorical risk level: Safe, Low, Medium, High, Critical." },
            summary: { type: Type.STRING, description: "A one-sentence summary of the findings." },
            findings: {
              type: Type.ARRAY,
              description: "A list of specific red flags or indicators found in the email.",
              items: {
                type: Type.OBJECT,
                properties: {
                  indicator: { type: Type.STRING, description: "The type of phishing indicator found (e.g., 'Suspicious Link', 'Urgent Language')." },
                  details: { type: Type.STRING, description: "A detailed explanation of this specific finding." },
                  severity: { type: Type.STRING, description: "Severity of the finding: Info, Low, Medium, High." }
                },
                required: ['indicator', 'details', 'severity']
              }
            },
            extractedLinks: {
              type: Type.ARRAY,
              description: "All hyperlinks extracted from the email content.",
              items: {
                type: Type.OBJECT,
                properties: {
                  url: { type: Type.STRING, description: "The full URL." },
                  analysis: { type: Type.STRING, description: "An assessment of the link's safety." },
                  risk: { type: Type.STRING, description: "Categorical risk of the link: Safe, Suspicious, Malicious." }
                },
                required: ['url', 'analysis', 'risk']
              }
            }
          },
          required: ['isPhishing', 'probabilityScore', 'riskLevel', 'summary', 'findings', 'extractedLinks']
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing email content with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze email. Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while analyzing the email.");
  }
};
