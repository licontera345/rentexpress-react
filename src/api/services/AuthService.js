import Config from '../../config/Config';
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

  return Object.assign({}, fallbackUser, candidate);
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

const loginWithEndpoint = async ({ endpoint, username, password, fallbackUser, errorMessage }) => {
  try {
    const response = await axiosClient.post(
      endpoint,
      toLoginPayload(username, password)
    );
    const data = response.data;
    const token = getTokenFromResponseOrHeaders(data, response);
    const sessionUser = token
      ? buildSessionUser(data, fallbackUser)
      : null;
    return { data, sessionUser, token };
  } catch (error) {
    throw buildAuthError(error, errorMessage);
  }
};

const AuthService = {
  loginUser: async (username, password) => loginWithEndpoint({
    endpoint: Config.AUTH.LOGIN_USER,
    username,
    password,
    fallbackUser: { username, role: 'user' },
    errorMessage: 'Error al autenticar usuario'
  }),

  loginEmployee: async (username, password) => loginWithEndpoint({
    endpoint: Config.AUTH.LOGIN_EMPLOYEE,
    username,
    password,
    fallbackUser: { username, role: 'employee' },
    errorMessage: 'Error al autenticar empleado'
  }),

  login: async (username, password, role = 'user') => (
    role === 'employee'
      ? AuthService.loginEmployee(username, password)
      : AuthService.loginUser(username, password)
  ),

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
