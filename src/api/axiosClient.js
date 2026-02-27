/**
 * Cliente HTTP único. Interceptores: auth, 401, dedup de requests.
 * Respuestas sin normalizar (datos tal cual API).
 */
import axios from 'axios';
import api from '../config/api.js';

const AUTH_HEADER = { KEY: 'Authorization', SCHEME: 'Bearer' };

const client = axios.create({
  baseURL: api.baseUrl,
  headers: { 'Content-Type': 'application/json' },
});

export const normalizeToken = (token) => {
  if (!token || typeof token !== 'string') return null;
  const t = token.trim();
  if (!t || t === 'null' || t === 'undefined') return null;
  const prefix = `${AUTH_HEADER.SCHEME.toLowerCase()} `;
  return t.toLowerCase().startsWith(prefix) ? t.slice(prefix.length) : t;
};

export const setAuthToken = (token) => {
  const t = normalizeToken(token);
  if (t) {
    client.defaults.headers.common[AUTH_HEADER.KEY] = `${AUTH_HEADER.SCHEME} ${t}`;
  } else {
    delete client.defaults.headers.common[AUTH_HEADER.KEY];
  }
};

export const buildParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ''
    )
  );

export const toApiError = (err) => {
  if (!axios.isAxiosError(err)) return err;
  const status = err.response?.status;
  const payload = err.response?.data;
  const message =
    payload?.message ?? payload?.error ?? (status ? `HTTP ${status}` : err.message);
  const e = new Error(message);
  e.status = status;
  e.payload = payload;
  e.originalError = err;
  return e;
};

let onUnauthorized = null;
export const setOnUnauthorized = (fn) => {
  onUnauthorized = typeof fn === 'function' ? fn : null;
};

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && onUnauthorized) onUnauthorized();
    return Promise.reject(err);
  }
);

const inFlight = new Map();
const requestKey = (c) =>
  `${(c?.method || 'get').toLowerCase()}:${c?.url ?? ''}:${JSON.stringify(c?.params ?? {})}`;

client.interceptors.request.use((config) => {
  const adapter = typeof config.adapter === 'function'
    ? config.adapter
    : (client.defaults.adapter ?? axios.defaults.adapter);
  if (typeof adapter !== 'function') return config;
  const key = requestKey(config);
  const existing = inFlight.get(key);
  if (existing) {
    config.adapter = () => existing;
    return config;
  }
  const promise = adapter(config);
  inFlight.set(key, promise);
  promise.finally(() => inFlight.delete(key));
  config.adapter = () => promise;
  return config;
});

export const request = async (config) => {
  try {
    const res = await client.request(config);
    return res.data;
  } catch (err) {
    throw toApiError(err);
  }
};

export { client as axiosClient };
export default client;
