import React from 'react';

interface SmallCardProps {
  number: string | number;
  explanation: string;
  pageReference: number;
}

const SmallCard: React.FC<SmallCardProps> = ({ number, explanation, pageReference }) => {
  return (
    <div className="bg-slate-900 text-white rounded-lg shadow-md p-6 flex flex-col justify-between h-full">
      <div>
        <div className="text-4xl font-bold mb-2">{number}</div>
        <p className="text-sm">{explanation}</p>
      </div>
      {pageReference > 0 && (
        <div className="text-right text-xs mt-4">Page {pageReference}</div>
      )}
    </div>
  );
};

export default SmallCard;