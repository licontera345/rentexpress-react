import AddressService from '../../api/services/AddressService';
import UserService from '../../api/services/UserService';
import { MESSAGES } from '../../constants';
import {
  trimValues,
  validateEmail,
  validatePasswordPair,
  validatePhone,
  validateRequired,
} from '../form/formValidation';

export const CLIENT_PROFILE_TRIM_FIELDS = [
  'firstName', 'lastName1', 'lastName2', 'username', 'email', 'phone', 'street', 'number',
];

export const getInitialFormData = (user, resolvedAddress) => ({
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
  cityId: resolvedAddress?.cityId ? String(resolvedAddress.cityId) : '',
});

export const getBaselineData = (user, resolvedAddress) => ({
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
  cityId: resolvedAddress?.cityId ? String(resolvedAddress.cityId) : '',
});

export const checkDirty = (formData, baselineData, { profileImageFile, hasPasswordInput }) => {
  const trimmedData = trimValues(formData, CLIENT_PROFILE_TRIM_FIELDS);
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

export const validate = (formData, trimmedData, passwordValue, confirmValue, nextErrors) => {
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

export const submit = async (ctx) => {
  const {
    formData, trimmedData, passwordValue, profileImageFile, hasImage, uploadImage, removeImage,
    updateUser, user, entityId: userId, addressId, setAddressId, resetPasswordFields,
    setShowPasswordFields, setIsEditing, setProfileImageFile, setProfileImagePreview,
    setProfileImageError, setStatusMessage, MESSAGES: MSG,
  } = ctx;
  let nextAddressId = addressId;
  let latestAddress = null;
  const addressPayload = {
    street: trimmedData.street,
    number: trimmedData.number,
    provinceId: Number(formData.provinceId),
    cityId: Number(formData.cityId),
  };
  if (nextAddressId) {
    try {
      latestAddress = await AddressService.update(nextAddressId, addressPayload);
    } catch (error) {
      if (error?.status !== 404) throw error;
      latestAddress = await AddressService.createPublic(addressPayload);
    }
  } else {
    latestAddress = await AddressService.createPublic(addressPayload);
  }
  nextAddressId = latestAddress?.id ?? nextAddressId;
  setAddressId(nextAddressId);
  if (!userId) throw new Error(MSG.ERROR_UPDATING);
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
      addressId: nextAddressId || undefined,
    },
    passwordValue ? { password: passwordValue } : {},
    { activeStatus: (Number(user?.activeStatus) === 1 || user?.activeStatus === true) ? 1 : 0 }
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
    latestAddress ? { address: latestAddress, addressId: nextAddressId } : {},
  );
  updateUser(mergedUser);
  resetPasswordFields();
  setShowPasswordFields(false);
  setIsEditing(false);
  setProfileImageFile(null);
  setProfileImagePreview('');
  setProfileImageError(null);
  setStatusMessage(MSG.PROFILE_UPDATED);
};
