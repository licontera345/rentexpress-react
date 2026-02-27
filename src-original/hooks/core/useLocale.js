import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function useLocale() {
  const { i18n } = useTranslation();

  // Sincroniza el atributo lang del documento y hace que el árbol se re-renderice al cambiar el idioma.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return i18n.language;
}

export default useLocale;
