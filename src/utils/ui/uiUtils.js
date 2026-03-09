import {
  FiBriefcase,
  FiCalendar,
  FiCheckSquare,
  FiDollarSign,
  FiGrid,
  FiMessageCircle,
  FiPlusCircle,
  FiTruck,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import flagUs from '../../assets/flags/us.svg';
import flagEs from '../../assets/flags/es.svg';
import flagFr from '../../assets/flags/fr.svg';
import { MESSAGES, ROUTES, THEME, USER_ROLES } from '../../constants';

/**
 * Obtiene mensaje de error para mostrar al usuario a partir del error de API.
 * Acepta error de axios (error.response.data.code / .message) o objeto { code, message }.
 * Prioridad: clave i18n ERROR_<code> si existe, luego message, luego fallback i18n.
 */
export const getApiErrorMessage = (error, fallbackKey = 'UNEXPECTED_ERROR') => {
  if (!error) return MESSAGES[fallbackKey];
  const data = error.response?.data;
  const code = (data?.code && typeof data.code === 'string') ? data.code : (error.code && typeof error.code === 'string' ? error.code : null);
  const message = data?.message ?? error.message;
  if (code) {
    try {
      const key = 'ERROR_' + code;
      const msg = MESSAGES[key];
      if (msg && msg !== key) return msg;
    } catch (_) {}
  }
  return message || MESSAGES[fallbackKey];
};

// --- Paginación y tabs ---

export const generatePageNumbers = (currentPage, totalPages, maxButtons) => {
  const pages = [];
  const halfMax = Math.floor(maxButtons / 2);
  let startPage = Math.max(1, currentPage - halfMax);
  const endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
};

export const clampTabIndex = (index, tabsLength) => {
  if (tabsLength === 0) return 0;
  return Math.min(Math.max(index, 0), tabsLength - 1);
};

// --- Clases y accesibilidad ---

export const buildClassName = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const buildAriaDescribedBy = (...ids) => {
  const validIds = ids.filter(Boolean);
  return validIds.length > 0 ? validIds.join(' ') : undefined;
};

export const scrollToTop = (behavior = 'smooth') => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior });
  }
};

// --- Menú de navegación ---

const buildEmployeeMenuItems = () => [
  { label: MESSAGES.DASHBOARD, to: ROUTES.DASHBOARD, icon: FiGrid },
  { label: MESSAGES.EMPLOYEE_LIST_TITLE, to: ROUTES.EMPLOYEE_LIST, icon: FiBriefcase },
  { label: MESSAGES.CLIENT_LIST_TITLE, to: ROUTES.CLIENT_LIST, icon: FiUsers },
  { label: MESSAGES.VEHICLE_LIST_TITLE, to: ROUTES.VEHICLE_LIST, icon: FiTruck },
  { label: MESSAGES.RESERVATIONS_LIST_TITLE, to: ROUTES.RESERVATIONS_LIST, icon: FiCalendar },
  { label: MESSAGES.RENTALS_LIST_TITLE, to: ROUTES.RENTALS_LIST, icon: FiDollarSign },
  { label: MESSAGES.PICKUP_VERIFICATION_TITLE, to: ROUTES.PICKUP_VERIFICATION, icon: FiCheckSquare },
  { label: MESSAGES.NAV_SUPPORT, to: ROUTES.SUPPORT_CHAT, icon: FiMessageCircle },
];

const buildCustomerMenuItems = () => [
  { label: MESSAGES.DASHBOARD, to: ROUTES.DASHBOARD, icon: FiGrid },
  { label: MESSAGES.NAV_NEW_RESERVATION, to: ROUTES.RESERVATION_CREATE, icon: FiPlusCircle },
  { label: MESSAGES.MY_RESERVATIONS_TITLE, to: ROUTES.MY_RESERVATIONS, icon: FiCalendar },
  { label: MESSAGES.MY_RENTALS_TITLE, to: ROUTES.MY_RENTALS, icon: FiDollarSign },
  { label: MESSAGES.NAV_SUPPORT, to: ROUTES.SUPPORT_CHAT, icon: FiMessageCircle },
  { label: MESSAGES.PROFILE_TITLE, to: ROUTES.PROFILE, icon: FiUser },
];

export const getMenuItems = (isEmployee) => {
  return isEmployee ? buildEmployeeMenuItems() : buildCustomerMenuItems();
};

// --- Header: locale, tema, usuario ---

export const LOCALE_METADATA = {
  en: { label: 'EN', flag: flagUs, name: 'United States' },
  es: { label: 'ES', flag: flagEs, name: 'España' },
  fr: { label: 'FR', flag: flagFr, name: 'France' },
};

export const getThemeLabel = (theme) => {
  return theme === THEME.DARK ? MESSAGES.THEME_LIGHT : MESSAGES.THEME_DARK;
};

export const getThemeIcon = (theme, { FiSun, FiMoon }) => {
  return theme === THEME.DARK ? FiSun : FiMoon;
};

export const getLocaleMetadata = (locale) => {
  return LOCALE_METADATA[locale] ?? { label: locale.toUpperCase() };
};

export const getUserDisplayName = (user) => {
  return user?.firstName || user?.username || MESSAGES.USERNAME;
};

export const getUserRoleLabel = (role) => {
  return role === USER_ROLES.EMPLOYEE ? MESSAGES.EMPLOYEE_ROLE : MESSAGES.CUSTOMER_ROLE;
};

export const resolveAddress = (currentUser) => {
  if (!currentUser) return null;
  const addr = currentUser.address;
  if (Array.isArray(addr)) return addr[0] ?? null;
  if (addr && typeof addr === 'object') return addr;
  const addrs = currentUser.addresses;
  if (Array.isArray(addrs)) return addrs[0] ?? null;
  return null;
};

export const resolveUserId = (currentUser) =>
  currentUser?.userId ?? currentUser?.employeeId ?? null;
