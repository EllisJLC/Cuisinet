
import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult, GroundingSource } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export const fetchGroceryData = async (city: string, country: string): Promise<SearchResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `What are the most affordable produce items and major grocery stores in ${city}, ${country} right now? Analyze recent price trends and availability. Provide a mix of large chains and popular local discount options.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);

    // Extract grounding sources
    const sources: GroundingSource[] = [];
    const metadata = response.candidates?.[0]?.groundingMetadata;
    const chunks = metadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          sources.push({
            title: chunk.web.title || "Search Reference",
            uri: chunk.web.uri
          });
        }
      });
    }

    // Extract search entry point for Google Grounding UI
    const searchEntryPoint = metadata?.searchEntryPoint?.renderedContent;

    return {
      ...data,
      sources,
      searchEntryPoint
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch grocery data. Please try again.");
  }
};
