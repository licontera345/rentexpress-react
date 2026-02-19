import { useEffect, useRef } from 'react';
import { setOnUnauthorized } from '../../api/axiosClient';
import { ROUTES } from '../../constants';

/**
 * Registra en el cliente axios el handler para respuestas 401.
 * Recibe logout y navigate por props (desde App, dentro de AuthProvider y BrowserRouter).
 * Usa un flag para ejecutar el callback una sola vez aunque varias peticiones devuelvan 401 a la vez.
 */
function AuthAxiosSetup({ logout, navigate }) {
  const handling401 = useRef(false);

  useEffect(() => {
    setOnUnauthorized(() => {
      if (handling401.current) return;
      handling401.current = true;
      logout();
      navigate(ROUTES.LOGIN, { replace: true, state: { from: 'session_expired' } });
      setTimeout(() => { handling401.current = false; }, 1000);
    });
    return () => {
      setOnUnauthorized(null);
      handling401.current = false;
    };
  }, [logout, navigate]);

  return null;
}

export default AuthAxiosSetup;
