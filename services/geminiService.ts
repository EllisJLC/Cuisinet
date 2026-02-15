
import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult, GroundingSource } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export const fetchGroceryData = async (
  city: string, 
  country: string, 
  shoppingList?: string,
  foodGroups: string[] = [],
  dietaryRestrictions: string[] = [],
  cuisines: string[] = []
): Promise<SearchResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const groupsText = foodGroups.length > 0 
    ? `Focus specifically on these food categories: ${foodGroups.join(', ')}.` 
    : 'Provide a general overview across common food groups.';

  const dietaryText = dietaryRestrictions.length > 0
    ? `IMPORTANT: All recommendations must strictly adhere to these dietary restrictions: ${dietaryRestrictions.join(', ')}.`
    : '';

  const cuisinesText = cuisines.length > 0
    ? `Suggest staple items and deals relevant to these cuisines/cultures: ${cuisines.join(', ')} (e.g., if South-East Asian is selected, check for deals on rice, soy sauce, etc.).`
    : '';

  let prompt = `Analyze grocery prices and store availability in ${city}, ${country} right now. 
  ${groupsText}
  ${dietaryText}
  ${cuisinesText}
  Identify the 4 best deals or most affordable seasonal/staple items available today that fit these criteria. 
  What are the 3 best value grocery stores in this city for these types of items?`;

  if (shoppingList) {
    prompt += `\n\nCRITICAL: The user has a shopping list: "${shoppingList}". 
    Find approximate current prices for these specific items at the top 3 supermarkets in ${city}. 
    Ensure items found match the dietary needs (${dietaryRestrictions.join(', ') || 'None'}) and cuisine preferences (${cuisines.join(', ') || 'None'}).
    Calculate the total estimated cost for the list at each store. 
    Identify which store offers the best total value.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            produce: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  priceEstimate: { type: Type.STRING },
                  seasonality: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["name", "priceEstimate", "seasonality", "reason"]
              }
            },
            stores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  highlights: { type: Type.STRING },
                  accessibility: { type: Type.STRING }
                },
                required: ["name", "category", "highlights", "accessibility"]
              }
            },
            shoppingComparison: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  storeName: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        itemName: { type: Type.STRING },
                        price: { type: Type.STRING },
                        notes: { type: Type.STRING }
                      }
                    }
                  },
                  totalCost: { type: Type.STRING },
                  isLowestPrice: { type: Type.BOOLEAN }
                },
                required: ["storeName", "items", "totalCost", "isLowestPrice"]
              }
            }
          },
          required: ["summary", "produce", "stores"]
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
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
    throw new Error("Failed to fetch grocery data. Please check your network or API key.");
  }
};
