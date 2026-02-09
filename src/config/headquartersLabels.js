// Normaliza sedes que pueden venir como array o como objeto.
const normalizeEntity = (value) => (Array.isArray(value) ? value[0] : value);

// Resuelve el nombre de la sede según el contrato de la API.
const resolveHeadquartersName = (headquarters) => {
  const normalized = normalizeEntity(headquarters) || {};
  return normalized.name || '';
};

// Construye una dirección legible con los campos definidos por la API.
const resolveHeadquartersAddress = (headquarters) => {
  const normalized = normalizeEntity(headquarters) || {};
  const address = normalizeEntity(normalized.addresses);
  const street = address?.street;
  const number = address?.number;
  const cityName = address?.cityName || normalized.city?.cityName;
  const provinceName = address?.provinceName || normalized.province?.provinceName;
  const streetLine = [street, number].filter(Boolean).join(' ');
  const locationLine = [cityName, provinceName].filter(Boolean).join(', ');
  return [streetLine, locationLine].filter(Boolean).join(', ');
};

// Etiqueta completa (nombre + dirección) para selects/listas.
export const getHeadquartersOptionLabel = (headquarters) => {
  const name = resolveHeadquartersName(headquarters);
  const address = resolveHeadquartersAddress(headquarters);

  if (name && address) {
    return `${name} - ${address}`;
  }

  return name || address || '';
};

// Devuelve solo el nombre de la sede.
export const getHeadquartersNameLabel = (headquarters) => resolveHeadquartersName(headquarters) || '';

// Devuelve solo la dirección de la sede.
export const getHeadquartersAddressLabel = (headquarters) => resolveHeadquartersAddress(headquarters) || '';

// Obtiene la ciudad de la sede, buscando en distintos campos posibles.
export const getHeadquartersCityName = (headquarters) => {
  const normalized = normalizeEntity(headquarters) || {};
  const address = normalizeEntity(normalized.addresses);
  return (
    address?.cityName
    || normalized.city?.cityName
    || ''
  );
};
