import { useEffect, useState } from 'react';
import { getLocale, subscribeLocale } from '../i18n';

const useLocale = () => {
  const [locale, setLocale] = useState(getLocale());

  useEffect(() => subscribeLocale(setLocale), []);

  return locale;
};

export default useLocale;
