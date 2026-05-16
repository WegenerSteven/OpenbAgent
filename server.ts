import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Setup Multer for file uploads
const uploadPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// In-memory document "store" for RAG
const documentRegistry: any[] = [];

// Gemini Setup
let genAI: GoogleGenAI | null = null;
function getAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not found in environment");
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

app.use(express.json());

// API Routes
app.post("/api/upload", upload.single('budgetFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { county, docType } = req.body;
  const filePath = req.file.path;
  const originalName = req.file.originalname;

  // In a real RAG system, we'd use Document AI or a PDF parser here
  // then embed and store in a vector DB
  const docEntry = {
    id: Date.now().toString(),
    filename: originalName,
    county,
    docType,
    path: filePath,
    content: `[Content of ${originalName} would be extracted here using Document AI]`
  };

  documentRegistry.push(docEntry);
  
  res.json({ message: "File uploaded and indexed successfully", docId: docEntry.id });
});

app.post("/api/ask", async (req, res) => {
  const { question, countyId, docId } = req.body;

  try {
    // 1. Retrieval
    let context = "No specific document context found in the indexed registry.";
    const relevantDocs = documentRegistry.filter(d => 
      (docId && d.id === docId) || 
      (!docId && d.county === countyId)
    );
    
    if (relevantDocs.length > 0) {
      context = relevantDocs.map(d => 
        `FILE: ${d.filename}\nCONTENT: ${d.content}`
      ).join("\n\n---\n\n");
    }

    // 2. Generation (Moving logic from frontend to backend)
    const ai = getAI();
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

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: 'user', parts: [{ text: `CONTEXT:\n${context}\n\nQUESTION: ${question}` }] }
      ],
      config: {
        systemInstruction
      }
    });

    res.json({ answer: result.text || "I couldn't process that request at the moment." });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/process-gazette", async (req, res) => {
  const { rawText, countyId } = req.body;

  try {
    const ai = getAI();
    const systemInstruction = `
You are an expert budget analyst for the Kenya Gazette. 
Your task is to extract budget-related amendments from raw text of a gazette notice.

Return a JSON object with:
- summary: A plain-language summary of the budget change.
- impact: "High", "Medium", or "Low" based on the scale of reallocation or change.
- date: The date mentioned in the notice (YYYY-MM-DD format if possible, else just text).

Focus on: Supplementary budgets, reallocations, new levies, or changes in project funding.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: rawText }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{}');
    res.json(result);
  } catch (error: any) {
    console.error("Gazette Processing Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
});
