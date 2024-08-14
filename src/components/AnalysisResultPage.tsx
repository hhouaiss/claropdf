import React, { useState, useEffect } from 'react';
import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';
import LoadingAnimation from './LoadingAnimation';
import { AnalysisResult, analyzePDF, extractTextFromPDF } from '../services/api';

const AnalysisResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { shareId } = useParams<{ shareId: string }>();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    location.state?.analysisResult || null
  );
  const [pdfName, setPdfName] = useState<string>(location.state?.pdfName || 'Unnamed PDF');
  const [shareLink, setShareLink] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(location.state?.isLoading || false);
  const [error, setError] = useState<string | null>(location.state?.error || null);

  useEffect(() => {
    const analyzeDocument = async () => {
      if (location.state?.isLoading && location.state?.file) {
        try {
          const text = await extractTextFromPDF(location.state.file);
          const result = await analyzePDF(text);
          setAnalysisResult(result);
          setIsLoading(false);
        } catch (error: any) {
          console.error('Error analyzing document:', error);
          setError(`Error: ${error.message}`);
          setIsLoading(false);
        }
      }
    };

    if (shareId) {
      setIsLoading(true);
      // Fetch the shared analysis result using the shareId
      // This is a placeholder and should be replaced with your actual API call
      const fetchSharedResult = async () => {
        try {
          const response = await fetch(`/api/shared-analysis/${shareId}`);
          const data = await response.json();
          setAnalysisResult(data.analysisResult);
          setPdfName(data.pdfName);
        } catch (error) {
          console.error('Error fetching shared analysis:', error);
          setError('Failed to load shared analysis');
        } finally {
          setIsLoading(false);
        }
      };
      fetchSharedResult();
    } else {
      analyzeDocument();
    }
  }, [location.state, shareId]);

  const handleShare = async () => {
    // This is a placeholder and should be replaced with your actual sharing logic
    try {
      const response = await fetch('/api/share-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisResult, pdfName }),
      });
      const data = await response.json();
      setShareLink(`${window.location.origin}/analysis-result/${data.shareId}`);
    } catch (error) {
      console.error('Error sharing analysis:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <LoadingAnimation />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Error</h1>
          <p className="text-red-600">{error}</p>
          <Link to="/" className="mt-4 text-blue-600 hover:text-blue-800">Go back to home</Link>
        </div>
      </Layout>
    );
  }

  if (!analysisResult) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Analysis Result Not Found</h1>
          <p>No analysis result available. Please return to the home page and try again.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800">Go back to home</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800">← Go back to home</Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">PDF Analysis Result</h1>
        <p className="text-xl mb-4">Analyzed PDF: {pdfName}</p>
        <Dashboard analysisResult={analysisResult} />
        
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Analyze Another PDF
          </button>
          {/* <button
            onClick={handleShare}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Share Results
          </button> */}
        </div>
        
        {shareLink && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>Share this link to view the analysis results:</p>
            <input
              type="text"
              value={shareLink}
              readOnly
              className="w-full p-2 mt-2 border rounded"
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AnalysisResultPage;