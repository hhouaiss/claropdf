import React from 'react';

interface MediumCardProps {
  title: string;
  explanation: string;
  pageReference: number;
}

const MediumCard: React.FC<MediumCardProps> = ({ title, explanation, pageReference }) => {
  return (
    <div className="bg-[#1e293b] text-white rounded-lg shadow-md p-6 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-2xl font-semibold mb-3">{title}</h3>
        <p className="text-sm">{explanation}</p>
      </div>
      {pageReference > 0 && (
        <div className="text-right text-xs mt-4">Page {pageReference}</div>
      )}
    </div>
  );
};

export default MediumCard;