const normalizeLocale = (value) => (
  typeof value === 'string' ? value.trim().toLowerCase() : ''
);

const resolveLanguageCodes = (status) => {
  if (Array.isArray(status?.language)) {
    return status.language.map((language) => language?.isoCode).filter(Boolean);
  }
  if (status?.language && typeof status.language === 'object') {
    return [status.language?.isoCode].filter(Boolean);
  }
  return [status?.isoCode, status?.languageIsoCode].filter(Boolean);
};

const matchesLocale = (status, locale) => {
  const normalizedLocale = normalizeLocale(locale);
  if (!normalizedLocale) return false;
  const codes = resolveLanguageCodes(status).map(normalizeLocale);
  return codes.includes(normalizedLocale);
};

export const filterReservationStatusesByLocale = (statuses = [], locale) => {
  const list = Array.isArray(statuses) ? statuses : [];
  const grouped = new Map();

  list.forEach((status) => {
    const statusId = status?.reservationStatusId ?? status?.id;
    if (statusId === null || statusId === undefined) return;
    const key = String(statusId);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(status);
  });

  return Array.from(grouped.values()).map((statusGroup) => (
    statusGroup.find((status) => matchesLocale(status, locale)) ?? statusGroup[0]
  ));
};
