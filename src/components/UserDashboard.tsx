import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Layout from './Layout';
import UploadCard from './UploadCard';
import ConfirmDialog from './ConfirmDialog';

interface PdfAnalysis {
  id: string;
  created_at: string;
  pdf_name: string;
}

const UserDashboard: React.FC = () => {
  const [analyses, setAnalyses] = useState<PdfAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    setIsLoading(true);
    setError(null);
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (user) {
      const { data, error } = await supabase
        .from('pdf_analyses')
        .select('id, created_at, pdf_name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analyses:', error);
        setError('Failed to fetch analyses. Please try again later.');
      } else {
        setAnalyses(data || []);
      }
    }
    setIsLoading(false);
  };

  const openDeleteDialog = (id: string) => {
    setSelectedAnalysis(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedAnalysis(null);
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedAnalysis) return;

    setIsLoading(true);
    setError(null);

    const { error } = await supabase
      .from('pdf_analyses')
      .delete()
      .eq('id', selectedAnalysis);

    if (error) {
      console.error('Error deleting analysis:', error);
      setError('Failed to delete analysis. Please try again.');
    } else {
      await fetchAnalyses();
    }

    setIsLoading(false);
    closeDeleteDialog();
  };

  if (isLoading) {
    return <Layout><div className="container mx-auto p-4">Loading...</div></Layout>;
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={fetchAnalyses} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Your PDF Analyses</h1>
        {analyses.length === 0 ? (
          <div>
            <p>You haven't analyzed any PDFs yet.</p>
            <Link to="/" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Analyze Your First PDF
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="bg-white shadow rounded-lg p-6 flex flex-col justify-between relative h-full">
                <button 
                  onClick={() => openDeleteDialog(analysis.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  aria-label="Delete analysis"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold mb-2">{analysis.pdf_name}</h2>
                <p className="text-gray-600 mb-4">
                  Analyzed on: {new Date(analysis.created_at).toLocaleDateString()}
                </p>
                <Link
                  to={`/analysis/${analysis.id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded"
                >
                  View Analysis
                </Link>
              </div>
            ))}
            <UploadCard />
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={dialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this analysis? This action cannot be undone."
      />
    </Layout>
  );
};

export default UserDashboard;