// Normaliza sedes que pueden venir como array o como objeto.
const normalizeEntity = (value) => (Array.isArray(value) ? value[0] : value);

// Resuelve el nombre de la sede desde diferentes estructuras posibles.
const resolveHeadquartersName = (headquarters) => {
  const normalized = normalizeEntity(headquarters) || {};
  return normalized.headquartersName || normalized.name || '';
};

// Construye una dirección legible combinando calle, número y ciudad/provincia.
const resolveHeadquartersAddress = (headquarters) => {
  const normalized = normalizeEntity(headquarters) || {};
  const address = normalizeEntity(
    normalized.address || normalized.addresses || normalized.addressList || normalized.addressDto
  );
  const addressLabel = normalized.addressName || address?.addressName || address?.fullAddress;
  const street = address?.street || address?.streetName || normalized.street || normalized.address?.street;
  const number = address?.number || address?.streetNumber || normalized.number;
  const cityName = address?.cityName
    || address?.city?.cityName
    || address?.city?.name
    || normalized.city?.cityName
    || normalized.city?.name
    || normalized.cityName;
  const provinceName = address?.provinceName
    || address?.province?.provinceName
    || address?.province?.name
    || normalized.province?.provinceName
    || normalized.province?.name
    || normalized.provinceName;
  const streetLine = addressLabel || [street, number].filter(Boolean).join(' ');
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
  const address = normalizeEntity(
    normalized.address || normalized.addresses || normalized.addressList || normalized.addressDto
  );
  return (
    address?.cityName
    || address?.city?.cityName
    || address?.city?.name
    || normalized.city?.cityName
    || normalized.city?.name
    || normalized.cityName
    || ''
  );
};
