import Config from '../../config/apiConfig';
import { request } from '../axiosClient';

const WeatherService = {
  getByCity(city, lang = 'es') {
    return request({
      url: Config.WEATHER.BY_CITY(city, lang),
      method: 'GET',
    });
  },
};

export default WeatherService;
