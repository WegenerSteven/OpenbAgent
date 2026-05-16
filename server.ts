import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";
import { createServer as createViteServer } from "vite";
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
    // Basic RAG Logic: Filter relevant context
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

    // Return the context for the frontend to use with Gemini
    res.json({ context });
  } catch (error: any) {
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
