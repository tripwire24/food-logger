import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { NutritionInfo, MealType } from '../types';

// --- IMPORTANT ---
// The API key is placed directly here for this client-side application to function.
// For security, you MUST restrict this key in your Google Cloud Console to only
// allow requests from your website's domain (e.g., your GitHub Pages URL).
const API_KEY = 'AIzaSyB7YL5R0lH5qpXZx-KzQGL8Jfb00eP7HBM';
const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    mealName: { type: Type.STRING, description: "A concise, descriptive name for the meal, like 'Grilled Chicken Salad'." },
    calories: { type: Type.NUMBER, description: "Estimated total calories of the meal." },
    protein: { type: Type.NUMBER, description: "Estimated grams of protein." },
    carbs: { type: Type.NUMBER, description: "Estimated grams of carbohydrates." },
    fat: { type: Type.NUMBER, description: "Estimated grams of fat." },
    fibre: { type: Type.NUMBER, description: "Estimated grams of fibre." },
    sugar: { type: Type.NUMBER, description: "Estimated grams of sugar." },
    sodium: { type: Type.NUMBER, description: "Estimated milligrams (mg) of sodium." },
    cholesterol: { type: Type.NUMBER, description: "Estimated milligrams (mg) of cholesterol." },
    saturatedFat: { type: Type.NUMBER, description: "Estimated grams of saturated fat." },
    unsaturatedFat: { type: Type.NUMBER, description: "Estimated grams of unsaturated fat." },
    potassium: { type: Type.NUMBER, description: "Estimated milligrams (mg) of potassium." },
    vitaminA: { type: Type.NUMBER, description: "Estimated micrograms (µg) of Vitamin A." },
    vitaminC: { type: Type.NUMBER, description: "Estimated milligrams (mg) of Vitamin C." },
    calcium: { type: Type.NUMBER, description: "Estimated milligrams (mg) of Calcium." },
    iron: { type: Type.NUMBER, description: "Estimated milligrams (mg) of Iron." },
    notes: { type: Type.STRING, description: "A summary of the primary ingredients identified, in a comma-separated list." },
    identifiedFoods: {
      type: Type.ARRAY,
      description: "A list of individual food items identified in the meal.",
      items: { type: Type.STRING }
    },
    disclaimer: { type: Type.STRING, description: "A short disclaimer stating that these values are estimates and not medical advice." }
  },
  required: ["mealName", "calories", "protein", "carbs", "fat", "fibre", "sugar", "sodium", "notes", "identifiedFoods", "disclaimer"]
};

export const analyzeMeal = async (
  imageDataUrl: string | null,
  mealType: MealType,
  notes: string
): Promise<NutritionInfo> => {
  const textPrompt = `This meal is for ${mealType}. Additional notes from the user: "${notes || 'No notes provided'}". Please identify the food items and provide a detailed, estimated nutritional breakdown. Generate a simple name for the meal. The notes field in the JSON should be a list of the main ingredients you see.`;

  const parts: any[] = [];
  if (imageDataUrl) {
    const mimeTypeMatch = imageDataUrl.match(/data:(.*);base64,/);
    if (!mimeTypeMatch) {
        throw new Error("Invalid image data URL format.");
    }
    const mimeType = mimeTypeMatch[1];
    const base64Data = imageDataUrl.split(',')[1];
    
    parts.push({
      inlineData: { mimeType, data: base64Data }
    });
  }
  parts.push({ text: textPrompt });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        systemInstruction: 'You are a helpful nutrition analysis assistant. Analyze the user\'s meal based on the provided image and text. Respond only with the JSON object matching the provided schema. Provide reasonable estimates for all fields. If a value cannot be determined, estimate it as 0.',
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Ensure all numeric fields exist, defaulting to 0 if missing from AI response
    const requiredNumericFields = ["calories", "protein", "carbs", "fat", "fibre", "sugar", "sodium", "cholesterol", "saturatedFat", "unsaturatedFat", "potassium", "vitaminA", "vitaminC", "calcium", "iron"];
    requiredNumericFields.forEach(field => {
      if (typeof parsedJson[field] !== 'number') {
        parsedJson[field] = 0;
      }
    });

    return parsedJson as NutritionInfo;

  } catch (error) {
    console.error("Error analyzing meal with Gemini:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("The API key is invalid. Please check your configuration.");
    }
    throw new Error("Failed to get a valid analysis from the AI model.");
  }
};