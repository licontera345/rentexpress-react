import { request, buildParams } from './axiosClient';

const createRequest = (method) => (url, options = {}) =>
  request({
    url,
    method,
    data: options.data,
    params: buildParams(options.params),
    headers: options.headers,
  });

const api = {
  get: createRequest('GET'),
  post: createRequest('POST'),
  put: createRequest('PUT'),
  delete: createRequest('DELETE'),
};

export default api;
