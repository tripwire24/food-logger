import { v4 as uuidv4 } from 'uuid';

export enum MealType {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  SNACK = 'Snack',
}

export interface NutritionInfo {
  id?: string; // Unique ID for each log entry
  loggedDate?: string; // ISO string date when the meal was logged
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  saturatedFat: number;
  unsaturatedFat: number;
  potassium: number;
  vitaminA: number;
  vitaminC: number;
  calcium: number;
  iron: number;
  notes: string;
  identifiedFoods: string[];
  disclaimer: string;
}
