import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Layout from './Layout';

interface PdfAnalysis {
  id: string;
  created_at: string;
  pdf_name: string;
  user_id: string;
}

const UserDashboard: React.FC = () => {
  const [analyses, setAnalyses] = useState<PdfAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('pdf_analyses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching analyses:', error);
      setError('Failed to fetch analyses. Please try again later.');
    } else {
      setAnalyses(data || []);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <Layout><div className="container mx-auto p-4">Loading...</div></Layout>;
  }

  if (error) {
    return <Layout><div className="container mx-auto p-4 text-red-600">{error}</div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Your PDF Analyses</h1>
        {analyses.length === 0 ? (
          <p>You haven't analyzed any PDFs yet. Go to the home page to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2">{analysis.pdf_name}</h2>
                <p className="text-gray-600 mb-4">
                  Analyzed on: {new Date(analysis.created_at).toLocaleDateString()}
                </p>
                <Link
                  to={`/analysis/${analysis.id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  See Analysis
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserDashboard;