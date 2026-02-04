// Normaliza entidades que pueden venir como array o como objeto individual.
export const normalize = (value) => (Array.isArray(value) ? value[0] : value);

// Obtiene un valor anidado usando una ruta tipo "prop.subprop".
const getValueByPath = (entity, path) => {
  if (!entity || !path) return undefined;
  return path.split('.').reduce((current, key) => current?.[key], entity);
};

// Extrae un id intentando múltiples claves posibles.
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

// Extrae un nombre intentando múltiples claves posibles.
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
