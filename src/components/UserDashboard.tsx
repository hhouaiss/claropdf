import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Layout from './Layout';
import UploadCard from './UploadCard';
import ConfirmDialog from './ConfirmDialog';
import { FileText, Trash2, Search } from 'lucide-react';

interface PdfAnalysis {
  id: string;
  created_at: string;
  pdf_name: string;
}

const UserDashboard: React.FC = () => {
  const [analyses, setAnalyses] = useState<PdfAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<PdfAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAnalyses();
  }, []);

  useEffect(() => {
    setFilteredAnalyses(
      analyses.filter(analysis => 
        analysis.pdf_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, analyses]);

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

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Your PDF Analyses</h1>
        
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search analyses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {isLoading ? (
          <div className="text-center">Loading your analyses...</div>
        ) : error ? (
          <div className="text-red-600 mb-4">{error}</div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="text-center">
            <p className="mb-4">You haven't analyzed any PDFs yet.</p>
            <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
              Analyze Your First PDF
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnalyses.map((analysis) => (
              <div key={analysis.id} className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2 flex items-center">
                    <FileText className="mr-2" size={20} />
                    {analysis.pdf_name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Analyzed on: {new Date(analysis.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/analysis/${analysis.id}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View Analysis
                  </Link>
                  <button
                    onClick={() => openDeleteDialog(analysis.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete analysis"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
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