import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';
import { AnalysisResult } from '../services/api';

const AnalysisResultPage: React.FC = () => {
  const location = useLocation();
  const analysisResult = location.state?.analysisResult as AnalysisResult;

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
        <h1 className="text-3xl font-bold mb-6">PDF Analysis Result</h1>
        <Link to="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">← Back to Home</Link>
        <Dashboard analysisResult={analysisResult} />
      </div>
    </Layout>
  );
};

export default AnalysisResultPage;