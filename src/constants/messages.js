import { t } from '../i18n';

// Proxy para traducir los mensajes de la aplicación.
export const MESSAGES = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (typeof prop !== 'string') return target[prop];
      return t(prop);
    },
  }
);
