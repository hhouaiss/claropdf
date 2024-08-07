import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo placeholder */}
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-bold">Logo</span>
          </div>
          
          {/* Small menu */}
          <nav>
            <ul className="flex space-x-4">
              <li><Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-6">
          Unlock the Power of Your PDFs with 
          <span className="text-red-600"> AI-Driven Insights</span>
        </h1>
        
        <p className="text-xl text-center mb-12 max-w-3xl mx-auto">
          Transform complex documents into actionable intelligence. DataClaro analyzes your PDFs, 
          extracts key information, and presents insights in a clear, concise format.
        </p>

        <div className="text-center">
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => {/* Handle navigation or file upload */}}
          >
            Analyze Your PDF Now
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;