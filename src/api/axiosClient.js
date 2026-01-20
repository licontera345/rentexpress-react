import axios from 'axios';
import Config from '../config/Config';

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

const buildAuthHeaders = (token) => {
  const normalizedToken = normalizeToken(token);
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
    const hasAuthHeader = Boolean(config?.headers?.Authorization);
    console.log('[axiosClient] request', {
      method: config?.method,
      url: config?.url,
      params: config?.params,
      baseURL: config?.baseURL || axiosClient.defaults?.baseURL,
      hasAuthHeader
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
  normalizeToken,
  request,
  toApiError
};
