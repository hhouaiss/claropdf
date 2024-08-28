import React from 'react';
import { supabase } from '../services/supabase';
import { useLocation } from 'react-router-dom';

const LoginPrompt: React.FC = () => {
  const location = useLocation();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectUrl=${encodeURIComponent(location.pathname + location.search)}`,
      }
    });
    
    if (error) console.error('Error logging in:', error);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white via-white to-transparent flex flex-col items-center justify-end pb-8">
      <p className="text-lg font-semibold mb-4">Log in to see the full analysis</p>
      <button
        onClick={handleLogin}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default LoginPrompt;