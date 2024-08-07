import React from 'react';

interface BigCardProps {
  title: string;
  content: string;
  pageReference: number;
}

const BigCard: React.FC<BigCardProps> = ({ title, content, pageReference }) => {
  return (
    <div className="bg-[#1e293b] text-white rounded-lg shadow-md p-6 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-sm whitespace-pre-line">{content}</p>
      </div>
      {pageReference > 0 && (
        <div className="text-right text-xs mt-4">Page {pageReference}</div>
      )}
    </div>
  );
};

export default BigCard;