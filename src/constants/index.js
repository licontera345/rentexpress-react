/**
 * Constantes centralizadas de la aplicación (punto único de entrada).
 * Antes repartidas en: routes, config, ui, messages, filters, shortcuts.
 */
import { t } from '../i18n';

// ═══════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CATALOG: '/catalog',
  REGISTER: '/auth/register',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS: '/terms',
  CONTACT: '/contact',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  NOT_FOUND: '/not-found',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  EMPLOYEE_LIST: '/employees',
  CLIENT_LIST: '/clients',
  VEHICLE_LIST: '/vehicles',
  RESERVATIONS_LIST: '/reservations',
  RENTALS_LIST: '/rentals',
  RESERVATION_CREATE: '/reservations/new',
  MY_RESERVATIONS: '/my-reservations',
  MY_RENTALS: '/my-rentals',
  PICKUP_VERIFICATION: '/pickup-verification',
};

// ═══════════════════════════════════════════════════════════════════
// CONFIG (roles, estados, storage, tema, formularios por defecto, etc.)
// ═══════════════════════════════════════════════════════════════════
export const USER_ROLES = {
  CUSTOMER: 'user',
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
};

export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  RENTED: 'rented',
  MAINTENANCE: 'maintenance',
  INACTIVE: 'inactive',
  AVAILABLE_ID: 1,
  MAINTENANCE_ID: 2,
  RENTED_ID: 3,
};

export const RESERVATION_STATUS = {
  PENDING_ID: 1,
};

export const STATUS_NAMES = {
  available: 'status-available',
  disponible: 'status-available',
  maintenance: 'status-maintenance',
  mantenimiento: 'status-maintenance',
  rented: 'status-rented',
  alquilado: 'status-rented',
  loue: 'status-rented',
};

const SESSION_PREFIX = 'rentexpress_';

export const STORAGE_KEYS = {
  AUTH_TOKEN: `${SESSION_PREFIX}token`,
  USER_DATA: `${SESSION_PREFIX}user`,
  LEGACY_AUTH_TOKEN: 'token',
  LEGACY_USER_DATA: 'loggedInUser',
  LEGACY_USER_DATA_ALT: 'user',
  PREFERENCES: 'user_preferences',
  RECENT_SEARCHES: 'recent_searches',
  REMEMBER_EMAIL: 'rememberEmail',
  REMEMBER_USERNAME: 'rememberUsername',
  THEME: 'rentexpress-theme',
  LOCALE: 'locale',
};

export const AUTH_HEADER = {
  KEY: 'Authorization',
  SCHEME: 'Bearer',
};

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const IMAGE_CONFIG = {
  MAX_SIZE: 5242880,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
};

export const DEFAULT_ACTIVE_STATUS = true;
export const MIN_AGE_FOR_REGISTER = 18;
export const DEFAULT_CURRENCY_SYMBOL = '€';
export const DISTANCE_UNIT_KM = 'km';

export const WEATHER_UNITS = {
  WIND_SPEED: 'm/s',
  PRESSURE: 'hPa',
};

export const TIME_FORMATS = {
  SHORT_DATE: 'dd/MM/yyyy',
  LONG_DATE: "dd 'de' MMMM 'de' yyyy",
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm',
};

export const DEFAULT_FORM_DATA = {
  LOGIN: {
    username: '',
    password: '',
    rememberMe: false,
    role: USER_ROLES.CUSTOMER,
  },
  REGISTER: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName1: '',
    lastName2: '',
    birthDate: '',
    phone: '',
    street: '',
    number: '',
    provinceId: '',
    cityId: '',
    acceptTerms: false,
  },
};

// ═══════════════════════════════════════════════════════════════════
// UI (botones, badges, alertas)
// ═══════════════════════════════════════════════════════════════════
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DANGER: 'danger',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  OUTLINED: 'outlined',
  GHOST: 'ghost',
};

export const BUTTON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

export const BADGE_VARIANTS = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  INFO: 'info',
};

export const BADGE_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

export const ALERT_VARIANTS = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// ═══════════════════════════════════════════════════════════════════
// FILTERS & PAGINATION & HOME & HEADQUARTERS
// ═══════════════════════════════════════════════════════════════════
export const FILTER_DEFAULTS = {
  brand: '',
  minPrice: '',
  maxPrice: '',
  categoryId: '',
  provinceId: '',
  cityId: '',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  DEFAULT_PAGE_SIZE_LARGE: 100,
  SEARCH_PAGE_SIZE: 25,
  MAX_BUTTONS: 5,
  MAX_PAGE_SIZE: 1000,
};

export const PAGINATION_ELLIPSIS = '...';

export const HOME_TRUST_ITEMS = [
  { label: 'Trustpilot', rating: '4,6' },
  { label: 'Google', rating: '4,5' },
  { label: 'Review Centre', rating: '4,2' },
  { label: 'Reviews.io', rating: '4,4' },
];

