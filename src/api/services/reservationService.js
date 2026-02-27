import api from '../../config/api.js';
import { request, buildParams } from '../axiosClient.js';

const searchParams = (criteria) => buildParams({
  reservationId: criteria.reservationId,
  vehicleId: criteria.vehicleId,
  userId: criteria.userId,
  employeeId: criteria.employeeId,
  reservationStatusId: criteria.reservationStatusId,
  pickupHeadquartersId: criteria.pickupHeadquartersId,
  returnHeadquartersId: criteria.returnHeadquartersId,
  startDateFrom: criteria.startDateFrom,
  startDateTo: criteria.startDateTo,
  endDateFrom: criteria.endDateFrom,
  endDateTo: criteria.endDateTo,
  createdAtFrom: criteria.createdAtFrom,
  createdAtTo: criteria.createdAtTo,
  updatedAtFrom: criteria.updatedAtFrom,
  updatedAtTo: criteria.updatedAtTo,
  pageNumber: criteria.pageNumber,
  pageSize: criteria.pageSize,
});

export const reservationService = {
  findById(id) {
    return request({ url: api.reservations.byId(id), method: 'GET' });
  },
  search(criteria = {}) {
    return request({ url: api.reservations.search, method: 'GET', params: searchParams(criteria) });
  },
  create(data) {
    return request({ url: api.reservations.create, method: 'POST', data });
  },
  update(id, data) {
    return request({ url: api.reservations.update(id), method: 'PUT', data });
  },
  async delete(id) {
    await request({ url: api.reservations.delete(id), method: 'DELETE' });
  },
  getEstimate(dailyPrice, startDateIso, endDateIso) {
    return request({
      url: api.reservations.estimate,
      method: 'GET',
      params: buildParams({ dailyPrice, startDate: startDateIso, endDate: endDateIso }),
    });
  },
  generatePickupCode(id) {
    return request({ url: api.reservations.generatePickupCode(id), method: 'POST' });
  },
  verifyCode(code) {
    return request({ url: api.reservations.verifyCode(code), method: 'GET' });
  },
};

export default reservationService;
