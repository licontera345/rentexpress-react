import Config from '../../config/apiConfig';
import { USER_ROLES } from '../../constants';
import { axiosClient, normalizeToken, toApiError } from '../axiosClient';

const AUTH_ERROR_MESSAGES = {
  USER_LOGIN: 'Error al autenticar usuario',
  EMPLOYEE_LOGIN: 'Error al autenticar empleado',
  USER_REGISTER: 'Error al registrar usuario'
};

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
    fallbackUser: { username, role: USER_ROLES.CUSTOMER },
    errorMessage: AUTH_ERROR_MESSAGES.USER_LOGIN
  }),

  loginEmployee: async (username, password) => loginWithEndpoint({
    endpoint: Config.AUTH.LOGIN_EMPLOYEE,
    username,
    password,
    fallbackUser: { username, role: USER_ROLES.EMPLOYEE },
    errorMessage: AUTH_ERROR_MESSAGES.EMPLOYEE_LOGIN
  }),

  login: async (username, password, role = USER_ROLES.CUSTOMER) => (
    role === USER_ROLES.EMPLOYEE
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
          apiError.message = AUTH_ERROR_MESSAGES.USER_REGISTER;
        }
        throw apiError;
      }
      throw new Error(AUTH_ERROR_MESSAGES.USER_REGISTER);
    }
  },

  getTokenFromResponseOrHeaders,
  normalizeToken
};

export default AuthService;
