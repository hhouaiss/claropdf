import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from './FileUpload';
import { analyzePDF, extractTextFromPDF } from '../services/api';
import LoadingAnimation from './LoadingAnimation';

const UploadCard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const text = await extractTextFromPDF(file);
      const result = await analyzePDF(text);
      
      navigate('/analysis-result', { 
        state: { 
          analysisResult: result,
          pdfName: file.name,
        }
      });
    } catch (error: any) {
      console.error('Error analyzing document:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-transparent shadow rounded-lg p-6 h-full flex flex-col justify-between border-2 border-dashed border-gray-300">
      <h2 className="text-xl font-semibold mb-4">Upload New PDF</h2>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      )}
    </div>
  );
};

export default UploadCard;