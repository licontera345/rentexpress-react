import { useEffect, useState } from 'react';
import { getLocale, subscribeLocale } from '../i18n';

const useLocale = () => {
  const [locale, setLocale] = useState(getLocale());

  useEffect(() => subscribeLocale(setLocale), []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.lang = locale;
  }, [locale]);

  return locale;
};

export default useLocale;
