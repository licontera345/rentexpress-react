import Config from '../../config/apiConfig';
import { request } from '../axiosClient';

const get = (url) => request({ url, method: 'GET' });

const catalog = {
  roles: {
    getAll() {
      return get(Config.ROLES.ALL);
    },
    getById(id) {
      return get(Config.ROLES.BY_ID(id));
    }
  },
  provinces: {
    findAll() {
      return get(Config.PROVINCES.ALL);
    },
    findById(id) {
      return get(Config.PROVINCES.BY_ID(id));
    }
  },
  cities: {
    findAll() {
      return get(Config.CITIES.ALL);
    },
    findById(id) {
      return get(Config.CITIES.BY_ID(id));
    },
    findByProvinceId(provinceId) {
      return get(Config.CITIES.BY_PROVINCE(provinceId));
    }
  },
  headquarters: {
    getAll() {
      return get(Config.HEADQUARTERS.ALL);
    },
    getById(id) {
      return get(Config.HEADQUARTERS.BY_ID(id));
    }
  },
  vehicleStatuses: {
    getAll(isoCode = 'es') {
      return get(Config.VEHICLE_STATUSES.ALL(isoCode));
    },
    getById(id, isoCode = 'es') {
      return get(Config.VEHICLE_STATUSES.BY_ID(id, isoCode));
    }
  },
  reservationStatuses: {
    getAll(isoCode = 'es') {
      return get(Config.RESERVATION_STATUSES.ALL(isoCode));
    },
    getById(id, isoCode = 'es') {
      return get(Config.RESERVATION_STATUSES.BY_ID(id, isoCode));
    }
  },
  rentalStatuses: {
    getAll(isoCode = 'es') {
      return get(Config.RENTAL_STATUSES.ALL(isoCode));
    },
    getById(id, isoCode = 'es') {
      return get(Config.RENTAL_STATUSES.BY_ID(id, isoCode));
    }
  },
  vehicleCategories: {
    getAll(isoCode = 'es') {
      return get(Config.VEHICLE_CATEGORIES.ALL(isoCode));
    },
    getById(id, isoCode = 'es') {
      return get(Config.VEHICLE_CATEGORIES.BY_ID(id, isoCode));
    }
  }
};

export const RoleService = catalog.roles;
export const ProvinceService = catalog.provinces;
export const CityService = catalog.cities;
export const SedeService = catalog.headquarters;
export const VehicleStatusService = catalog.vehicleStatuses;
export const ReservationStatusService = catalog.reservationStatuses;
export const RentalStatusService = catalog.rentalStatuses;
export const VehicleCategoryService = catalog.vehicleCategories;

export default catalog;
