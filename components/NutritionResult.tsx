import React from 'react';
import { NutritionInfo } from '../types';

interface NutritionResultProps {
  data: NutritionInfo;
  onReset: () => void;
  onLog: () => void;
  isLogging: boolean;
  hasLogged: boolean;
}

const StatCard: React.FC<{ label: string; value: number; unit: string; color: string }> = ({ label, value, unit, color }) => (
    <div className={`p-3 rounded-lg ${color}`}>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value.toFixed(0)}</p>
        <p className="text-xs text-gray-600">{unit}</p>
    </div>
);

const NutritionResult: React.FC<NutritionResultProps> = ({ data, onReset, onLog, isLogging, hasLogged }) => {
  return (
    <div className="flex-grow p-4 md:p-6 flex flex-col space-y-4 overflow-y-auto animate-fade-in">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border-t-4 border-yellow-400">
        <h2 className="text-2xl font-bold text-green-800 mb-1 text-center">Nutrition Analysis</h2>
        <p className="text-center text-gray-600 font-semibold mb-4">{data.mealName}</p>
        
        <div className="mb-5">
          <h3 className="font-semibold text-gray-800 mb-2">Identified Foods:</h3>
          {data.identifiedFoods.length > 0 ? (
            <div className="flex flex-wrap gap-2">
                {data.identifiedFoods.map((food, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {food}
                    </span>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">Could not identify specific food items.</p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-5">
          <StatCard label="Calories" value={data.calories} unit="kcal" color="bg-yellow-100" />
          <StatCard label="Protein" value={data.protein} unit="grams" color="bg-red-100" />
          <StatCard label="Carbs" value={data.carbs} unit="grams" color="bg-blue-100" />
          <StatCard label="Fat" value={data.fat} unit="grams" color="bg-indigo-100" />
        </div>

        <p className="text-xs text-gray-500 italic text-center">{data.disclaimer}</p>
      </div>
      
      <div className="pt-2 space-y-3">
        <button
          onClick={onLog}
          disabled={isLogging || hasLogged}
          type="button"
          className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-3 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLogging ? 'Logging...' : hasLogged ? '✓ Logged' : 'Log Meal to Sheet'}
        </button>
        <button
          onClick={onReset}
          type="button"
          className="w-full inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Analyze Another Meal
        </button>
      </div>
    </div>
  );
};

export default NutritionResult;