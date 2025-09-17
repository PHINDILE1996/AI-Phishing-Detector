import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

// Declare ai client, but do not initialize it here.
let ai: GoogleGenAI | null = null;

// A function to get the initialized client, creating it on first call.
const getAiClient = (): GoogleGenAI => {
  if (ai) {
    return ai;
  }

  // Check for the API key at the moment it's needed, not on module load.
  if (!process.env.API_KEY) {
    // This error is caught and displayed in the UI, so it should be user-friendly
    // and not expose implementation details like "API_KEY".
    throw new Error("The analysis service is not configured. Please contact the administrator.");
  }
  
  // Initialize the client and store it for subsequent calls.
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai;
};


export const analyzeEmailContent = async (emailText: string): Promise<AnalysisResult> => {
  if (!emailText.trim()) {
    throw new Error("Email content cannot be empty.");
  }

  try {
    // Get the client. This will throw the configuration error if the key is missing.
    const genAI = getAiClient();
    
    const response = await genAI.models.generateContent({
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
        // If it's our custom config error, re-throw it as is.
        if (error.message.startsWith("The analysis service is not configured")) {
            throw error;
        }
        // For other errors from the API or JSON parsing, provide a generic message.
        throw new Error(`Failed to analyze email. The service may be temporarily unavailable or the input is invalid.`);
    }
    throw new Error("An unknown error occurred while analyzing the email.");
  }
};