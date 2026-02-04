import { useEffect, useState } from 'react';
import { getLocale, subscribeLocale } from '../i18n';

/**
 * Hook de idioma actual de la app.
 * Mantiene el locale sincronizado con el estado global y el atributo lang del HTML.
 */
// Hook que expone el locale actual y lo sincroniza con <html lang="">.
const useLocale = () => {
  const [locale, setLocale] = useState(getLocale());

  // Se suscribe a cambios globales de idioma.
  useEffect(() => subscribeLocale(setLocale), []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    // Actualiza el atributo lang del documento para accesibilidad/SEO.
    document.documentElement.lang = locale;
  }, [locale]);

  return locale;
};

export default useLocale;
