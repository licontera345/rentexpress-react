import en from './translations/en.json';
import es from './translations/es.json';
import fr from './translations/fr.json';
import { STORAGE_KEYS } from '../constants/storage-keys.js';

const translations = {
  en,
  es,
  fr,
};

const DEFAULT_LOCALE = 'es';

const isValidLocale = (locale) => Object.prototype.hasOwnProperty.call(translations, locale);

const resolveLocale = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const storedLocale = window.localStorage?.getItem(STORAGE_KEYS.LOCALE);
  if (storedLocale && isValidLocale(storedLocale)) {
    return storedLocale;
  }

  const browserLocale = window.navigator?.language?.split('-')[0];
  if (browserLocale && isValidLocale(browserLocale)) {
    return browserLocale;
  }

  return DEFAULT_LOCALE;
};

let currentLocale = resolveLocale();
const localeListeners = new Set();

if (typeof document !== 'undefined') {
  document.documentElement.lang = currentLocale;
}

export const setLocale = (locale) => {
  const nextLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  if (nextLocale === currentLocale) {
    return;
  }

  currentLocale = nextLocale;

  if (typeof document !== 'undefined') {
    document.documentElement.lang = currentLocale;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEYS.LOCALE, currentLocale);
  }

  localeListeners.forEach((listener) => listener(currentLocale));
};

export const getLocale = () => currentLocale;

export const subscribeLocale = (listener) => {
  localeListeners.add(listener);

  return () => {
    localeListeners.delete(listener);
  };
};

export const t = (key, params = {}) => {
  const dictionary = translations[currentLocale] || translations[DEFAULT_LOCALE];
  const fallback = translations[DEFAULT_LOCALE] || {};
  const template = dictionary[key] ?? fallback[key];

  if (!template) {
    return key;
  }

  return template.replace(/\$\{(\w+)\}/g, (_, param) => String(params[param] ?? ''));
};

export const availableLocales = Object.keys(translations);
