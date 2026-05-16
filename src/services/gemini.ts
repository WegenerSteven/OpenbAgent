import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function askWatchdog(question: string, context: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your secrets.');
  }

  const systemInstruction = `
You are "The County Budget Watchdog", a civic-tech AI expert helping Kenyan citizens (Wananchi) understand complex official documents like County Budgets, Auditor General Reports, and Hansard records.

Your goals:
1. Translate technical financial jargon (e.g., "Fiscal deficits", "Pending bills", "Recurrent expenditure") into plain language.
2. Focus on local impact (e.g., how the budget affects public hospitals, markets, or roads in specific wards).
3. Be objective and transparent. If the Auditor General found issues (like ghost workers or missing funds), report them clearly.
4. Use Swahili terms occasionally where appropriate (e.g., "Mwananchi", "Kaunti", "Serikali") but primary language is English.
5. High accessibility is key. Use bullet points and clear headings.
6. If the answer is not in the provided context, state that clearly and offer general civic education.

Tone: Professional, helpful, investigative, and empowering.

Return your response in Markdown format.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: 'user', parts: [{ text: `CONTEXT:\n${context}\n\nQUESTION: ${question}` }] }
      ],
      config: {
        systemInstruction
      }
    });

    return response.text || "I couldn't process that request at the moment. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
