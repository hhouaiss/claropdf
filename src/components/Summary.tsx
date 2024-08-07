import React from 'react';

interface SummaryProps {
  summary: string;
}

const Summary: React.FC<SummaryProps> = ({ summary }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Document Summary</h2>
      {summary ? <p className="text-gray-700">{summary}</p> : <p>No summary available.</p>}
    </div>
  );
};

export default Summary;