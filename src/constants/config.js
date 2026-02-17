// Roles de usuario (usado en config y en toda la app)
export const USER_ROLES = {
  CUSTOMER: 'user',
  EMPLOYEE: 'employee',
};

export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  RENTED: 'rented',
  MAINTENANCE: 'maintenance',
  INACTIVE: 'inactive',
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

export const AUTH_HEADER = {
  KEY: 'Authorization',
  SCHEME: 'Bearer',
};

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY ?? null;

export const IMAGE_CONFIG = {
  MAX_SIZE: 5242880,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
};

export const DEFAULT_ACTIVE_STATUS = true;
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
