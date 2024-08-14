import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import DataClaro from './components/DataClaro';
import BlogListingPage from './components/blog/BlogListingPage';
import ArticlePage from './components/blog/ArticlePage';
import AnalysisResultPage from './components/AnalysisResultPage';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DataClaro />} />
          <Route path="/blog" element={<BlogListingPage />} />
          <Route path="/blog/:slug" element={<ArticlePage />} />
          <Route path="/analysis-result" element={<AnalysisResultPage />} />
          <Route path="/analysis-result/:shareId" element={<AnalysisResultPage />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App;