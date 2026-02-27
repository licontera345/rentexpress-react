import api from '../../config/api.js';
import { request, buildParams } from '../axiosClient.js';

const searchParams = (criteria) => buildParams({
  rentalId: criteria.rentalId,
  reservationId: criteria.reservationId,
  vehicleId: criteria.vehicleId,
  userId: criteria.userId,
  rentalStatusId: criteria.rentalStatusId,
  startDateFrom: criteria.startDateFrom,
  startDateTo: criteria.startDateTo,
  endDateFrom: criteria.endDateFrom,
  endDateTo: criteria.endDateTo,
  pageNumber: criteria.pageNumber,
  pageSize: criteria.pageSize,
});

export const rentalService = {
  findById(id) {
    return request({ url: api.rentals.byId(id), method: 'GET' });
  },
  search(criteria = {}) {
    return request({ url: api.rentals.search, method: 'GET', params: searchParams(criteria) });
  },
  create(data) {
    return request({ url: api.rentals.create, method: 'POST', data });
  },
  update(id, data) {
    return request({ url: api.rentals.update(id), method: 'PUT', data });
  },
  async delete(id) {
    await request({ url: api.rentals.delete(id), method: 'DELETE' });
  },
  fromReservation(data) {
    return request({ url: api.rentals.fromReservation, method: 'POST', data });
  },
  autoConvert(data) {
    return request({ url: api.rentals.autoConvert, method: 'POST', data });
  },
  complete(id) {
    return request({ url: api.rentals.complete(id), method: 'POST' });
  },
  existsByReservation(reservationId) {
    return request({ url: api.rentals.existsByReservation(reservationId), method: 'GET' });
  },
};

export default rentalService;
