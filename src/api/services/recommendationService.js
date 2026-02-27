import api from '../../config/api.js';
import { request } from '../axiosClient.js';

export const recommendationService = {
  create(body) {
    return request({ url: api.recommendations.create, method: 'POST', data: body });
  },
};

export default recommendationService;
