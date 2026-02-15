
import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult, GroundingSource } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// import dotenv from 'dotenv'

export const fetchGroceryData = async (city: string, country: string, shoppingList?: string): Promise<SearchResult> => {
  console.log(process.env.GEMINI_API_KEY)
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  
  let prompt = `What are the most affordable produce items and major grocery stores in ${city}, ${country} right now? Analyze recent price trends and availability. Provide a mix of large chains and popular local discount options.`;

  if (shoppingList) {
    prompt += `\n\nAdditionally, the user wants to compare total costs for this specific shopping list: "${shoppingList}". 
    Find the approximate prices for these items at the top 2-3 most relevant supermarkets in ${city} and calculate a total shopping cart cost for each.`;
  }

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

    const metadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingSource[] = [];
    if (metadata?.groundingChunks) {
      metadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          sources.push({
            title: chunk.web.title || "Search Reference",
            uri: chunk.web.uri
          });
        }
      });
    }

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
