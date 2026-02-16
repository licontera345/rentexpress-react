import { useEffect } from 'react';
import { setOnUnauthorized } from '../../api/axiosClient';
import { ROUTES } from '../../constants';

/**
 * Registra en el cliente axios el handler para respuestas 401.
 * Recibe logout y navigate por props (desde App, dentro de AuthProvider y BrowserRouter).
 */
function AuthAxiosSetup({ logout, navigate }) {
  useEffect(() => {
    setOnUnauthorized(() => {
      logout();
      navigate(ROUTES.LOGIN, { replace: true, state: { from: 'session_expired' } });
    });
    return () => setOnUnauthorized(null);
  }, [logout, navigate]);

  return null;
}

export default AuthAxiosSetup;
