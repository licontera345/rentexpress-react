const normalizeEntity = (value) => (Array.isArray(value) ? value[0] : value);

const resolveHeadquartersName = (headquarters) => {
  const normalized = normalizeEntity(headquarters) || {};
  return normalized.headquartersName || normalized.name || '';
};

const resolveHeadquartersAddress = (headquarters) => {
  const normalized = normalizeEntity(headquarters) || {};
  const address = normalizeEntity(normalized.address || normalized.addresses);
  const addressLabel = normalized.addressName || address?.addressName;
  const street = address?.street || normalized.address?.street;
  const number = address?.number;
  const cityName = address?.cityName || normalized.city?.cityName || normalized.cityName;
  const provinceName = address?.provinceName || normalized.province?.provinceName || normalized.provinceName;
  const streetLine = addressLabel || [street, number].filter(Boolean).join(' ');
  const locationLine = [cityName, provinceName].filter(Boolean).join(', ');
  return [streetLine, locationLine].filter(Boolean).join(', ');
};

export const getHeadquartersOptionLabel = (headquarters) => {
  const name = resolveHeadquartersName(headquarters);
  const address = resolveHeadquartersAddress(headquarters);

  if (name && address) {
    return `${name} - ${address}`;
  }

  return name || address || '';
};

