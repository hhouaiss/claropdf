import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/user-dashboard');
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default AuthCallback;