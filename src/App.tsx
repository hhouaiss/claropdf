import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import DataClaro from './components/DataClaro';
import { Session } from '@supabase/supabase-js';
import BlogListingPage from './components/blog/BlogListingPage';
import ArticlePage from './components/blog/ArticlePage';
import AnalysisResultPage from './components/AnalysisResultPage';
import UserDashboard from './components/UserDashboard';
import { supabase } from './services/supabase';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuth(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuth(!!session);
      if (session) {
        navigate('/user-dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DataClaro />} />
          <Route path="/blog" element={<BlogListingPage />} />
          <Route path="/blog/:slug" element={<ArticlePage />} />
          <Route path="/analysis-result" element={<AnalysisResultPage />} />
          <Route path="/analysis/:id" element={<AnalysisResultPage />} />
          <Route path="/analysis-result/:shareId" element={<AnalysisResultPage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App;