import { PAGINATION } from '../../constants';
import { normalizeIsoCodeForComparison } from '../../config/isoCode';

export const normalizeReservationStatuses = (items, locale) => {
  const list = Array.isArray(items) ? items : [];
  const targetLocale = normalizeIsoCodeForComparison(locale);
  const byId = new Map();

  const score = (status) => {
    const hasName = typeof status?.statusName === 'string' && status.statusName.trim() ? 1 : 0;
    const langs = Array.isArray(status?.language) ? status.language : [];
    const matches = targetLocale
      ? langs.some((l) => normalizeIsoCodeForComparison(l?.isoCode) === targetLocale)
      : false;
    return (matches ? 10 : 0) + hasName;
  };

  for (const status of list) {
    const id = status?.reservationStatusId;
    if (id == null) continue;
    const key = Number(id);
    const existing = byId.get(key);
    if (!existing || score(status) > score(existing)) {
      byId.set(key, status);
    }
  }

  return Array.from(byId.values());
};

export const EMPLOYEE_RESERVATION_DEFAULT_FILTERS = {
  reservationId: '',
  vehicleId: '',
  userId: '',
  reservationStatusId: '',
  pickupHeadquartersId: '',
  returnHeadquartersId: '',
  startDateFrom: '',
  startDateTo: '',
  endDateFrom: '',
  endDateTo: ''
};

export const buildReservationSearchCriteria = (filters, pageNumber) => ({
  reservationId: filters.reservationId || undefined,
  vehicleId: filters.vehicleId || undefined,
  userId: filters.userId || undefined,
  reservationStatusId: filters.reservationStatusId || undefined,
  pickupHeadquartersId: filters.pickupHeadquartersId || undefined,
  returnHeadquartersId: filters.returnHeadquartersId || undefined,
  startDateFrom: filters.startDateFrom || undefined,
  startDateTo: filters.startDateTo || undefined,
  endDateFrom: filters.endDateFrom || undefined,
  endDateTo: filters.endDateTo || undefined,
  pageNumber,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE
});

export const EMPLOYEE_RESERVATION_FORM_INITIAL_DATA = {
  vehicleId: '',
  userId: '',
  pickupHeadquartersId: '',
  returnHeadquartersId: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  reservationStatusId: ''
};
