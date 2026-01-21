import en from './translations/en';
import es from './translations/es';
import fr from './translations/fr';

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

  const storedLocale = window.localStorage?.getItem('locale');
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

export const setLocale = (locale) => {
  currentLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;

  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('locale', currentLocale);
  }
};

export const getLocale = () => currentLocale;

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
