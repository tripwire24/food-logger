import { ANALYSIS_WEBHOOK_URL } from '../constants';
import { NutritionInfo, MealType } from '../types';

/**
 * Sends the meal data to a secure webhook for analysis.
 * The webhook acts as a proxy to call the Gemini API securely.
 * @param imageDataUrl The base64 encoded image data.
 * @param mealType The selected meal type.
 * @param notes User-provided notes.
 * @returns A promise that resolves with the NutritionInfo from the webhook.
 */
export const analyzeMeal = async (
  imageDataUrl: string | null,
  mealType: MealType,
  notes: string
): Promise<NutritionInfo> => {
  try {
    const response = await fetch(ANALYSIS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageDataUrl,
        mealType,
        notes,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Analysis webhook failed with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result as NutritionInfo;

  } catch (error) {
    console.error("Error calling analysis webhook:", error);
    throw new Error("Failed to get a valid analysis from the backend service.");
  }
};