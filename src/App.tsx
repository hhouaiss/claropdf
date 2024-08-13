import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import DataClaro from './components/DataClaro';
import BlogListingPage from './components/blog/BlogListingPage';
import ArticlePage from './components/blog/ArticlePage';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DataClaro />} />
          <Route path="/blog" element={<BlogListingPage />} />
          <Route path="/blog/:slug" element={<ArticlePage />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
