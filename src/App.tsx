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

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DataClaro />} />
          <Route path="/blog" element={<BlogListingPage />} />
          <Route path="/blog/:slug" element={<ArticlePage />} />
          <Route path="/analysis-result" element={<AnalysisResultPage />} />
          <Route path="/analysis-result/:shareId" element={<AnalysisResultPage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          {/* <Route 
            path="/user-dashboard" 
            element={session ? <UserDashboard /> : <Navigate to="/" replace />} 
          /> */}
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App;