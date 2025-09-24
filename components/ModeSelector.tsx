import React from 'react';

const CameraIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const UploadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const TextIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const HistoryIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


interface ModeSelectorProps {
  onSelectCamera: () => void;
  onSelectUpload: () => void;
  onSelectText: () => void;
  onSelectHistory: () => void;
  hasHistory: boolean;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectCamera, onSelectUpload, onSelectText, onSelectHistory, hasHistory }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 sm:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800">Log Your Meal</h2>
        <p className="text-gray-600 mt-2">How would you like to start?</p>
      </div>
      <div className="w-full max-w-xs space-y-4">
        <ModeButton
          icon={<CameraIcon className="h-8 w-8 text-yellow-500" />}
          label="Take a Photo"
          onClick={onSelectCamera}
        />
        <ModeButton
          icon={<UploadIcon className="h-8 w-8 text-yellow-500" />}
          label="Upload Image"
          onClick={onSelectUpload}
        />
        <ModeButton
          icon={<TextIcon className="h-8 w-8 text-yellow-500" />}
          label="Log with Text Only"
          onClick={onSelectText}
        />
        {hasHistory && (
             <ModeButton
                icon={<HistoryIcon className="h-8 w-8 text-yellow-500" />}
                label="View History"
                onClick={onSelectHistory}
            />
        )}
      </div>
    </div>
  );
};

interface ModeButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

const ModeButton: React.FC<ModeButtonProps> = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-yellow-400 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
    >
        {icon}
        <span className="text-lg font-semibold text-gray-700">{label}</span>
    </button>
);


export default ModeSelector;
