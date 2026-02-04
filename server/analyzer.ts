import { ai } from "./replit_integrations/image/client";
import { InsertItem } from "@shared/schema";
import { Modality } from "@google/genai";

export async function analyzeImage(imageUrl: string, albumUrl: string): Promise<InsertItem> {
  try {
    // We need to fetch the image as bytes or base64 to send to Gemini if it's not a publicly accessible direct link it can fetch itself.
    // Google Photos URLs are accessible.
    // However, Gemini via the SDK usually accepts image parts.
    
    // Replit AI integration for Gemini supports text and image inputs.
    // We will construct a prompt.
    
    const prompt = `Analyze this image of a collectible. Return a JSON object (NO MARKDOWN, JUST RAW JSON) with the following fields:
    - itemName: string
    - category: string
    - conditionNotes: string
    - estimatedYear: string
    - keyFeatures: string[] (array of strings)
    `;

    // Fetch the image to get the buffer (more reliable than passing URL sometimes with these models)
    const imageResp = await fetch(imageUrl);
    if (!imageResp.ok) throw new Error("Failed to fetch image for analysis");
    const arrayBuffer = await imageResp.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Using 3 Flash as requested
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { 
              inlineData: {
                mimeType: "image/jpeg", // Assuming JPEG for simplicity, or we could detect
                data: base64Image
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const textResponse = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) throw new Error("No response from AI");

    const data = JSON.parse(textResponse);

    return {
      albumUrl,
      imageUrl,
      itemName: data.itemName || "Unknown Item",
      category: data.category || "Uncategorized",
      conditionNotes: data.conditionNotes || "",
      estimatedYear: data.estimatedYear || "",
      keyFeatures: data.keyFeatures || [],
    };

  } catch (error) {
    console.error("Analysis error:", error);
    // Return a fallback so the batch doesn't fail completely
    return {
      albumUrl,
      imageUrl,
      itemName: "Error analyzing item",
      category: "Error",
      conditionNotes: "Could not analyze image",
      estimatedYear: "",
      keyFeatures: [],
    };
  }
}
