import { USER_ROLES } from './status';

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
