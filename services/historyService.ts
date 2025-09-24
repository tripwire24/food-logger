import { NutritionInfo } from '../types';

const HISTORY_KEY = 'mealLogHistory';

/**
 * Retrieves the meal history from localStorage.
 * @returns An array of NutritionInfo objects. Returns an empty array if history is not found or corrupted.
 */
export const getHistory = (): NutritionInfo[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (historyJson) {
      const history = JSON.parse(historyJson);
      // Basic validation to ensure it's an array
      return Array.isArray(history) ? history : [];
    }
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    return [];
  }
  return [];
};

/**
 * Adds a new meal log to the history in localStorage.
 * The new entry is added to the beginning of the array.
 * @param newEntry The NutritionInfo object to add.
 * @returns The updated history array.
 */
export const addToHistory = (newEntry: NutritionInfo): NutritionInfo[] => {
  const currentHistory = getHistory();
  const updatedHistory = [newEntry, ...currentHistory];
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
    // Even if saving fails, return the in-memory updated history for the current session
  }
  return updatedHistory;
};
