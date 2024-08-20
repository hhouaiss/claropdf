import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Dashboard from './Dashboard';
import Layout from './Layout';
import LoadingAnimation from './LoadingAnimation';

const AnalysisResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saveAnalysisResult = async () => {
      console.log('Starting saveAnalysisResult');
      if (location.state?.analysisResult) {
        console.log('Analysis result found in location state');
        setAnalysisResult(location.state.analysisResult);
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session:', session);
        const user = session?.user;
        if (user) {
          console.log('User found, attempting to save analysis');
          try {
            const { error: insertError } = await supabase.from('pdf_analyses').insert({
              user_id: user.id,
              pdf_name: location.state?.pdfName || 'Unnamed PDF',
              analysis_result: location.state.analysisResult,
            });
  
            if (insertError) throw insertError;
            console.log('Analysis saved successfully');
          } catch (err) {
            console.error('Error saving analysis result:', err);
            setError('Failed to save analysis result');
          }
        } else {
          console.log('No user found in session');
        }
      } else {
        console.log('No analysis result in location state');
        setError('No analysis result available');
      }
      setIsLoading(false);
      console.log('Finished saveAnalysisResult');
    };
  
    saveAnalysisResult();
  }, [location.state]);

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