import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../../utils/ui/uiUtils';

/**
 * Hace scroll al inicio de la página cuando cambia la ruta.
 * Debe ir dentro de BrowserRouter para que useLocation funcione.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop('auto');
  }, [pathname]);

  return null;
}

export default ScrollToTop;
