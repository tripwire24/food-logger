import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MealType, NutritionInfo } from './types';
import { analyzeMeal } from './services/geminiService';
import { logToSheet } from './services/webhookService';
import { getHistory, addToHistory } from './services/historyService';
import Spinner from './components/Spinner';
import CameraCapture from './components/CameraCapture';
import ModeSelector from './components/ModeSelector';
import NutritionResult from './components/NutritionResult';
import HistoryView from './components/HistoryView';
import Toast from './components/Toast';

type View = 'selector' | 'capture' | 'form' | 'result' | 'history';

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h1.172a2 2 0 011.414.586l.828.828A2 2 0 008.828 6H12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        <path fillRule="evenodd" d="M10 9a3 3 0 100 6 3 3 0 000-6zm-1 3a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
    </svg>
);

const BackArrowIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const App: React.FC = () => {
    const [view, setView] = useState<View>('selector');
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [mealType, setMealType] = useState<MealType>(MealType.LUNCH);
    const [notes, setNotes] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLogging, setIsLogging] = useState<boolean>(false);
    const [hasLogged, setHasLogged] = useState<boolean>(false);
    const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null);
    const [history, setHistory] = useState<NutritionInfo[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showLogSuccessToast, setShowLogSuccessToast] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Load history from local storage on initial app load
        setHistory(getHistory());
    }, []);

    const handleCapture = (capturedImageSrc: string) => {
        setImageSrc(capturedImageSrc);
        setView('form');
    };
    
    const handleTextOnly = () => {
        setImageSrc(null);
        setView('form');
    };
    
    const handleSelectUpload = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    handleCapture(result);
                } else {
                    setError("Failed to read the uploaded image.");
                }
            };
            reader.onerror = () => {
                setError("Error reading file.");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReset = () => {
        setView('selector');
        setImageSrc(null);
        setNotes('');
        setError(null);
        setNutritionInfo(null);
        setHasLogged(false);
    };

    const handleAnalyzeMeal = async () => {
        if (!imageSrc && !notes.trim()) {
            setError("Please add a photo or write a note to analyze your meal.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setHasLogged(false);
        try {
            const result = await analyzeMeal(imageSrc, mealType, notes);
            setNutritionInfo(result);
            setView('result');

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during analysis.";
            setError(`Failed to analyze meal. ${errorMessage}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLogMeal = async () => {
        if (!nutritionInfo) {
            setError("Cannot log meal: nutrition data is missing.");
            return;
        }
        setIsLogging(true);
        try {
            await logToSheet(nutritionInfo, mealType);
            
            // Add to local history
            const newLogEntry: NutritionInfo = {
                ...nutritionInfo,
                id: uuidv4(),
                loggedDate: new Date().toISOString(),
            };
            const updatedHistory = addToHistory(newLogEntry);
            setHistory(updatedHistory);

            setHasLogged(true);
            setShowLogSuccessToast(true);
        } catch (logError) {
            console.error("Failed to log:", logError);
            setError("Failed to save data. Please try again.");
        } finally {
            setIsLogging(false);
        }
    };

    const renderContent = () => {
        switch(view) {
            case 'selector':
                return <ModeSelector 
                    onSelectCamera={() => setView('capture')}
                    onSelectUpload={handleSelectUpload}
                    onSelectText={handleTextOnly}
                    onSelectHistory={() => setView('history')}
                    hasHistory={history.length > 0}
                />;
            case 'capture':
                return <CameraCapture onCapture={handleCapture} onError={setError} onBack={handleReset} />;
            case 'history':
                return <HistoryView history={history} onBack={() => setView('selector')} />;
            case 'form':
                return (
                     <div className="flex-grow p-4 md:p-6 flex flex-col space-y-4 overflow-y-auto">
                        {imageSrc ? (
                            <div className="relative rounded-lg overflow-hidden shadow-lg border-2 border-yellow-300">
                                <img src={imageSrc} alt="Captured meal" className="w-full h-auto" />
                            </div>
                        ) : (
                            <div className="text-center p-6 bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-lg">
                                <p className="text-gray-600 font-medium">Logging with text only.</p>
                            </div>
                        )}

                        <div className="space-y-4 bg-white p-4 rounded-lg shadow">
                            <div>
                                <label htmlFor="mealType" className="block text-sm font-medium text-gray-700">Meal Type</label>
                                <select
                                    id="mealType"
                                    value={mealType}
                                    onChange={(e) => setMealType(e.target.value as MealType)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
                                >
                                    {Object.values(MealType).map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                                <textarea
                                    id="notes"
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="e.g., Grilled chicken salad, extra avocado"
                                    className="mt-1 shadow-sm block w-full sm:text-sm border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={handleAnalyzeMeal}
                                disabled={isLoading}
                                type="button"
                                className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-3 bg-yellow-400 text-base font-medium text-green-900 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Analyze Meal
                            </button>
                        </div>
                    </div>
                );
            case 'result':
                return nutritionInfo ? (
                    <NutritionResult 
                        data={nutritionInfo} 
                        onReset={handleReset}
                        onLog={handleLogMeal}
                        isLogging={isLogging || isLoading}
                        hasLogged={hasLogged}
                    />
                ) : null;
        }
    };

    return (
        <div className="h-screen w-screen bg-green-50 text-gray-800 font-sans flex flex-col antialiased">
            {(isLoading || isLogging) && <Spinner />}
            {showLogSuccessToast && <Toast message="Logged to Google Sheet!" onClose={() => setShowLogSuccessToast(false)} />}
            <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                className="hidden"
            />
            
            <header className="p-4 bg-white shadow-md flex items-center space-x-3 flex-shrink-0 z-10">
                {view !== 'selector' && (
                    <button onClick={handleReset} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600" aria-label="Go back">
                        <BackArrowIcon />
                    </button>
                )}
                <CameraIcon />
                <h1 className="text-2xl font-bold text-green-800 tracking-tight">Food Logger</h1>
            </header>

            <main className="flex-grow flex flex-col overflow-hidden relative">
                {error && (
                    <div className="absolute top-0 left-0 right-0 bg-red-100 border-b-4 border-red-500 text-red-700 p-4 z-20" role="alert">
                         <div className="flex">
                            <div>
                                <p className="font-bold">Error</p>
                                <p className="text-sm">{error}</p>
                            </div>
                            <button onClick={() => setError(null)} className="ml-auto text-red-500 font-bold text-xl">&times;</button>
                        </div>
                    </div>
                )}
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
