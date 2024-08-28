import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Dashboard from './Dashboard';
import Layout from './Layout';
import LoadingAnimation from './LoadingAnimation';
import LoginPrompt from './LoginPrompt';

const AnalysisResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [pdfName, setPdfName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (id) {
        // Fetch saved analysis
        const { data, error } = await supabase
          .from('pdf_analyses')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching analysis:', error);
          setError('Failed to fetch analysis');
          setIsLoading(false);
          return;
        }

        if (data) {
          setAnalysisResult(data.analysis_result);
          setPdfName(data.pdf_name);
        } else {
          setError('Analysis not found');
        }
      } else if (location.state?.analysisResult) {
        // New analysis
        setAnalysisResult(location.state.analysisResult);
        setPdfName(location.state.pdfName || 'Unnamed PDF');
        
        // Save new analysis if authenticated
        if (session) {
          const { error: insertError } = await supabase.from('pdf_analyses').insert({
            user_id: session.user.id,
            pdf_name: location.state.pdfName || 'Unnamed PDF',
            analysis_result: location.state.analysisResult,
          });

          if (insertError) {
            console.error('Error saving analysis result:', insertError);
          }
        }
      } else {
        setError('No analysis result available');
      }
      setIsLoading(false);
    };

    fetchAnalysis();
  }, [id, location.state]);

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
        <button
          onClick={() => navigate('/user-dashboard')}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Return to Dashboard
        </button>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative">
        <h1 className="text-2xl font-bold mb-4">Analysis Result for: {pdfName}</h1>
        <Dashboard analysisResult={analysisResult} isAuthenticated={isAuthenticated} />
        {!isAuthenticated && <LoginPrompt />}
      </div>
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