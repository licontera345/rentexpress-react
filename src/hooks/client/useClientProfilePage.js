import AddressService from '../../api/services/AddressService';
import UserService from '../../api/services/UserService';
import { resolveAddress, resolveUserId } from '../../utils/ui/uiUtils';
import useProfileForm from '../profile/useProfileForm';
import useCities from '../location/useCities';
import useProvinces from '../location/useProvinces';
import { useAuth } from '../core/useAuth';
import {
  CLIENT_PROFILE_TRIM_FIELDS,
  getInitialFormData,
  getBaselineData,
  checkDirty,
  validate,
  submit,
} from '../../utils/client/clientProfileFormHelpers';
import { useEffect, useCallback } from 'react';

// Normaliza un objeto address de la API (acepta camelCase, snake_case y objetos anidados).
const normalizeAddressForForm = (address) => {
  if (!address || typeof address !== 'object') return null;

  const provinceId =
    address.provinceId ??
    address.province_id ??
    (address.province && (address.province.id ?? address.province.provinceId)) ??
    null;

  const cityId =
    address.cityId ??
    address.city_id ??
    (address.city && (address.city.id ?? address.city.cityId)) ??
    (address.locality && (address.locality.id ?? address.locality.cityId)) ??
    (address.municipality && (address.municipality.id ?? address.municipality.cityId)) ??
    null;

  return {
    street: address.street ?? '',
    number: address.number ?? '',
    provinceId,
    cityId,
  };
};

// Normaliza el usuario de la API para tener addressId (camelCase o snake_case).
const normalizeUserAddressId = (data) => {
  if (!data || typeof data !== 'object') return data;
  const addressId = data.addressId ?? data.address_id ?? null;
  if (addressId == null) return data;
  return { ...data, addressId };
};

// Hook para la página de perfil del cliente.
export function useClientProfilePage() {
  const { user, token, updateUser } = useAuth();
  const entityId = resolveUserId(user);

  // Al abrir el perfil: cargar usuario completo y, si tiene addressId pero no address, recuperar la dirección.
  useEffect(() => {
    if (!token || !entityId) return;

    let isMounted = true;

    UserService.findById(entityId)
      .then((userData) => {
        if (!isMounted || !userData) return;

        const normalized = normalizeUserAddressId(userData);
        const addressId = normalized.addressId ?? normalized.address_id;

        // Si el usuario tiene addressId pero no tiene address embebido, recuperar la dirección.
        const hasAddress = Array.isArray(normalized.address)
          ? normalized.address.length > 0
          : normalized.address && typeof normalized.address === 'object';

        if (addressId && !hasAddress) {
          return AddressService.findById(addressId).then((addressData) => {
            if (!isMounted || !addressData) return;
            updateUser({ ...normalized, addressId, address: addressData });
          });
        }

        updateUser(normalized);
      })
      .catch(() => {});

    return () => { isMounted = false; };
  }, [token, entityId, updateUser]);

  const syncAddressToForm = useCallback((address) => {
    const n = normalizeAddressForForm(address);
    if (!n) return { street: '', number: '', provinceId: '', cityId: '' };
    return {
      street: n.street || '',
      number: n.number || '',
      provinceId: n.provinceId != null ? String(n.provinceId) : '',
      cityId: n.cityId != null ? String(n.cityId) : '',
    };
  }, []);

  const getChangeExtras = useCallback((name) => (name === 'provinceId' ? { cityId: '' } : {}), []);

  const fetchAddressById = useCallback((id) => AddressService.findById(id), []);

  // Obtiene las provincias.
  const { provinces, loading: loadingProvinces, error: provincesError } = useProvinces();
  // Usa el hook de formulario de perfil.
  const result = useProfileForm({
    profileType: 'client',
    entityType: 'user',
    getEntityId: resolveUserId,
    getInitialFormData,
    getBaselineData,
    trimFields: CLIENT_PROFILE_TRIM_FIELDS,
    checkDirty,
    getChangeExtras,
    validate,
    submit,
    useAddress: true,
    getResolvedAddress: resolveAddress,
    fetchAddress: fetchAddressById,
    syncAddressToForm,
    extraState: { provinces, cities: [] },
    extraUi: { loadingProvinces, loadingCities: false, provincesError, citiesError: null },
  });
  // Obtiene el identificador de la provincia.
  const provinceId = result.state.formData.provinceId;
  // Obtiene las ciudades.
  const { cities, loading: loadingCities, error: citiesError } = useCities(provinceId);
  // Estado y callbacks para el hook.
  return {
    ...result,
    state: { ...result.state, cities },
    ui: { ...result.ui, loadingCities, citiesError },
  };
}
