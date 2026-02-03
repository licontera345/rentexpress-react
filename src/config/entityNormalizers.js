export const normalize = (value) => (Array.isArray(value) ? value[0] : value);

const getValueByPath = (entity, path) => {
  if (!entity || !path) return undefined;
  return path.split('.').reduce((current, key) => current?.[key], entity);
};

export const getId = (entity, ...keys) => {
  const normalized = normalize(entity);
  for (const key of keys) {
    const value = getValueByPath(normalized, key);
    if (value != null) {
      return Number(value);
    }
  }
  return null;
};

export const getName = (entity, ...keys) => {
  const normalized = normalize(entity);
  for (const key of keys) {
    const value = getValueByPath(normalized, key);
    if (value) {
      return String(value);
    }
  }
  return '';
};
