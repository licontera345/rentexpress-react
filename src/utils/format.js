/**
 * Helpers de presentación (solo para UI). No alteran datos de la API.
 */
export function formatFullName(row, fallback = '—') {
  const parts = [row?.firstName, row?.lastName1, row?.lastName2].filter(Boolean);
  return parts.length ? parts.join(' ') : (row?.username ?? row?.employeeName ?? fallback);
}

export function isActiveStatus(value) {
  return Number(value) === 1 || value === true || value === '1';
}
