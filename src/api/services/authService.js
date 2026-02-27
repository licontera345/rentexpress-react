/**
 * Auth: login (user/employee), register, forgot/reset password.
 * Devuelve la respuesta de la API tal cual (sin normalizar).
 */
import api from '../../config/api.js';
import { request, axiosClient, toApiError, normalizeToken } from '../axiosClient.js';

const loginPayload = (username, password) => ({ username, login: username, password });

const tokenFromResponse = (data, res) => {
  const fromBody = data?.token ?? data?.accessToken ?? data?.access_token ?? data?.jwt ?? null;
  if (fromBody) return normalizeToken(fromBody);
  const h = res?.headers?.authorization ?? res?.headers?.Authorization ?? null;
  return normalizeToken(h);
};

export const authService = {
  loginUser(username, password) {
    return axiosClient
      .post(api.auth.loginUser, loginPayload(username, password))
      .then((res) => ({ data: res.data, token: tokenFromResponse(res.data, res) }));
  },

  loginEmployee(username, password) {
    return axiosClient
      .post(api.auth.loginEmployee, loginPayload(username, password))
      .then((res) => ({ data: res.data, token: tokenFromResponse(res.data, res) }));
  },

  register(body) {
    return request({ url: api.users.createOpen, method: 'POST', data: body });
  },

  async forgotPassword(email) {
    try {
      await request({
        url: api.auth.forgotPassword,
        method: 'POST',
        data: { email: email?.trim() ?? '' },
      });
    } catch (e) {
      if (e?.status === 404 || e?.status === 501) return;
      throw toApiError(e?.originalError ?? e);
    }
  },

  resetPassword(token, newPassword) {
    return request({
      url: api.auth.resetPassword,
      method: 'POST',
      data: { token: token?.trim() ?? '', newPassword: newPassword ?? '' },
    });
  },
};

export default authService;
