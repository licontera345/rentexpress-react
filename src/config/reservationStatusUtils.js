// Normaliza el locale para comparaciones seguras.
const normalizeLocale = (value) => (
  typeof value === 'string' ? value.trim().toLowerCase() : ''
);

// Determina si un estado coincide con el locale solicitado.
const matchesLocale = (status, locale) => {
  const normalizedLocale = normalizeLocale(locale);
  if (!normalizedLocale) return true;
  if (!Array.isArray(status?.language) || status.language.length === 0) return true;
  return status.language.some((language) => (
    normalizeLocale(language?.isoCode) === normalizedLocale
  ));
};

// Filtra estados de reserva por locale y elimina duplicados.
export const filterReservationStatusesByLocale = (statuses = [], locale) => {
  const seen = new Set();
  const list = Array.isArray(statuses) ? statuses : [];

  return list.filter((status) => {
    const statusId = status?.reservationStatusId;
    if (statusId === null || statusId === undefined) return false;
    if (!matchesLocale(status, locale)) return false;
    const key = String(statusId);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
