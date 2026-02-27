import { useState } from 'react';

/**
 * Idioma actual. Estado local; cuando tengas i18n, sincroniza con i18n.language
 * (ej. useEffect(() => { setLocale(i18n.language); i18n.on('languageChanged', setLocale); })).
 * Hasta entonces devuelve 'es' por defecto.
 */
export function useLocale(initialLocale = 'es') {
  const [locale, setLocale] = useState(initialLocale);
  return { locale, setLocale };
}

export default useLocale;
