import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from './FileUpload';

const UploadCard: React.FC = () => {
  const navigate = useNavigate();

  const handleFileUpload = (file: File) => {
    // Here you would typically handle the file upload and analysis
    // For now, let's just navigate to the analysis page
    navigate('/analysis-result', { 
      state: { 
        isLoading: true,
        pdfName: file.name,
        file: file
      } 
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Upload New PDF</h2>
      <FileUpload onFileUpload={handleFileUpload} />
    </div>
  );
};

export default UploadCard;