import axios from 'axios';
import Config from '../config/apiConfig';
import { STORAGE_KEYS } from '../constants';

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

  return trimmedToken.toLowerCase().startsWith('bearer ')
    ? trimmedToken.slice(7)
    : trimmedToken;
};

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedToken =
    localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    || sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  return normalizeToken(storedToken);
};

const buildAuthHeaders = (token) => {
  const normalizedToken = normalizeToken(token) || getStoredToken();
  console.log('[axiosClient] auth token present:', Boolean(normalizedToken));
  return normalizedToken ? { Authorization: `Bearer ${normalizedToken}` } : {};
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

const request = async (config) => {
  try {
    console.log('[axiosClient] request', {
      method: config?.method,
      url: config?.url,
      params: config?.params
    });
    const response = await axiosClient.request(config);
    console.log('[axiosClient] response', {
      url: config?.url,
      status: response?.status
    });
    return response.data;
  } catch (error) {
    console.log('[axiosClient] error', {
      url: config?.url,
      status: error?.response?.status,
      message: error?.message
    });
    throw toApiError(error);
  }
};

export {
  axiosClient,
  buildAuthHeaders,
  buildParams,
  getStoredToken,
  normalizeToken,
  request,
  toApiError
};
