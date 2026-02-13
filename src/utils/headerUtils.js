import { THEME, USER_ROLES, MESSAGES } from '../constants';
import flagUs from '../assets/flags/us.svg';
import flagEs from '../assets/flags/es.svg';
import flagFr from '../assets/flags/fr.svg';

// Metadatos de locales disponibles.
export const LOCALE_METADATA = {
  en: { label: 'EN', flag: flagUs, name: 'United States' },
  es: { label: 'ES', flag: flagEs, name: 'España' },
  fr: { label: 'FR', flag: flagFr, name: 'France' },
};

// Obtiene el label del tema basado en el tema actual.
export const getThemeLabel = (theme) => {
  return theme === THEME.DARK ? MESSAGES.THEME_LIGHT : MESSAGES.THEME_DARK;
};

// Obtiene el icono del tema basado en el tema actual.
export const getThemeIcon = (theme, { FiSun, FiMoon }) => {
  return theme === THEME.DARK ? FiSun : FiMoon;
};

// Obtiene los metadatos del locale actual.
export const getLocaleMetadata = (locale) => {
  return LOCALE_METADATA[locale] ?? { label: locale.toUpperCase() };
};

// Obtiene el nombre de visualización del usuario.
export const getUserDisplayName = (user) => {
  return user?.firstName || user?.username || MESSAGES.USERNAME;
};

// Obtiene el label del rol del usuario.
export const getUserRoleLabel = (role) => {
  return role === USER_ROLES.EMPLOYEE ? MESSAGES.EMPLOYEE_ROLE : MESSAGES.CUSTOMER_ROLE;
};
