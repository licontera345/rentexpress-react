import Config from '../../config/apiConfig';
import { USER_ROLES } from '../../constants';
import { axiosClient, normalizeToken, toApiError } from '../axiosClient';

const AUTH_ERROR_MESSAGES = {
  USER_LOGIN: 'Error al autenticar usuario',
  EMPLOYEE_LOGIN: 'Error al autenticar empleado',
  USER_REGISTER: 'Error al registrar usuario'
};

const normalizeRoleInfo = (candidate) => {
  const roleValue = candidate?.role;
  if (Array.isArray(roleValue)) {
    return roleValue[0] ?? null;
  }
  if (roleValue && typeof roleValue === 'object') {
    return roleValue;
  }
  return null;
};

/**
 * Normaliza la respuesta de autenticación a un shape estable para el frontend.
 * Nota: el OpenAPI no define explícitamente el schema del login (200), así que
 * esta es la ÚNICA capa donde toleramos variaciones de payload para evitar
 * que la app tenga "resolve*" por todas partes.
 */
const buildSessionUser = (data, fallbackUser) => {
  if (!data || typeof data !== 'object') {
    return fallbackUser;
  }

  const candidate =
    data.user ||
    data.employee ||
    data.userDTO ||
    data.employeeDTO ||
    data;

  if (!candidate || Object.keys(candidate).length === 0) {
    return fallbackUser;
  }

  const roleInfo = normalizeRoleInfo(candidate);

  const role = fallbackUser?.role ?? candidate?.role ?? null;
  const base = Object.assign({}, candidate, {
    role,
    // Normaliza nombres para UI.
    username: candidate?.username ?? candidate?.employeeName ?? fallbackUser?.username ?? '',
    employeeName: candidate?.employeeName ?? candidate?.username ?? fallbackUser?.username ?? ''
  });

  // IDs estables por tipo de sesión (para evitar resolveUserId/resolveEmployee* dispersos).
  if (role === USER_ROLES.EMPLOYEE) {
    base.employeeId = candidate?.employeeId ?? candidate?.id ?? null;
    base.roleId = candidate?.roleId ?? roleInfo?.roleId ?? null;
    base.roleName = roleInfo?.roleName ?? null;
    base.headquartersId = candidate?.headquartersId ?? candidate?.headquarters?.id ?? null;
  } else {
    base.userId = candidate?.userId ?? candidate?.id ?? null;
    base.roleId = candidate?.roleId ?? roleInfo?.roleId ?? null;
    base.roleName = roleInfo?.roleName ?? null;
  }

  return Object.assign({}, fallbackUser, base);
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

  /**
   * Solicita el enlace de recuperación de contraseña para el email dado.
   * Si el backend no expone el endpoint (404/501), no se lanza error y se considera éxito
   * para no revelar si el email existe o no.
   */
  forgotPassword: async (email) => {
    const endpoint = Config.AUTH.FORGOT_PASSWORD;
    if (!endpoint) return;
    try {
      await axiosClient.post(endpoint, { email: email?.trim() || '' });
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404 || status === 501) return;
      throw toApiError(error);
    }
  }
};

export default AuthService;
