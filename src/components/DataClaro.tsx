import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzePDF, extractTextFromPDF } from '../services/api';
import FileUpload from './FileUpload';
import Layout from './Layout';
import { DocumentTextIcon, ChartBarIcon, LightBulbIcon } from '@heroicons/react/outline';

const DataClaro: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setError(null);
  };

  const analyzeDocument = async () => {
    if (!file) return;

    setError(null);
    // Navigate to the analysis result page immediately
    navigate('/analysis-result', { 
      state: { 
        isLoading: true,
        pdfName: file.name,
        file: file
      } 
    });

    try {
      const text = await extractTextFromPDF(file);
      const result = await analyzePDF(text);
      
      // Update the analysis result page with the results
      navigate('/analysis-result', { 
        state: { 
          analysisResult: result,
          pdfName: file.name,
          isLoading: false
        },
        replace: true  // This replaces the current history entry instead of adding a new one
      });
    } catch (error: any) {
      console.error('Error analyzing document:', error);
      navigate('/analysis-result', { 
        state: { 
          error: `Error: ${error.message}`,
          pdfName: file.name,
          isLoading: false
        },
        replace: true
      });
    }
  };

  return (
    <Layout>
      <h1 className="text-5xl md:text-6xl font-bold text-center mb-6">
        Unlock the Power of Your PDFs with 
        <span className="text-red-600"><br/>AI-Driven Insights!</span>
      </h1>
      
      <p className="text-xl text-center mb-12 max-w-3xl mx-auto">
        Transform complex documents into actionable intelligence. ClaroPDF analyzes your PDFs, 
        extracts key information, and presents insights in a clear, concise format.
      </p>

      <div className="max-w-xl mx-auto mb-8">
        <FileUpload onFileUpload={handleFileUpload} />
      </div>

      <div className="text-center">
        <button 
          onClick={analyzeDocument}
          disabled={!file}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Analyze Document
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded max-w-xl mx-auto">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 mt-10">
        <div className="text-center">
          <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <h3 className="text-2xl font-semibold mb-2">Intelligent Document Analysis</h3>
          <p className="text-gray-600">
            ClaroPDF uses advanced AI algorithms to analyze the structure and content of your PDFs, extracting key information and insights.
          </p>
        </div>
        <div className="text-center">
          <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <h3 className="text-2xl font-semibold mb-2">Interactive Data Visualization</h3>
          <p className="text-gray-600">
            Transform extracted data into interactive visual dashboards, enabling you to explore and gain valuable insights from your PDFs.
          </p>
        </div>
        <div className="text-center">
          <LightBulbIcon className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <h3 className="text-2xl font-semibold mb-2">Actionable Insights</h3>
          <p className="text-gray-600">
            Gain actionable insights from your PDFs, empowering you to make data-driven decisions and streamline your workflows.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DataClaro;