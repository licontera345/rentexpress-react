import { t } from '../i18n';

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
