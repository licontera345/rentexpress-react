import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS, THEME } from '../constants';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return THEME.DARK;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEYS.THEME);
  if (storedTheme === THEME.LIGHT || storedTheme === THEME.DARK) {
    return storedTheme;
  }

  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return THEME.DARK;
  }

  return THEME.DARK;
};

const useTheme = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === THEME.DARK ? THEME.LIGHT : THEME.DARK));
  }, []);

  return {
    theme,
    toggleTheme
  };
};

export default useTheme;
