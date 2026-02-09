// Utilities for vehicle status labels and lookup.

export const DEFAULT_AVAILABLE_STATUS_LABELS = ['available', 'disponible'];

const normalizeStatusLabel = (value) => (
  typeof value === 'string' ? value.trim().toLowerCase() : ''
);

export const getAvailableStatusId = (statuses = [], labels = DEFAULT_AVAILABLE_STATUS_LABELS) => {
  const availableLabels = new Set(labels.map(normalizeStatusLabel).filter(Boolean));
  if (!availableLabels.size) {
    return undefined;
  }

  const normalizedStatuses = statuses.map((status) => ({
    id: status.vehicleStatusId ?? status.id,
    name: normalizeStatusLabel(status.statusName ?? status.name)
  }));

  const availableStatus = normalizedStatuses.find((status) => availableLabels.has(status.name));
  return availableStatus?.id;
};
