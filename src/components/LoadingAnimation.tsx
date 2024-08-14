import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-xl font-semibold text-gray-700">Analyzing your PDF...</p>
      <p className="mt-2 text-gray-600">This may take a few moments</p>
    </div>
  );
};

export default LoadingAnimation;