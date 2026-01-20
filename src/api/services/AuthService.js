import Config from '../../config/Config';
import { LOGIN_TYPES } from '../../constants';
import { axiosClient, normalizeToken, toApiError } from '../axiosClient';

const buildSessionUser = (data, fallbackUser) => {
  if (!data || typeof data !== 'object') {
    return fallbackUser;
  }

  const candidate = data.user
    || data.employee
    || data.userDTO
    || data.employeeDTO
    || data;

  if (!candidate || Object.keys(candidate).length === 0) {
    return fallbackUser;
  }

  const sessionUser = Object.assign({}, candidate);
  sessionUser.loginType = fallbackUser.loginType;
  return sessionUser;
};

const getTokenFromResponse = (data) => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  return data.token || data.accessToken || data.access_token || data.jwt || null;
};

const getTokenFromResponseOrHeaders = (data, response) => {
  const tokenFromBody = getTokenFromResponse(data);
  if (tokenFromBody) {
    return normalizeToken(tokenFromBody);
  }

  const headerToken =
    response?.headers?.authorization ||
    response?.headers?.Authorization ||
    null;
  return normalizeToken(headerToken);
};

const toLoginPayload = (username, password) => ({
  username,
  login: username,
  password
});

const buildAuthError = (error, fallbackMessage) => {
  const apiError = toApiError(error);
  if (apiError instanceof Error) {
    if (!apiError.message || apiError.message.startsWith('HTTP')) {
      apiError.message = fallbackMessage;
    }
    return apiError;
  }
  return error;
};

const AuthService = {
  loginUser: async (username, password) => {
    try {
      const response = await axiosClient.post(
        Config.AUTH.LOGIN_USER,
        toLoginPayload(username, password)
      );
      const data = response.data;
      const token = getTokenFromResponseOrHeaders(data, response);
      const sessionUser = token
        ? buildSessionUser(data, { username, loginType: LOGIN_TYPES.USER })
        : null;
      return { data, sessionUser, token };
    } catch (error) {
      throw buildAuthError(error, 'Error al autenticar usuario');
    }
  },

  loginEmployee: async (username, password) => {
    try {
      const response = await axiosClient.post(
        Config.AUTH.LOGIN_EMPLOYEE,
        toLoginPayload(username, password)
      );
      const data = response.data;
      const token = getTokenFromResponseOrHeaders(data, response);
      const sessionUser = token
        ? buildSessionUser(data, { username, loginType: LOGIN_TYPES.EMPLOYEE })
        : null;
      return { data, sessionUser, token };
    } catch (error) {
      throw buildAuthError(error, 'Error al autenticar empleado');
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosClient.post(Config.USERS.CREATE_OPEN, userData);
      return response.data;
    } catch (error) {
      const apiError = toApiError(error);
      if (apiError instanceof Error) {
        if (!apiError.message || apiError.message.startsWith('HTTP')) {
          apiError.message = 'Error al registrar usuario';
        }
        throw apiError;
      }
      throw new Error('Error al registrar usuario');
    }
  },

  getTokenFromResponseOrHeaders,
  normalizeToken
};

export default AuthService;
