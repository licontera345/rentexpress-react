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

let onUnauthorizedCallback = null;

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

const inFlightRequests = new Map();

const getRequestKey = (config) => {
  const method = (config?.method || 'get').toLowerCase();
  const url = config?.url ?? '';
  const params = config?.params ? JSON.stringify(config.params) : '';
  return `${method}:${url}:${params}`;
};

const getRequestAdapter = (config) =>
  typeof config.adapter === 'function'
    ? config.adapter
    : (axiosClient.defaults.adapter ?? axios.defaults.adapter);

axiosClient.interceptors.request.use((config) => {
  const adapter = getRequestAdapter(config);
  if (typeof adapter !== 'function') {
    return config;
  }
  const key = getRequestKey(config);
  const existing = inFlightRequests.get(key);
  if (existing) {
    config.adapter = () => existing;
    return config;
  }
  config.adapter = () => {
    const promise = adapter(config);
    inFlightRequests.set(key, promise);
    promise.finally(() => { inFlightRequests.delete(key); });
    return promise;
  };
  return config;
});

const request = async (config) => {
  try {
    const response = await axiosClient.request(config);
    return response.data;
  } catch (error) {
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
