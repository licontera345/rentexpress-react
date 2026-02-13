// Utilidades para estados de vehículos.
// Nota: el frontend NO debe inferir reglas de negocio (como "available") por statusName;
// cualquier semántica estable debe venir por contrato del backend.

// Construye un Map de estados de vehículos para búsqueda rápida.
export const buildVehicleStatusMap = (statuses) => {
  if (!statuses || !Array.isArray(statuses)) {
    return new Map();
  }
  return new Map(
    statuses.map((status) => [status.vehicleStatusId, status.statusName])
  );
};

