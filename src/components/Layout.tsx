import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import Footer from './Footer';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/user-dashboard'
      }
    });
    if (error) console.error('Error logging in:', error);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
    else navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/">
            <svg width="100" height="30" viewBox="0 0 573 97" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* SVG path data */}
            </svg>
          </Link>
          
          <div className="flex items-center">
            {/* Burger menu button (visible on mobile) */}
            <button
              className="md:hidden mr-4 text-gray-600 hover:text-gray-900"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Login/Logout buttons (always visible) */}
            {session ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Navigation menu */}
        <nav className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col space-y-2 p-4 bg-white">
            <li className="text-gray-600 hover:text-gray-900">
              <Link to="/blog" onClick={toggleMenu}>Blog</Link>
            </li>
            <li className="text-gray-600 hover:text-gray-900">
              <a href="mailto:hello@claropdf.com" target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>Contact</a>
            </li>
            {session && (
              <li className="text-gray-600 hover:text-gray-900">
                <Link to="/user-dashboard" onClick={toggleMenu}>Dashboard</Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Desktop navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
            <li className="text-gray-600 hover:text-gray-900">
              <Link to="/blog">Blog</Link>
            </li>
            <li className="text-gray-600 hover:text-gray-900">
              <a href="mailto:hello@claropdf.com" target="_blank" rel="noopener noreferrer">Contact</a>
            </li>
            {session && (
              <li className="text-gray-600 hover:text-gray-900">
                <Link to="/user-dashboard">Dashboard</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;