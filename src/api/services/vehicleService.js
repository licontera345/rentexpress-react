import api from '../../config/api.js';
import { request, buildParams } from '../axiosClient.js';

const searchParams = (criteria) => buildParams({
  vehicleId: criteria.vehicleId,
  vehicleStatusId: criteria.vehicleStatusId,
  categoryId: criteria.categoryId,
  currentHeadquartersId: criteria.currentHeadquartersId,
  brand: criteria.brand,
  model: criteria.model,
  licensePlate: criteria.licensePlate,
  vinNumber: criteria.vinNumber,
  manufactureYearFrom: criteria.manufactureYearFrom,
  manufactureYearTo: criteria.manufactureYearTo,
  dailyPriceMin: criteria.dailyPriceMin,
  dailyPriceMax: criteria.dailyPriceMax,
  currentMileageMin: criteria.currentMileageMin,
  currentMileageMax: criteria.currentMileageMax,
  activeStatus: criteria.activeStatus,
  pageNumber: criteria.pageNumber,
  pageSize: criteria.pageSize,
  availableFrom: criteria.availableFrom,
  availableTo: criteria.availableTo,
});

export const vehicleService = {
  findById(id) {
    return request({ url: api.vehicles.byId(id), method: 'GET' });
  },
  search(criteria = {}) {
    return request({ url: api.vehicles.search, method: 'GET', params: searchParams(criteria) });
  },
  create(data) {
    return request({ url: api.vehicles.create, method: 'POST', data });
  },
  update(id, data) {
    return request({ url: api.vehicles.update(id), method: 'PUT', data });
  },
  async delete(id) {
    await request({ url: api.vehicles.delete(id), method: 'DELETE' });
  },
};

export default vehicleService;
