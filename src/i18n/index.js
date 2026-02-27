import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { STORAGE_KEYS } from '../constants';

import en from './translations/en.json';
import es from './translations/es.json';
import fr from './translations/fr.json';

const DEFAULT_LOCALE = 'es';

const isValidLocale = (locale) =>
  typeof locale === 'string' && ['en', 'es', 'fr'].includes(locale);

const resolveLocale = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }
  const stored = window.localStorage?.getItem(STORAGE_KEYS.LOCALE);
  if (stored && isValidLocale(stored)) return stored;
  const browser = window.navigator?.language?.split('-')[0];
  if (browser && isValidLocale(browser)) return browser;
  return DEFAULT_LOCALE;
};

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
};

i18n.use(initReactI18next).init({
  resources,
  lng: resolveLocale(),
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: ['en', 'es', 'fr'],
  interpolation: {
    escapeValue: false,
    prefix: '${',
    suffix: '}',
  },
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
}

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEYS.LOCALE, lng);
  }
});

export const t = (key, params = {}) => i18n.t(key, params);

export const getLocale = () => i18n.language;

export const setLocale = (locale) => {
  const next = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  i18n.changeLanguage(next);
};

export const availableLocales = Object.keys(resources);

export default i18n;
