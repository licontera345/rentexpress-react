import { getHeadquartersOptionLabel } from '../../constants';
import { MESSAGES } from '../../constants';
import AddressService from '../../api/services/AddressService';

// Indica si la sede ya incluye datos de dirección embebidos.
export const hasEmbeddedAddress = (headquarters) => {
  if (!headquarters) return false;
  return Array.isArray(headquarters.addresses) && headquarters.addresses.length > 0;
};

// Resuelve el ID de dirección en distintas formas posibles del objeto sede.
export const resolveAddressId = (headquarters) => {
  if (!headquarters) return null;
  return headquarters.addressId ?? null;
};

// Enriquece sedes obteniendo direcciones faltantes vía API.
export const enrichHeadquartersWithAddresses = async (items) => {
  if (!Array.isArray(items) || items.length === 0) return [];

  const addressRequests = new Map();

  const enriched = await Promise.all(
    items.map(async (headquarters) => {
      if (!headquarters || hasEmbeddedAddress(headquarters)) {
        return headquarters;
      }

      const addressId = resolveAddressId(headquarters);
      if (!addressId) {
        return headquarters;
      }

      let requestPromise = addressRequests.get(addressId);
      if (!requestPromise) {
        requestPromise = AddressService.findByIdOpen(addressId);
        addressRequests.set(addressId, requestPromise);
      }

      try {
        const address = await requestPromise;
        return address ? { ...headquarters, addresses: [address] } : headquarters;
      } catch {
        return headquarters;
      }
    })
  );

  return enriched;
};

// Construye un Map(id -> label) a partir de un array de sedes.
export const buildHeadquartersMap = (headquarters) => {
  if (!headquarters || !Array.isArray(headquarters)) {
    return new Map();
  }
  return headquarters.reduce((map, hq) => {
    const id = hq?.id;
    const label = getHeadquartersOptionLabel(hq);
    if (id != null && label) {
      map.set(Number(id), label);
    }
    return map;
  }, new Map());
};

// Transforma un array de sedes en opciones para selects.
// HeadquartersDTO: id, name. valueKey: 'id' para filtros; por defecto también id.
export const buildHeadquartersOptions = (headquarters, { valueKey } = {}) => {
  if (!headquarters || !Array.isArray(headquarters)) {
    return [];
  }
  return headquarters.map((hq) => ({
    value: hq.id,
    label: getHeadquartersOptionLabel(hq)
  }));
};

export const headquartersOptionsForFilters = (headquarters) =>
  buildHeadquartersOptions(headquarters, { valueKey: 'id' });

// Encuentra una sede por ID en un array de sedes.
export const findHeadquartersById = (headquarters, id) => {
  if (!headquarters || !id) return null;
  return headquarters.find((hq) => String(hq.id) === String(id)) || null;
};

// Obtiene el label de una sede o un fallback.
export const getHeadquartersLabel = (headquarters, { fallback = MESSAGES.NOT_AVAILABLE_SHORT } = {}) => {
  if (!headquarters) return fallback;
  return getHeadquartersOptionLabel(headquarters) || fallback;
};
