import api from '../../config/api.js';
import { request, buildParams } from '../axiosClient.js';

export const statisticsService = {
  getDashboard(from, to) {
    return request({
      url: api.statistics.dashboard,
      method: 'GET',
      params: buildParams({ from, to }),
    });
  },
  getRevenue(from, to) {
    return request({
      url: api.statistics.revenue,
      method: 'GET',
      params: buildParams({ from, to }),
    });
  },
  getRevenueMonthly(year) {
    return request({
      url: api.statistics.revenueMonthly,
      method: 'GET',
      params: buildParams({ year }),
    });
  },
  getReservations() {
    return request({ url: api.statistics.reservations, method: 'GET' });
  },
  getFleet() {
    return request({ url: api.statistics.fleet, method: 'GET' });
  },
  getHeadquarters() {
    return request({ url: api.statistics.headquarters, method: 'GET' });
  },
};

export default statisticsService;
