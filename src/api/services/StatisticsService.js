import Config from '../../config/apiConfig';
import { buildParams, request } from '../axiosClient';

const StatisticsService = {
  getDashboardStats(from, to) {
    return request({
      url: Config.STATISTICS.DASHBOARD,
      method: 'GET',
      params: buildParams({ from, to }),
    });
  },

  getTotalRevenue(from, to) {
    return request({
      url: Config.STATISTICS.REVENUE,
      method: 'GET',
      params: buildParams({ from, to }),
    });
  },

  getRevenueByMonth(year) {
    return request({
      url: Config.STATISTICS.REVENUE_MONTHLY,
      method: 'GET',
      params: buildParams({ year }),
    });
  },

  getReservationStats() {
    return request({
      url: Config.STATISTICS.RESERVATIONS,
      method: 'GET',
    });
  },

  getVehicleFleetStats() {
    return request({
      url: Config.STATISTICS.FLEET,
      method: 'GET',
    });
  },

  getHeadquartersStats() {
    return request({
      url: Config.STATISTICS.HEADQUARTERS,
      method: 'GET',
    });
  },
};

export default StatisticsService;
