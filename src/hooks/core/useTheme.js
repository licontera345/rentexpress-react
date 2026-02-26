import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS, THEME } from '../../constants';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return THEME.DARK;
  }

  // Obtiene el tema almacenado en el localStorage.
  const storedTheme = window.localStorage.getItem(STORAGE_KEYS.THEME);
  if (storedTheme === THEME.LIGHT || storedTheme === THEME.DARK) {
    return storedTheme;
  }

  // Obtiene el tema de la preferencia del sistema.
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return THEME.DARK;
  }

  return THEME.DARK;
};

// Hook de tema visual (claro/oscuro).
const useTheme = () => {
  // Estado del tema.
  const [theme, setTheme] = useState(getInitialTheme);

  // Sincroniza el tema con el HTML y el almacenamiento local.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Alterna entre modo claro y oscuro.
  const toggleTheme = useCallback(() => {
    // Alterna entre modo claro y oscuro.
    setTheme((prevTheme) => (prevTheme === THEME.DARK ? THEME.LIGHT : THEME.DARK));
  }, []);

  // Estado y callbacks para el hook.
  return {
    theme,
    toggleTheme
  };
};

export default useTheme;
