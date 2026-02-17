import AddressService from '../../api/services/AddressService';
import { resolveAddress, resolveUserId } from '../../utils/uiUtils';
import useProfileForm from '../profile/useProfileForm';
import useCities from '../location/useCities';
import useProvinces from '../location/useProvinces';
import {
  CLIENT_PROFILE_TRIM_FIELDS,
  getInitialFormData,
  getBaselineData,
  checkDirty,
  validate,
  submit,
} from '../../utils/clientProfileFormHelpers';

// Hook para la página de perfil del cliente.
export function useClientProfilePage() {
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
    getChangeExtras: (name) => (name === 'provinceId' ? { cityId: '' } : {}),
    validate,
    submit,
    useAddress: true,
    getResolvedAddress: resolveAddress,
    fetchAddress: (id) => AddressService.findById(id),
    syncAddressToForm: (address) => ({
      street: address.street || '',
      number: address.number || '',
      provinceId: address.provinceId ? String(address.provinceId) : '',
      cityId: address.cityId ? String(address.cityId) : '',
    }),
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
