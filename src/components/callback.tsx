import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const params = new URLSearchParams(location.search);
      const redirectUrl = params.get('redirectUrl') || '/user-dashboard';

      if (session) {
        navigate(redirectUrl);
      } else {
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

  return null; // This component doesn't render anything
};

export default AuthCallback;