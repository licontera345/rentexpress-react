import { PAGINATION } from '../../constants';

export const EMPLOYEE_RENTAL_DEFAULT_FILTERS = {
  rentalId: '',
  rentalStatusId: '',
  pickupHeadquartersId: '',
  returnHeadquartersId: '',
  startDateEffectiveFrom: '',
  startDateEffectiveTo: '',
  endDateEffectiveFrom: '',
  endDateEffectiveTo: ''
};

export const buildRentalSearchCriteria = (filters, pageNumber) => ({
  rentalId: filters.rentalId || undefined,
  rentalStatusId: filters.rentalStatusId || undefined,
  pickupHeadquartersId: filters.pickupHeadquartersId || undefined,
  returnHeadquartersId: filters.returnHeadquartersId || undefined,
  startDateEffectiveFrom: filters.startDateEffectiveFrom || undefined,
  startDateEffectiveTo: filters.startDateEffectiveTo || undefined,
  endDateEffectiveFrom: filters.endDateEffectiveFrom || undefined,
  endDateEffectiveTo: filters.endDateEffectiveTo || undefined,
  pageNumber,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE
});
