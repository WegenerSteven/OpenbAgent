import { GoogleGenAI } from "@google/genai";
import { GazetteNotice } from "../data";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function processGazetteNotice(rawText: string, countyId: string): Promise<Partial<GazetteNotice>> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const systemInstruction = `
You are an expert budget analyst for the Kenya Gazette. 
Your task is to extract budget-related amendments from raw text of a gazette notice.

Return a JSON object with:
- summary: A plain-language summary of the budget change.
- impact: "High", "Medium", or "Low" based on the scale of reallocation or change.
- date: The date mentioned in the notice (YYYY-MM-DD format if possible, else just text).

Focus on: Supplementary budgets, reallocations, new levies, or changes in project funding.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: rawText }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      ...result,
      countyId,
      rawText
    };
  } catch (error) {
    console.error("Gazette Processing Error:", error);
    throw error;
  }
}

// Mock function to "poll" for new notices
export async function fetchRecentGazetteNotifications(): Promise<string[]> {
  // In a real app, this would hit an RSS feed or scraper
  return [
    "GAZETTE NOTICE NO. 5421: NAIROBI CITY COUNTY SUPPLEMENTARY APPROPRIATION ACT, 2024. Notice is given that the Nairobi City County Assembly has approved reallocation of KES 200M from the Emergency Fund to the Office of the Governor for 'Strategic Communication' and 'International Travel' for the remainder of the 2023/24 financial year.",
    "GAZETTE NOTICE NO. 5502: MOMBASA COUNTY FINANCE ACT AMENDMENT. The Mombasa County Executive Committee for Finance announces a temporary 5% increase in parking fees within the CBD to fund the 'Urban Greening' project starting June 1st."
  ];
}