export const HOME_STATS_VALUES = {
  COUNTRIES: '164',
  LOCATIONS: '50 000+',
  PARTNERS: '1000+',
  LANGUAGES: '33',
};

const resolveHeadquartersName = (headquarters) => headquarters?.name || '';

const resolveHeadquartersAddress = (headquarters) => {
  const address = headquarters?.addresses?.[0];
  const street = address?.street;
  const number = address?.number;
  const cityName = address?.cityName || headquarters?.city?.cityName;
  const provinceName = address?.provinceName || headquarters?.province?.provinceName;
  const streetLine = [street, number].filter(Boolean).join(' ');
  const locationLine = [cityName, provinceName].filter(Boolean).join(', ');
  return [streetLine, locationLine].filter(Boolean).join(', ');
};

export const getHeadquartersOptionLabel = (headquarters) => {
  const name = resolveHeadquartersName(headquarters);
  const address = resolveHeadquartersAddress(headquarters);
  if (name && address) return `${name} - ${address}`;
  return name || address || '';
};

export const getHeadquartersNameLabel = (headquarters) => resolveHeadquartersName(headquarters) || '';

export const getHeadquartersAddressLabel = (headquarters) => resolveHeadquartersAddress(headquarters) || '';

export const getHeadquartersCityName = (headquarters) => {
  const address = headquarters?.addresses?.[0];
  return address?.cityName || headquarters?.city?.cityName || '';
};

const BASE_VEHICLE_FILTERS = {
  ...FILTER_DEFAULTS,
  model: '',
  currentHeadquartersId: '',
  manufactureYearFrom: '',
  manufactureYearTo: '',
  currentMileageMin: '',
  currentMileageMax: '',
};

export const getVehicleFilterDefaults = ({
  includeIdentifiers = false,
  includeStatus = false,
  includeActiveStatus = false,
} = {}) => {
  const defaults = { ...BASE_VEHICLE_FILTERS };
  if (includeIdentifiers) {
    defaults.licensePlate = '';
    defaults.vinNumber = '';
  }
  if (includeStatus) defaults.vehicleStatusId = '';
  if (includeActiveStatus) defaults.activeStatus = '';
  return defaults;
};

// ═══════════════════════════════════════════════════════════════════
// SHORTCUTS (usa ROUTES y USER_ROLES)
// ═══════════════════════════════════════════════════════════════════
export const SHORTCUT_PREFIX_GO = 'g';

export const SHORTCUT_HELP_KEYS = ['?', 'Shift+/'];

export const SHORTCUTS_COMMON = [
  { key: 'd', route: ROUTES.DASHBOARD, labelKey: 'DASHBOARD' },
  { key: 'p', route: ROUTES.PROFILE, labelKey: 'PROFILE_TITLE' },
];

export const SHORTCUTS_EMPLOYEE = [
  { key: 'e', route: ROUTES.EMPLOYEE_LIST, labelKey: 'EMPLOYEE_LIST_TITLE' },
  { key: 'c', route: ROUTES.CLIENT_LIST, labelKey: 'CLIENT_LIST_TITLE' },
  { key: 'v', route: ROUTES.VEHICLE_LIST, labelKey: 'VEHICLE_LIST_TITLE' },
  { key: 'r', route: ROUTES.RESERVATIONS_LIST, labelKey: 'RESERVATIONS_LIST_TITLE' },
  { key: 'a', route: ROUTES.RENTALS_LIST, labelKey: 'RENTALS_LIST_TITLE' },
  { key: 'u', route: ROUTES.PICKUP_VERIFICATION, labelKey: 'PICKUP_VERIFICATION_TITLE' },
];

export const SHORTCUTS_CUSTOMER = [
  { key: 'n', route: ROUTES.RESERVATION_CREATE, labelKey: 'NAV_NEW_RESERVATION' },
  { key: 'r', route: ROUTES.MY_RESERVATIONS, labelKey: 'MY_RESERVATIONS_TITLE' },
  { key: 'a', route: ROUTES.MY_RENTALS, labelKey: 'MY_RENTALS_TITLE' },
];

export function getShortcutsForRole(isEmployee) {
  const list = [...SHORTCUTS_COMMON];
  if (isEmployee) {
    list.push(...SHORTCUTS_EMPLOYEE);
  } else {
    list.push(...SHORTCUTS_CUSTOMER);
  }
  return list;
}

// ═══════════════════════════════════════════════════════════════════
// MESSAGES (proxy i18n)
// ═══════════════════════════════════════════════════════════════════
export const MESSAGES = new Proxy(
  {},
  {
    get(target, prop) {
      if (typeof prop !== 'string') return target[prop];
      return t(prop);
    },
  }
);
