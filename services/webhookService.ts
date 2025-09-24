import { WEBHOOK_URL } from '../constants';
import { NutritionInfo, MealType } from '../types';

/**
 * Sends the analyzed meal data to the webhook.
 * @param nutritionData The detailed nutrition info from Gemini.
 * @param mealType The meal type selected by the user.
 * @returns A promise that resolves when the data is sent.
 */
export const logToSheet = async (
  nutritionData: NutritionInfo,
  mealType: MealType,
): Promise<Response> => {

  const now = new Date();

  // Construct the specific payload as requested by the user for the Google Sheet
  const payload = {
    "Date": now.toISOString().split('T')[0], // YYYY-MM-DD
    "Time of Day": now.toTimeString().split(' ')[0].substring(0, 5), // HH:MM
    "Meal Type": mealType,
    "Meal Name": nutritionData.mealName,
    "Calories (kcal)": nutritionData.calories,
    "Protein (g)": nutritionData.protein,
    "Carbs (g)": nutritionData.carbs,
    "Fat (g)": nutritionData.fat,
    "Fibre (g)": nutritionData.fibre,
    "Sugar (g)": nutritionData.sugar,
    "Sodium (mg)": nutritionData.sodium,
    "Cholesterol (mg)": nutritionData.cholesterol,
    "Saturated Fat (g)": nutritionData.saturatedFat,
    "Unsaturated Fat (g)": nutritionData.unsaturatedFat,
    "Potassium (mg)": nutritionData.potassium,
    "Vitamin A (µg)": nutritionData.vitaminA,
    "Vitamin C (mg)": nutritionData.vitaminC,
    "Calcium (mg)": nutritionData.calcium,
    "Iron (mg)": nutritionData.iron,
    "Notes / Ingredients": nutritionData.notes,
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Webhook failed with status ${response.status}: ${errorText}`);
    }

    return response;
  } catch (error) {
    console.error("Error logging to sheet:", error);
    throw error;
  }
};