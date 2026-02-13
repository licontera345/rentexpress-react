import { t } from '../i18n';

// Mensajes internacionalizables
export const MESSAGES = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (typeof prop !== 'string') {
        return target[prop];
      }

      return t(prop);
    },
  }
);

// Rutas principales de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CATALOG: '/catalog',
  REGISTER: '/auth/register',
  PRIVACY_POLICY: '/privacy-policy',
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
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  DEFAULT_PAGE_SIZE_LARGE: 100,
  SEARCH_PAGE_SIZE: 25,
  MAX_BUTTONS: 5,
  MAX_PAGE_SIZE: 1000,
};

// Valores por defecto de filtros de vehículo
export const FILTER_DEFAULTS = {
  brand: '',
  minPrice: '',
  maxPrice: '',
  categoryId: '',
  provinceId: '',
  cityId: '',
};

// Estados de vehículo
export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  RENTED: 'rented',
  MAINTENANCE: 'maintenance',
  INACTIVE: 'inactive',
};

// Estados de reserva
export const RESERVATION_STATUS = {
  PENDING_ID: 1,
};

// Roles de usuario
export const USER_ROLES = {
  CUSTOMER: 'user',
  EMPLOYEE: 'employee',
};

// Datos por defecto de formularios
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

// Tipos de alerta genéricos
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Formatos de fecha/hora
export const TIME_FORMATS = {
  SHORT_DATE: 'dd/MM/yyyy',
  LONG_DATE: "dd 'de' MMMM 'de' yyyy",
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm',
};

// Claves de almacenamiento en localStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_DATA: 'loggedInUser',
  LEGACY_USER_DATA: 'user',
  PREFERENCES: 'user_preferences',
  RECENT_SEARCHES: 'recent_searches',
  REMEMBER_EMAIL: 'rememberEmail',
  REMEMBER_USERNAME: 'rememberUsername',
  THEME: 'rentexpress-theme',
  LOCALE: 'locale',
};

// Cabecera de autenticación
export const AUTH_HEADER = {
  KEY: 'Authorization',
  SCHEME: 'Bearer',
};

// Temas soportados
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

// API Key de OpenWeather
export const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
  ?? '74cf5b4f0feb6de4686b9b8db4f701fa';

// Configuración de imágenes
export const IMAGE_CONFIG = {
  MAX_SIZE: 5242880, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
};

// Estado activo por defecto
export const DEFAULT_ACTIVE_STATUS = true;

// Símbolos y unidades por defecto
export const DEFAULT_CURRENCY_SYMBOL = '€';
export const DISTANCE_UNIT_KM = 'km';

export const WEATHER_UNITS = {
  WIND_SPEED: 'm/s',
  PRESSURE: 'hPa',
};

// Variantes y tamaños de componentes UI
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DANGER: 'danger',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  OUTLINED: 'outlined',
};

export const BUTTON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

export const FORM_FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  EMAIL: 'email',
  PASSWORD: 'password',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  FILE: 'file',
  DATE: 'date',
};

export const CARD_VARIANTS = {
  DEFAULT: 'default',
  DASHBOARD: 'dashboard',
  VEHICLE: 'vehicle',
  ELEVATION: 'elevation',
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

export const MODAL_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  FULL: 'full',
};

export const TAB_VARIANTS = {
  DEFAULT: 'default',
  PILLS: 'pills',
  UNDERLINE: 'underline',
};

export const PAGINATION_VARIANTS = {
  DEFAULT: 'default',
  COMPACT: 'compact',
};

export const PAGINATION_ELLIPSIS = '...';

export const SPINNER_VARIANTS = {
  DEFAULT: 'default',
  SMALL: 'small',
  LARGE: 'large',
};

export const COMPONENT_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Traducción de nombres de estado de vehículo a clases CSS
export const STATUS_NAMES = {
  available: 'status-available',
  disponible: 'status-available',
  maintenance: 'status-maintenance',
  mantenimiento: 'status-maintenance',
  rented: 'status-rented',
  alquilado: 'status-rented',
  loue: 'status-rented',
};

// Sección de confianza de la home
export const HOME_TRUST_ITEMS = [
  { label: 'Trustpilot', rating: '4,6' },
  { label: 'Google', rating: '4,5' },
  { label: 'Review Centre', rating: '4,2' },
  { label: 'Reviews.io', rating: '4,4' },
];

// Valores numéricos mostrados en las estadísticas de la home
export const HOME_STATS_VALUES = {
  COUNTRIES: '164',
  LOCATIONS: '50 000+',
  PARTNERS: '1000+',
  LANGUAGES: '33',
};

