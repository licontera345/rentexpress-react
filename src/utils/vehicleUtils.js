import { formatCurrency } from './formatters';
import { MESSAGES, STATUS_NAMES } from '../constants';
import {
  resolveCategoryLabel,
  resolveHeadquartersLabel,
  resolveStatusLabel
} from '../constants/vehicleDetailLabels';

// Formatea los datos de un vehículo para mostrar en el modal de detalle.
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
    categoryLabel: resolveCategoryLabel(vehicle, categoryMap),
    headquartersLabel: resolveHeadquartersLabel(vehicle, headquartersMap)
  };
};

// Obtiene las iniciales de un vehículo (marca y modelo).
export const getVehicleInitials = (vehicle) => {
  const brandInitial = vehicle?.brand?.[0] || 'V';
  const modelInitial = vehicle?.model?.[0] || 'C';
  return `${brandInitial}${modelInitial}`;
};

// Obtiene el label del estado de un vehículo.
export const getVehicleStatusLabel = (vehicle, statusMap) => {
  const status = Array.isArray(vehicle?.vehicleStatus)
    ? vehicle.vehicleStatus[0]
    : null;

  if (typeof status?.statusName === 'string' && status.statusName.trim()) {
    return status.statusName.trim();
  }

  const statusId = vehicle?.vehicleStatusId ?? status?.vehicleStatusId;
  if (Number.isFinite(statusId) && statusMap?.has(statusId)) {
    return statusMap.get(statusId);
  }

  return '';
};

// Resuelve el estado completo de un vehículo (label y clase CSS).
const DEFAULT_STATUS = { label: MESSAGES.NOT_AVAILABLE, class: 'status-inactive' };

export const resolveVehicleStatus = (vehicle, statusMap) => {
  const statusLabel = getVehicleStatusLabel(vehicle, statusMap);
  const normalizedStatus = statusLabel.toLowerCase();

  if (normalizedStatus && STATUS_NAMES[normalizedStatus]) {
    return {
      label: statusLabel,
      class: STATUS_NAMES[normalizedStatus]
    };
  }

  return DEFAULT_STATUS;
};

// Formatea los datos de un vehículo para mostrar en el listado.
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

// Construye el label completo de un vehículo para mostrar en selects/opciones.
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

// Construye el título del vehículo (marca y modelo).
export const buildVehicleTitle = (vehicle, { fallback = null } = {}) => {
  const brand = vehicle?.brand;
  const model = vehicle?.model;
  const title = [brand, model].filter(Boolean).join(' ').trim();
  return title || fallback || MESSAGES.NOT_AVAILABLE_SHORT;
};

// Filtra vehículos por término de búsqueda (marca, modelo, placa, año).
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

// Extrae marcas únicas de una lista de vehículos, ordenadas alfabéticamente.
export const getUniqueBrandsFromVehicles = (vehicles) => {
  if (!Array.isArray(vehicles)) return [];
  const uniqueBrands = new Set();
  vehicles.forEach((vehicle) => {
    if (vehicle?.brand) uniqueBrands.add(vehicle.brand);
  });
  return Array.from(uniqueBrands).sort((a, b) => a.localeCompare(b));
};
