import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini Client for safety and process resilience
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is missing. Please set it in your environment or Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. AI Cake Recommendation based on text prompts or preferences
app.post("/api/recommend-cake", async (req, res) => {
  try {
    const { prompt, occasion, flavorPreference, dairyFree, glutenFree } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are the master luxury cake consultant at "Frostella", a high-end cake-only boutique. 
    You suggest magnificent, bespoke custom cakes that feel like fine art. Only refer to cakes. Never mention cookies, cupcakes, pastries, bagels, donuts, pizzas, or beverages.
    Your tone is ultra-premium, elegant, dreamlike, and luxurious. Always return a detailed recommendation in JSON format.`;

    const contents = `Draft a personalized custom cake concept.
    Occasion: ${occasion || "Bespoke Celebration"}
    Flavor preferences: ${flavorPreference || "Elegant and sophisticated"}
    Diet Constraints: ${dairyFree ? "Dairy Free" : ""} ${glutenFree ? "Gluten Free" : ""}
    User ideas: ${prompt || "A masterpiece for a luxurious gathering"}

    Recommend a specialized custom cake. Include:
    - A luxury title name for the cake
    - A dreamlike visual description (frosting textures, detailing, piping, luxury embellishments)
    - Recommeded layers configuration (shapes, layer spacing)
    - Suggested flavor combination, frosting, and luxurious artisanal premium toppings
    - Why it is perfect for this specific setup
    
    Format your response STRICTLY as a JSON object matching this schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "description", "layersConfig", "flavors", "toppings", "consultantNotes"],
          properties: {
            title: { type: Type.STRING, description: "Luxurious masterpiece name" },
            description: { type: Type.STRING, description: "Dreamy visual design description (frosting, colors, lighting)" },
            layersConfig: { type: Type.STRING, description: "Suggested structural layers and shape layout" },
            flavors: { type: Type.STRING, description: "Refined custom flavor profiling" },
            toppings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Toppings list" },
            consultantNotes: { type: Type.STRING, description: "Consultant notes on why this design is perfect" }
          }
        }
      }
    });

    res.json(JSON.parse(response.text?.trim() || "{}"));
  } catch (error: any) {
    console.error("Error generating cake recommendation:", error);
    res.status(500).json({ error: error.message || "Failed to generate recommendation" });
  }
});

// 3. AI Custom Cake Review & Chef Storyteller
app.post("/api/generate-chef-review", async (req, res) => {
  try {
    const { occasion, cakeType, shape, layers, flavor, sweetness, toppings, colors } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are Chef Beatrice, the creative director and world-renowned chief cake artist at Frostella. 
    You craft descriptive masterpiece summaries, artistic tasting notes, and luxurious stories about custom luxury cake builds. 
    Your tone is highly sophisticated, sensory, poetic, and passionate about the craft of cake sculpting. Always return a JSON payload.`;

    const contents = `The customer has specified the following luxury cake:
    - Occasion Theme: ${occasion}
    - Cake Style/Type: ${cakeType}
    - Shape: ${shape}
    - Layers: ${layers}
    - Flavor Base: ${flavor}
    - Sweetness Setting: ${sweetness}
    - Custom Toppings: ${Array.isArray(toppings) ? toppings.join(", ") : "None"}
    - Color Palette: ${Array.isArray(colors) ? colors.join(", ") : "Pastel shades"}

    Generate:
    1. An elegant, romantic Masterpiece Title for this specific custom cake.
    2. A sensory "Chef's Narrative" describing the artisanal process of crafting and hand-decorating this premium cake, highlighting cream textures, detailed piping, visual highlights under studio lighting, and presentation.
    3. Sensory "Tasting Notes" exploring how the textures and sweetness values interact on the palate.
    4. A "Luxury Pairing Suggestion" (e.g. vintage tea, champagne, or organic fruit coulis matching the premium flavor).
    5. Realistic dynamic nutritional facts per serving (estimate based on ingredients - e.g. Calories, Sugar, Butter fat, protein) so it updates realistically based on options (e.g. sugar-free will have low calories, cream cake has moderate fat).

    Return strictly a JSON object.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["masterpieceTitle", "chefsNarrative", "tastingNotes", "luxuryPairing", "nutrition"],
          properties: {
            masterpieceTitle: { type: Type.STRING, description: "Bespoke artistic collection name" },
            chefsNarrative: { type: Type.STRING, description: "Artisanal narration of the baking and icing process" },
            tastingNotes: { type: Type.STRING, description: "Sensory breakdown of flavors and lightness" },
            luxuryPairing: { type: Type.STRING, description: "Sommelier/chef pairing recommendations" },
            nutrition: {
              type: Type.OBJECT,
              required: ["servingSize", "calories", "sugarGrams", "proteinGrams", "totalFatGrams"],
              properties: {
                servingSize: { type: Type.STRING, description: "e.g. 100g slice" },
                calories: { type: Type.INTEGER, description: "Caloric value per serving" },
                sugarGrams: { type: Type.INTEGER, description: "Sugar in grams" },
                proteinGrams: { type: Type.INTEGER, description: "Protein in grams" },
                totalFatGrams: { type: Type.INTEGER, description: "Fat in grams" }
              }
            }
          }
        }
      }
    });

    res.json(JSON.parse(response.text?.trim() || "{}"));
  } catch (error: any) {
    console.error("Error generating chef narrative:", error);
    res.status(500).json({ error: error.message || "Failed to generate gourmet details" });
  }
});

// 4. Real-time 8K AI Cake Image Generation
app.post("/api/generate-cake-image", async (req, res) => {
  try {
    const { occasion, cakeType, shape, layers, flavor, toppings, colors } = req.body;
    const ai = getGeminiClient();

    // Fabricate a stunning photorealistic food photography query based on selections
    const toppingsStr = Array.isArray(toppings) && toppings.length > 0 ? `lavishly topped with ${toppings.join(", ")}` : "minimalist elegant frosting";
    const colorsStr = Array.isArray(colors) && colors.length > 0 ? `with a soft pastel palette of ${colors.join(" and ")}` : "pastel soft ivory cream";
    
    // We strictly specify a luxury custom cake photography prompt
    const prompt = `A hyper-realistic 8k luxury cake. Occasion theme: ${occasion}. Cake type: ${cakeType}. Shape: ${shape}. Slicing layers: ${layers}. Base flavor: ${flavor}. Embellishments: ${toppingsStr}. Coloring: ${colorsStr}. Studio food photography style, professional bakery gallery, cinematic studio lighting with deep soft ambient shadows, ultra-detailed frosting swirls, high-contrast cream textures, elegant porcelain plate pedestal stand, pastel elegant boutique look, food styling masterpiece.`;

    console.log("Generating Imagen-4 cake render with prompt:", prompt);

    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: "1:1",
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("No image was returned by the Imagen service.");
    }

    const base64EncodeString = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64EncodeString}`;

    res.json({ imageUrl });
  } catch (error: any) {
    console.error("Error generating image via Imagen:", error);
    res.status(500).json({ 
      error: error.message || "Failed to generate AI render. Our active chef preview is fully operational.",
      isFallbackNeeded: true
    });
  }
});

// 5. Integrate Vite Server or Static Files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Express + Vite server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting Express server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Frostella Luxury Cake Studio running on port ${PORT}`);
  });
}

startServer();
