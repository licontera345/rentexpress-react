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
import { useEffect, useCallback, useState } from 'react';

const normalizeAddressForForm = (address) => {
  if (!address || typeof address !== 'object') return null;
  return {
    street: address.street ?? '',
    number: address.number ?? '',
    provinceId: address.provinceId ?? null,
    cityId: address.cityId ?? null,
  };
};

const normalizeUserAddressId = (data) => {
  if (!data || typeof data !== 'object') return data;
  const addressId = data.addressId;
  if (addressId == null) return data;
  return { ...data, addressId };
};

export function useClientProfilePage() {
  const { user, token, updateUser } = useAuth();
  const entityId = resolveUserId(user);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!token || !entityId) {
      setLoadingProfile(false);
      return;
    }

    let isMounted = true;
    setLoadingProfile(true);

    UserService.findById(entityId)
      .then((userData) => {
        if (!isMounted || !userData) return;

        const normalized = normalizeUserAddressId(userData);
        const addressId = normalized.addressId;
        const hasAddress = Array.isArray(normalized.address) && normalized.address.length > 0;

        if (addressId && !hasAddress) {
          return AddressService.findById(addressId).then((addressData) => {
            if (!isMounted || !addressData) return;
            updateUser({ ...normalized, addressId, address: addressData });
          });
        }

        updateUser(normalized);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingProfile(false);
      });

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

  const { provinces, loading: loadingProvinces, error: provincesError } = useProvinces();
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
  const provinceId = result.state.formData.provinceId;
  const { cities, loading: loadingCities, error: citiesError } = useCities(provinceId);

  return {
    ...result,
    state: { ...result.state, cities },
    ui: { ...result.ui, loadingCities, citiesError },
    loadingProfile,
  };
}
