import api from '../../config/api.js';
import { request } from '../axiosClient.js';

export const configService = {
  getFilterRanges() {
    return request({ url: api.config.filterRanges, method: 'GET' }).then(
      (r) => r?.data ?? r ?? null
    ).catch(() => null);
  },
  getImageUploadConfig() {
    return request({ url: api.config.imageUpload, method: 'GET' }).then(
      (r) => r?.data ?? r ?? null
    ).catch(() => null);
  },
};

export default configService;
