import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI SDK on the server with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json());

// API: Deconstruct Anxious Thought using Gemini 3.5-Flash
app.post("/api/deconstruct", async (req, res) => {
  try {
    const { enemyThought, anxiousThought, evidenceFor, evidenceAgainst } = req.body;
    const thoughtToAnalyze = anxiousThought || enemyThought;

    if (!thoughtToAnalyze) {
      return res.status(400).json({ error: "Anxious thought is required" });
    }

    const prompt = `
      Anxious Thought: "${thoughtToAnalyze}"
      Evidence Claimed For: [${(evidenceFor || []).map((e: string) => `"${e}"`).join(", ")}]
      Evidence Claimed Against: [${(evidenceAgainst || []).map((e: string) => `"${e}"`).join(", ")}]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `
          You are the Mindsync Cognitive Reframing Engine, an evidence-based cognitive behavioral therapy helper that helps users examine anxiety and find calm, balanced perspectives.
          Analyze the user's anxious thought, the evidence they claim supports it, and the evidence against it.
          
          You must identify the cognitive distortions present (e.g., Catastrophizing, All-or-Nothing Thinking, Emotional Reasoning, Fortune Telling, Mind Reading, Overgeneralization, Labeling).
          Provide a brief, 2-sentence kind and objective analysis of why the thought is a distortion rather than an absolute truth.
          Construct a realistic, highly grounding, and balanced counter-thought. The counter-thought should not be toxic positivity; it must be a calm, realistic, and compassionate statement of facts that encourages breathing and reclaiming control.
          
          Return your response strictly in JSON format as defined by the responseSchema.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            distortions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Cognitive distortions found in the anxious thought.",
            },
            analysis: {
              type: Type.STRING,
              description: "A concise, compassionate, and objective breakdown explaining why the thought is distorted.",
            },
            counterThought: {
              type: Type.STRING,
              description: "A balanced, empowering, and realistic counter-thought based on evidence against.",
            },
          },
          required: ["distortions", "analysis", "counterThought"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response received from Gemini.");
    }

    const parsedResult = JSON.parse(resultText.trim());
    res.json(parsedResult);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Failed to deconstruct thought. Please verify your connection and try again.",
      details: error.message,
    });
  }
});

// Serve Frontend depending on Environment
async function setupFrontend() {
  if (process.env.NODE_ENV !== "production") {
    // Dynamically import Vite server in development
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupFrontend().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mindsync Command Center Server active on http://0.0.0.0:${PORT}`);
  });
});
