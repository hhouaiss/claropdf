import React from 'react';

interface KeyInfoItem {
  content: string;
  page_number: number;
}

interface KeyInformationProps {
  keyInfo: KeyInfoItem[];
}

const KeyInformation: React.FC<KeyInformationProps> = ({ keyInfo }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Key Information</h2>
      {keyInfo && keyInfo.length > 0 ? (
        <ul className="space-y-2">
          {keyInfo.map((item, index) => (
            <li key={index} className="flex justify-between items-start">
              <span className="text-gray-700">{item.content}</span>
              <span className="text-sm text-gray-500">Page {item.page_number}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No key information available.</p>
      )}
    </div>
  );
};

export default KeyInformation;