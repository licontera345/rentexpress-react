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
    return roleValue[0] || null;
  }
  if (roleValue && typeof roleValue === 'object') {
    return roleValue;
  }
  return null;
};

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
  const roleNameFromApi = (roleInfo?.roleName || candidate?.roleName || '').toString().toUpperCase();

  let role = fallbackUser?.role || candidate?.role || null;
  if (roleNameFromApi === 'ADMIN') {
    role = USER_ROLES.ADMIN;
  } else if (roleNameFromApi === 'EMPLOYEE' && !role) {
    role = USER_ROLES.EMPLOYEE;
  } else if (roleNameFromApi === 'CLIENT' && !role) {
    role = USER_ROLES.CUSTOMER;
  }
  const base = Object.assign({}, candidate, {
    role,
    username: candidate?.username ?? candidate?.employeeName ?? fallbackUser?.username ?? '',
    employeeName: candidate?.employeeName ?? candidate?.username ?? fallbackUser?.username ?? ''
  });

  if (role === USER_ROLES.EMPLOYEE) {
    base.employeeId = candidate?.id ?? null;
    base.roleId = candidate?.roleId ?? roleInfo?.roleId ?? null;
    base.roleName = roleInfo?.roleName ?? null;
    base.headquartersId = candidate?.headquartersId ?? candidate?.headquarters?.id ?? null;
  } else {
    base.userId = candidate?.userId ?? null;
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
  },

  resetPassword: async (token, newPassword) => {
    const endpoint = Config.AUTH.RESET_PASSWORD;
    if (!endpoint) throw new Error('Reset password not configured');
    await axiosClient.post(endpoint, { token: token?.trim() || '', newPassword: newPassword || '' });
  }
};

export default AuthService;
