// Helpers to build navigation state for reservation flows.

const buildVehicleSummary = (vehicle = {}) => ({
  brand: vehicle.brand ?? '',
  model: vehicle.model ?? '',
  licensePlate: vehicle.licensePlate ?? '',
  manufactureYear: vehicle.manufactureYear ?? '',
  currentMileage: vehicle.currentMileage ?? ''
});

const buildBaseReservationState = (vehicle = {}) => ({
  vehicleId: vehicle.vehicleId ?? '',
  dailyPrice: vehicle.dailyPrice ?? '',
  vehicleSummary: buildVehicleSummary(vehicle),
  currentHeadquartersId: vehicle.currentHeadquartersId ?? ''
});

export const buildReservationState = ({ vehicle = {}, criteria } = {}) => {
  const baseState = buildBaseReservationState(vehicle);

  if (!criteria) {
    return baseState;
  }

  return {
    ...baseState,
    pickupHeadquartersId: criteria.currentHeadquartersId ?? criteria.pickupHeadquartersId ?? '',
    returnHeadquartersId: criteria.returnHeadquartersId ?? '',
    // Mantiene alias start/end para compatibilidad con formularios de reserva.
    startDate: criteria.pickupDate ?? criteria.startDate ?? '',
    startTime: criteria.pickupTime ?? criteria.startTime ?? '',
    endDate: criteria.returnDate ?? criteria.endDate ?? '',
    endTime: criteria.returnTime ?? criteria.endTime ?? '',
    pickupDate: criteria.pickupDate ?? '',
    pickupTime: criteria.pickupTime ?? '',
    returnDate: criteria.returnDate ?? '',
    returnTime: criteria.returnTime ?? ''
  };
};
