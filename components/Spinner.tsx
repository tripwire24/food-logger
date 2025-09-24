import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-yellow-400"></div>
    </div>
  );
};

export default Spinner;