import { PAGINATION } from '../../constants';

export const buildVehicleSearchCriteria = (
  filters,
  { includeIdentifiers = false, includeStatus = false, includeActiveStatus = false, pageNumber, pageSize } = {}
) => {
  const criteria = {
    brand: filters.brand?.trim() || undefined,
    model: filters.model?.trim() || undefined,
    categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
    currentHeadquartersId: filters.currentHeadquartersId ? Number(filters.currentHeadquartersId) : undefined,
    dailyPriceMin: filters.minPrice ? Number(filters.minPrice) : undefined,
    dailyPriceMax: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    manufactureYearFrom: filters.manufactureYearFrom ? Number(filters.manufactureYearFrom) : undefined,
    manufactureYearTo: filters.manufactureYearTo ? Number(filters.manufactureYearTo) : undefined,
    currentMileageMin: filters.currentMileageMin ? Number(filters.currentMileageMin) : undefined,
    currentMileageMax: filters.currentMileageMax ? Number(filters.currentMileageMax) : undefined,
  };
  if (includeIdentifiers) {
    criteria.licensePlate = filters.licensePlate?.trim() || undefined;
    criteria.vinNumber = filters.vinNumber?.trim() || undefined;
  }
  if (includeStatus) criteria.vehicleStatusId = filters.vehicleStatusId ? Number(filters.vehicleStatusId) : undefined;
  if (includeActiveStatus) criteria.activeStatus = filters.activeStatus === '' ? undefined : Number(filters.activeStatus);
  if (pageNumber !== undefined) criteria.pageNumber = pageNumber;
  if (pageSize !== undefined) criteria.pageSize = pageSize;
  return criteria;
};

export const buildEmployeeVehicleSearchCriteria = (filters, pageNumber) =>
  buildVehicleSearchCriteria(filters, {
    includeIdentifiers: true,
    includeStatus: true,
    includeActiveStatus: true,
    pageNumber,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  });
