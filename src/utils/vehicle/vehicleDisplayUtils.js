import { formatCurrency } from '../form/formatters';
import { MESSAGES, STATUS_NAMES, VEHICLE_STATUS } from '../../constants';
import { getHeadquartersOptionLabel } from '../../constants';

export const buildVehicleStatusMap = (statuses) => {
  if (!statuses || !Array.isArray(statuses)) return new Map();
  return new Map(statuses.map((status) => [status.vehicleStatusId, status.statusName]));
};

export const resolveStatusLabel = (vehicle, statusMap) => {
  const status = Array.isArray(vehicle?.vehicleStatus) ? vehicle.vehicleStatus[0] : null;
  if (typeof status?.statusName === 'string' && status.statusName.trim()) {
    return status.statusName.trim();
  }
  const statusId = vehicle?.vehicleStatusId ?? status?.vehicleStatusId;
  if (Number.isFinite(statusId) && statusMap?.has(statusId)) return statusMap.get(statusId);
  return MESSAGES.NOT_AVAILABLE_SHORT;
};

export const resolveCategoryLabel = (vehicle, categoryMap) => {
  const category = Array.isArray(vehicle?.vehicleCategory) ? vehicle.vehicleCategory[0] : null;
  if (typeof category?.categoryName === 'string' && category.categoryName.trim()) {
    return category.categoryName.trim();
  }
  const categoryId = vehicle?.categoryId ?? category?.categoryId;
  if (Number.isFinite(categoryId) && categoryMap?.has(categoryId)) return categoryMap.get(categoryId);
  return MESSAGES.NOT_AVAILABLE_SHORT;
};

export const resolveHeadquartersLabel = (vehicle, headquartersMap) => {
  const headquarters = Array.isArray(vehicle?.currentHeadquarters) ? vehicle.currentHeadquarters[0] : null;
  const label = getHeadquartersOptionLabel(headquarters);
  if (label) return label;
  const headquartersId = vehicle?.currentHeadquartersId ?? headquarters?.id;
  if (Number.isFinite(headquartersId) && headquartersMap?.has(headquartersId)) {
    return headquartersMap.get(headquartersId);
  }
  return MESSAGES.NOT_AVAILABLE_SHORT;
};

export const formatVehicleForDetail = (vehicle, { categoryMap, headquartersMap, statusMap }) => {
  if (!vehicle) return null;

  const formattedMileage = vehicle.currentMileage !== undefined
    ? vehicle.currentMileage.toLocaleString()
    : MESSAGES.NOT_AVAILABLE_SHORT;

  const priceDisplay = formatCurrency(vehicle.dailyPrice, {
    fallback: MESSAGES.NOT_AVAILABLE_SHORT
  });

  return {
    brand: vehicle.brand,
    model: vehicle.model,
    initials: `${vehicle.brand?.charAt(0) ?? ''}${vehicle.model?.charAt(0) ?? ''}`,
    manufactureYear: vehicle.manufactureYear,
    licensePlate: vehicle.licensePlate ?? MESSAGES.NOT_AVAILABLE_SHORT,
    vinNumber: vehicle.vinNumber ?? MESSAGES.NOT_AVAILABLE_SHORT,
    priceDisplay,
    formattedMileage,
    statusLabel: resolveStatusLabel(vehicle, statusMap),
    isAvailable: vehicle.vehicleStatusId === VEHICLE_STATUS.AVAILABLE_ID,
    categoryLabel: resolveCategoryLabel(vehicle, categoryMap),
    headquartersLabel: resolveHeadquartersLabel(vehicle, headquartersMap)
  };
};

export const getVehicleInitials = (vehicle) => {
  const brandInitial = vehicle?.brand?.[0] || 'V';
  const modelInitial = vehicle?.model?.[0] || 'C';
  return `${brandInitial}${modelInitial}`;
};

const DEFAULT_STATUS = { label: MESSAGES.NOT_AVAILABLE, class: 'status-inactive' };

export const resolveVehicleStatus = (vehicle, statusMap) => {
  const statusLabel = resolveStatusLabel(vehicle, statusMap) || '';
  const normalizedStatus = statusLabel.toLowerCase();

  if (normalizedStatus && STATUS_NAMES[normalizedStatus]) {
    return {
      label: statusLabel,
      class: STATUS_NAMES[normalizedStatus]
    };
  }

  return DEFAULT_STATUS;
};

export const formatVehicleListItemData = (vehicle = {}, statusMap) => {
  const brand = vehicle.brand ?? '';
  const model = vehicle.model ?? '';
  const title = [brand, model].filter(Boolean).join(' ').trim() || MESSAGES.NOT_AVAILABLE_SHORT;

  return {
    status: resolveVehicleStatus(vehicle, statusMap),
    vehicleId: vehicle.vehicleId ?? null,
    mileage: vehicle.currentMileage ?? null,
    year: vehicle.manufactureYear ?? MESSAGES.NOT_AVAILABLE_SHORT,
    vin: vehicle.vinNumber ?? MESSAGES.NOT_AVAILABLE_SHORT,
    licensePlate: vehicle.licensePlate ?? MESSAGES.NOT_AVAILABLE_SHORT,
    title
  };
};

export const buildVehicleLabel = (vehicle, { includePlate = false, fallback = null } = {}) => {
  const brand = vehicle?.brand;
  const model = vehicle?.model;
  const plate = vehicle?.licensePlate;

  const nameParts = [brand, model].filter(Boolean);
  const name = nameParts.length > 0 ? nameParts.join(' ').trim() : null;

  if (!name && !plate) {
    return fallback || MESSAGES.NOT_AVAILABLE_SHORT;
  }

  if (includePlate && plate) {
    return name ? `${name} · ${plate}` : plate;
  }

  return name || plate || fallback || MESSAGES.NOT_AVAILABLE_SHORT;
};

export const buildVehicleTitle = (vehicle, { fallback = null } = {}) => {
  const brand = vehicle?.brand;
  const model = vehicle?.model;
  const title = [brand, model].filter(Boolean).join(' ').trim();
  return title || fallback || MESSAGES.NOT_AVAILABLE_SHORT;
};

export const filterVehiclesBySearchTerm = (vehicles, searchTerm) => {
  const query = (searchTerm || '').trim().toLowerCase();
  if (!query) return vehicles || [];
  if (!Array.isArray(vehicles)) return [];

  return vehicles.filter((vehicle) => {
    const searchableText = [
      vehicle?.brand,
      vehicle?.model,
      vehicle?.licensePlate,
      vehicle?.manufactureYear
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return searchableText.includes(query);
  });
};

export const getUniqueBrandsFromVehicles = (vehicles) => {
  if (!Array.isArray(vehicles)) return [];
  const uniqueBrands = new Set();
  vehicles.forEach((vehicle) => {
    if (vehicle?.brand) uniqueBrands.add(vehicle.brand);
  });
  return Array.from(uniqueBrands).sort((a, b) => a.localeCompare(b));
};
