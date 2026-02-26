export const normalizeDateInput = (value) => {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue) return '';
    if (trimmedValue.includes('T')) return trimmedValue.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) return trimmedValue;
    const parsed = new Date(trimmedValue);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }
  return '';
};

export const normalizeTimeInput = (value) => {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(11, 16);
  }
  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue) return '';
    if (trimmedValue.includes('T')) {
      const timePart = trimmedValue.split('T')[1];
      return timePart ? timePart.slice(0, 5) : '';
    }
    if (/^\d{2}:\d{2}/.test(trimmedValue)) return trimmedValue.slice(0, 5);
    const parsed = new Date(trimmedValue);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(11, 16);
  }
  return '';
};
