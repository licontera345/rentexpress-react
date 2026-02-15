import AddressService from '../../api/services/AddressService';
import UserService from '../../api/services/UserService';
import { DEFAULT_ACTIVE_STATUS, MESSAGES } from '../../constants';
import { resolveAddress, resolveUserId } from '../../utils/uiUtils';
import {
  trimValues,
  validateEmail,
  validatePasswordPair,
  validatePhone,
  validateRequired
} from '../../utils/profileFormUtils';
import useProfileForm from '../profile/useProfileForm';
import useCities from '../location/useCities';
import useProvinces from '../location/useProvinces';

const TRIM_FIELDS = [
  'firstName',
  'lastName1',
  'lastName2',
  'username',
  'email',
  'phone',
  'street',
  'number'
];

const getInitialFormData = (user, resolvedAddress) => ({
  firstName: user?.firstName || '',
  lastName1: user?.lastName1 || '',
  lastName2: user?.lastName2 || '',
  username: user?.username || '',
  email: user?.email || '',
  phone: user?.phone || '',
  birthDate: user?.birthDate || '',
  password: '',
  confirmPassword: '',
  street: resolvedAddress?.street || '',
  number: resolvedAddress?.number || '',
  provinceId: resolvedAddress?.provinceId ? String(resolvedAddress.provinceId) : '',
  cityId: resolvedAddress?.cityId ? String(resolvedAddress.cityId) : ''
});

const getBaselineData = (user, resolvedAddress) => ({
  firstName: (user?.firstName || '').trim(),
  lastName1: (user?.lastName1 || '').trim(),
  lastName2: (user?.lastName2 || '').trim(),
  username: (user?.username || '').trim(),
  email: (user?.email || '').trim(),
  phone: (user?.phone || '').trim(),
  birthDate: user?.birthDate || '',
  street: (resolvedAddress?.street || '').trim(),
  number: (resolvedAddress?.number || '').trim(),
  provinceId: resolvedAddress?.provinceId ? String(resolvedAddress.provinceId) : '',
  cityId: resolvedAddress?.cityId ? String(resolvedAddress.cityId) : ''
});

const checkDirty = (formData, baselineData, { profileImageFile, hasPasswordInput }) => {
  const trimmedData = trimValues(formData, TRIM_FIELDS);
  return (
    trimmedData.firstName !== baselineData.firstName ||
    trimmedData.lastName1 !== baselineData.lastName1 ||
    trimmedData.lastName2 !== baselineData.lastName2 ||
    trimmedData.username !== baselineData.username ||
    trimmedData.email !== baselineData.email ||
    trimmedData.phone !== baselineData.phone ||
    formData.birthDate !== baselineData.birthDate ||
    trimmedData.street !== baselineData.street ||
    trimmedData.number !== baselineData.number ||
    formData.provinceId !== baselineData.provinceId ||
    formData.cityId !== baselineData.cityId ||
    Boolean(profileImageFile) ||
    hasPasswordInput
  );
};

const validate = (formData, trimmedData, passwordValue, confirmValue, nextErrors) => {
  validateRequired(trimmedData.firstName, 'firstName', nextErrors);
  validateRequired(trimmedData.lastName1, 'lastName1', nextErrors);
  validateRequired(trimmedData.email, 'email', nextErrors);
  validateRequired(trimmedData.phone, 'phone', nextErrors);
  validateRequired(formData.birthDate, 'birthDate', nextErrors);
  validateRequired(trimmedData.username, 'username', nextErrors);
  validateRequired(trimmedData.street, 'street', nextErrors);
  validateRequired(trimmedData.number, 'number', nextErrors);
  validateRequired(formData.provinceId, 'provinceId', nextErrors);
  validateRequired(formData.cityId, 'cityId', nextErrors);
  validateEmail(trimmedData.email, nextErrors);
  validatePhone(trimmedData.phone, nextErrors);
  validatePasswordPair(passwordValue, confirmValue, nextErrors);
};

const submit = async (ctx) => {
  const {
    formData,
    trimmedData,
    passwordValue,
    profileImageFile,
    hasImage,
    uploadImage,
    removeImage,
    updateUser,
    user,
    entityId: userId,
    addressId,
    setAddressId,
    resetPasswordFields,
    setShowPasswordFields,
    setIsEditing,
    setProfileImageFile,
    setProfileImagePreview,
    setProfileImageError,
    setStatusMessage,
    MESSAGES
  } = ctx;

  let nextAddressId = addressId;
  let latestAddress = null;

  const addressPayload = {
    street: trimmedData.street,
    number: trimmedData.number,
    provinceId: Number(formData.provinceId),
    cityId: Number(formData.cityId)
  };

  if (nextAddressId) {
    try {
      latestAddress = await AddressService.update(nextAddressId, addressPayload);
    } catch (error) {
      if (error?.status !== 404) throw error;
      latestAddress = await AddressService.create(addressPayload);
    }
  } else {
    latestAddress = await AddressService.create(addressPayload);
  }

  nextAddressId = latestAddress?.id ?? latestAddress?.addressId ?? nextAddressId;
  setAddressId(nextAddressId);

  if (!userId) throw new Error(MESSAGES.ERROR_UPDATING);

  const payload = Object.assign(
    {},
    {
      username: trimmedData.username,
      firstName: trimmedData.firstName,
      lastName1: trimmedData.lastName1,
      lastName2: trimmedData.lastName2,
      email: trimmedData.email,
      phone: trimmedData.phone,
      birthDate: formData.birthDate,
      addressId: nextAddressId || undefined
    },
    passwordValue ? { password: passwordValue } : {},
    { activeStatus: user?.activeStatus ?? DEFAULT_ACTIVE_STATUS }
  );

  const updated = await UserService.update(userId, payload);

  if (profileImageFile) {
    if (hasImage) await removeImage();
    await uploadImage(profileImageFile);
  }

  const mergedUser = Object.assign(
    {},
    user || {},
    updated || payload,
    latestAddress ? { address: latestAddress, addressId: nextAddressId } : {}
  );

  updateUser(mergedUser);
  resetPasswordFields();
  setShowPasswordFields(false);
  setIsEditing(false);
  setProfileImageFile(null);
  setProfileImagePreview('');
  setProfileImageError(null);
  setStatusMessage(MESSAGES.PROFILE_UPDATED);
};

const useClientProfilePage = () => {
  const { provinces, loading: loadingProvinces, error: provincesError } = useProvinces();
  const result = useProfileForm({
    profileType: 'client',
    entityType: 'user',
    getEntityId: resolveUserId,
    getInitialFormData,
    getBaselineData,
    trimFields: TRIM_FIELDS,
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
      cityId: address.cityId ? String(address.cityId) : ''
    }),
    extraState: { provinces, cities: [] },
    extraUi: { loadingProvinces, loadingCities: false, provincesError, citiesError: null }
  });

  const provinceId = result.state.formData.provinceId;
  const { cities, loading: loadingCities, error: citiesError } = useCities(provinceId);

  return {
    ...result,
    state: {
      ...result.state,
      cities
    },
    ui: {
      ...result.ui,
      loadingCities,
      citiesError
    }
  };
};

export default useClientProfilePage;
