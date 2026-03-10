import AddressService from '../../api/services/addressService';
import UserService from '../../api/services/userService';
import { MESSAGES } from '../../constants';
import {
  createCheckDirty,
  validateProfileFields,
  runPostSubmitReset,
} from '../profile/profileFormHelpers';

export const CLIENT_PROFILE_TRIM_FIELDS = [
  'firstName', 'lastName1', 'lastName2', 'username', 'email', 'phone', 'street', 'number',
];

const clientCheckDirtyOptions = {
  compareTrimmedKeys: [
    'firstName', 'lastName1', 'lastName2', 'username', 'email', 'phone', 'street', 'number',
  ],
  compareRawKeys: ['birthDate', 'provinceId', 'cityId'],
};

export const checkDirty = createCheckDirty(CLIENT_PROFILE_TRIM_FIELDS, clientCheckDirtyOptions);

const clientValidateOptions = {
  required: ['firstName', 'lastName1', 'email', 'phone', 'username', 'street', 'number'],
  rawRequired: ['birthDate', 'provinceId', 'cityId'],
  email: true,
  phone: true,
  passwordPair: true,
};

export function validate(formData, trimmedData, passwordValue, confirmValue, nextErrors) {
  validateProfileFields(
    formData,
    trimmedData,
    passwordValue,
    confirmValue,
    nextErrors,
    clientValidateOptions
  );
}

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

export const submit = async (ctx) => {
  const {
    formData, trimmedData, passwordValue, profileImageFile, hasImage, uploadImage, removeImage,
    updateUser, user, entityId: userId, addressId, setAddressId,
    MESSAGES: MSG,
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
  if (ctx.refreshProfileImage) ctx.refreshProfileImage();
  runPostSubmitReset(ctx, MSG.PROFILE_UPDATED);
};
