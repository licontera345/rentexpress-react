import Config from '../../config/apiConfig';
import { buildParams, request } from '../axiosClient';

const RentalService = {
  findById(id) {
    return request({
      url: Config.RENTALS.BY_ID(id),
      method: 'GET'
    });
  },

  search(criteria = {}) {
    return request({
      url: Config.RENTALS.SEARCH,
      method: 'GET',
      params: buildParams({
        rentalId: criteria.rentalId,
        rentalStatusId: criteria.rentalStatusId,
        userId: criteria.userId,
        pickupHeadquartersId: criteria.pickupHeadquartersId,
        returnHeadquartersId: criteria.returnHeadquartersId,
        startDateEffectiveFrom: criteria.startDateEffectiveFrom,
        startDateEffectiveTo: criteria.startDateEffectiveTo,
        endDateEffectiveFrom: criteria.endDateEffectiveFrom,
        endDateEffectiveTo: criteria.endDateEffectiveTo,
        totalCostMin: criteria.totalCostMin,
        totalCostMax: criteria.totalCostMax,
        startDateEffective: criteria.startDateEffective,
        endDateEffective: criteria.endDateEffective,
        initialKm: criteria.initialKm,
        finalKm: criteria.finalKm,
        totalCost: criteria.totalCost,
        pageNumber: criteria.pageNumber,
        pageSize: criteria.pageSize
      })
    });
  },

  create(rental) {
    return request({
      url: Config.RENTALS.CREATE,
      method: 'POST',
      data: rental
    });
  },

  update(id, rental) {
    return request({
      url: Config.RENTALS.UPDATE(id),
      method: 'PUT',
      data: rental
    });
  },

  async delete(id) {
    await request({
      url: Config.RENTALS.DELETE(id),
      method: 'DELETE'
    });
    return true;
  },

  createFromReservation(reservation) {
    return request({
      url: Config.RENTALS.FROM_RESERVATION,
      method: 'POST',
      data: reservation
    });
  },

  existsByReservation(reservationId) {
    return request({
      url: Config.RENTALS.EXISTS_BY_RESERVATION(reservationId),
      method: 'GET'
    });
  },

  completeRental(id, data = {}) {
    return request({
      url: Config.RENTALS.COMPLETE(id),
      method: 'POST',
      data
    });
  }
};

export default RentalService;
