const normalizeLocale = (value) => (
  typeof value === 'string' ? value.trim().toLowerCase() : ''
);

const matchesLocale = (status, locale) => {
  const normalizedLocale = normalizeLocale(locale);
  if (!normalizedLocale) return true;
  if (!Array.isArray(status?.language) || status.language.length === 0) return true;
  return status.language.some((language) => (
    normalizeLocale(language?.isoCode) === normalizedLocale
  ));
};

export const filterReservationStatusesByLocale = (statuses = [], locale) => {
  const seen = new Set();
  const list = Array.isArray(statuses) ? statuses : [];

  return list.filter((status) => {
    const statusId = status?.reservationStatusId ?? status?.id;
    if (statusId === null || statusId === undefined) return false;
    if (!matchesLocale(status, locale)) return false;
    const key = String(statusId);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
