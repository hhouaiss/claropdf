import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import DataClaro from './components/DataClaro';
import { Session } from '@supabase/supabase-js';
import BlogListingPage from './components/blog/BlogListingPage';
import ArticlePage from './components/blog/ArticlePage';
import AnalysisResultPage from './components/AnalysisResultPage';
import UserDashboard from './components/UserDashboard';
import { supabase } from './services/supabase';
// import AuthCallback from './components/callback';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <HelmetProvider>
      <Router>
        <Routes>
        <Route path="/" element={
          session ? <Navigate to="/user-dashboard" replace /> : <DataClaro />
        } />
          <Route path="/blog" element={<BlogListingPage />} />
          <Route path="/blog/:slug" element={<ArticlePage />} />
          <Route path="/analysis-result" element={<AnalysisResultPage />} />
          <Route path="/analysis/:id" element={<AnalysisResultPage />} />
          <Route path="/analysis-result/:shareId" element={<AnalysisResultPage />} />
          <Route 
          path="/user-dashboard" 
          element={
            session ? <UserDashboard /> : <Navigate to="/" replace />
          } 
        />
        {/* <Route path="/auth/callback" element={<AuthCallback />} /> */}
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App;