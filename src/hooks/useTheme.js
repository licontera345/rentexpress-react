import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS, THEME } from '../constants/index.js';

function getInitialTheme() {
  if (typeof window === 'undefined') return THEME.DARK;
  const stored = window.localStorage.getItem(STORAGE_KEYS.THEME);
  if (stored === THEME.LIGHT || stored === THEME.DARK) return stored;
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return THEME.DARK;
  return THEME.DARK;
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === THEME.DARK ? THEME.LIGHT : THEME.DARK));
  }, []);

  return { theme, setTheme, toggleTheme };
}

export default useTheme;
