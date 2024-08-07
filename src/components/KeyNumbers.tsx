import React from 'react';

interface KeyNumber {
  label: string;
  value: number;
  page_number: number;
}

interface KeyNumbersProps {
  keyNumbers: KeyNumber[];
}

const KeyNumbers: React.FC<KeyNumbersProps> = ({ keyNumbers }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Key Numbers</h2>
      {keyNumbers && keyNumbers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {keyNumbers.map((number, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded">
              <p className="text-2xl font-bold">{number.value}</p>
              <p className="text-gray-600">{number.label}</p>
              <p className="text-sm text-gray-500">Page {number.page_number}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No key numbers available.</p>
      )}
    </div>
  );
};

export default KeyNumbers;