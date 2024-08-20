import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Dashboard from './Dashboard';
import Layout from './Layout';
import LoadingAnimation from './LoadingAnimation';

const AnalysisResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState(location.state?.analysisResult || null);
  const [isLoading, setIsLoading] = useState(location.state?.isLoading || false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saveAnalysisResult = async () => {
      if (analysisResult && !isLoading) {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (user) {
          const { error } = await supabase.from('pdf_analyses').insert({
            user_id: user.id,
            pdf_name: location.state?.pdfName || 'Unnamed PDF',
            analysis_result: analysisResult,
          });

          if (error) {
            console.error('Error saving analysis result:', error);
            setError('Failed to save analysis result');
          }
        }
      }
    };

    saveAnalysisResult();
  }, [analysisResult, isLoading, location.state]);

  if (isLoading) {
    return (
      <Layout>
        <LoadingAnimation />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-red-600">{error}</div>
      </Layout>
    );
  }

  if (!analysisResult) {
    return (
      <Layout>
        <div>No analysis result available. Please return to the home page and try again.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Dashboard analysisResult={analysisResult} />
      <button
        onClick={() => navigate('/')}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Analyze Another PDF
      </button>
    </Layout>
  );
};

export default AnalysisResultPage;