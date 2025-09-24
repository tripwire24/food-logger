import React, { useState } from 'react';
import { NutritionInfo } from '../types';
import NutritionResult from './NutritionResult'; // Re-using for the detailed view

interface HistoryViewProps {
  history: NutritionInfo[];
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onBack }) => {
  const [selectedItem, setSelectedItem] = useState<NutritionInfo | null>(null);

  if (selectedItem) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center">
          <div className="relative w-full max-w-lg h-full sm:h-auto sm:max-h-[90vh] bg-green-50 rounded-lg shadow-2xl flex flex-col">
              <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-green-800 text-center">Log Details</h2>
              </div>
              <div className="flex-grow overflow-y-auto">
                <NutritionResult 
                    data={selectedItem}
                    onReset={() => setSelectedItem(null)} // "Analyze Another Meal" becomes the back button
                    onLog={() => {}} // Dummy function
                    isLogging={true} // Disables the log button
                    hasLogged={true} // Keeps log button disabled
                />
              </div>
          </div>
      </div>
    );
  }

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Date unknown';
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex-grow p-4 md:p-6 flex flex-col space-y-4 overflow-y-auto animate-fade-in">
        <h2 className="text-2xl font-bold text-green-800 text-center mb-4">Meal History</h2>
        {history.length === 0 ? (
            <p className="text-center text-gray-500">You haven't logged any meals yet.</p>
        ) : (
            <ul className="space-y-3">
                {history.map((item) => (
                    <li key={item.id}>
                        <button 
                            onClick={() => setSelectedItem(item)}
                            className="w-full text-left p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-yellow-400 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold text-gray-800">{item.mealName}</p>
                                <p className="text-sm text-gray-500">{formatDate(item.loggedDate)}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-green-700">{item.calories.toFixed(0)}</p>
                                <p className="text-xs text-gray-500">kcal</p>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        )}
    </div>
  );
};

export default HistoryView;
