import api from '../../config/api.js';
import { request } from '../axiosClient.js';

export const weatherService = {
  getByCity(city, lang = 'es') {
    return request({
      url: api.weather.byCity(city, lang),
      method: 'GET',
    });
  },
};

export default weatherService;
