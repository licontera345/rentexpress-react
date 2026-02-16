import axios from 'axios';
import Config from '../config/apiConfig';
import { AUTH_HEADER } from '../constants';

const axiosClient = axios.create({
  baseURL: Config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const normalizeToken = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const trimmedToken = token.trim();
  if (!trimmedToken || trimmedToken === 'null' || trimmedToken === 'undefined') {
    return null;
  }

  const schemePrefix = `${AUTH_HEADER.SCHEME.toLowerCase()} `;
  return trimmedToken.toLowerCase().startsWith(schemePrefix)
    ? trimmedToken.slice(schemePrefix.length)
    : trimmedToken;
};

const setAuthToken = (token) => {
  const normalizedToken = normalizeToken(token);
  if (normalizedToken) {
    axiosClient.defaults.headers.common[AUTH_HEADER.KEY] = `${AUTH_HEADER.SCHEME} ${normalizedToken}`;
  } else {
    delete axiosClient.defaults.headers.common[AUTH_HEADER.KEY];
  }
};

const buildParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );

const toApiError = (error) => {
  if (!axios.isAxiosError(error)) {
    return error;
  }

  const status = error.response?.status;
  const payload = error.response?.data;
  const message =
    payload?.message ||
    payload?.error ||
    (status ? `HTTP ${status}` : error.message);

  const apiError = new Error(message);
  apiError.status = status;
  apiError.payload = payload;
  apiError.originalError = error;
  return apiError;
};

const isDev = import.meta.env.DEV;

/** Callback ejecutado cuando la API responde 401 (sesión expirada o no autorizado). */
let onUnauthorizedCallback = null;

/**
 * Registra el handler para respuestas 401. Debe llamarse desde un componente
 * que tenga acceso a logout y navigate (ej. dentro de AuthProvider y BrowserRouter).
 * @param {Function} callback - () => void, típicamente logout + navigate a login
 */
export function setOnUnauthorized(callback) {
  onUnauthorizedCallback = typeof callback === 'function' ? callback : null;
}

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 && onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
    return Promise.reject(error);
  }
);

const request = async (config) => {
  try {
    if (isDev) {
      // eslint-disable-next-line no-console -- solo en desarrollo para depuración
      console.debug('[axiosClient] request', { method: config?.method, url: config?.url });
    }
    const response = await axiosClient.request(config);
    return response.data;
  } catch (error) {
    if (isDev) {
      // eslint-disable-next-line no-console -- solo en desarrollo para depuración
      console.debug('[axiosClient] error', {
        url: config?.url,
        status: error?.response?.status,
        message: error?.message
      });
    }
    throw toApiError(error);
  }
};

export {
  axiosClient,
  buildParams,
  normalizeToken,
  request,
  setAuthToken,
  toApiError
};
