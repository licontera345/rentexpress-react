import {
  trimValues,
  validateEmail,
  validatePasswordPair,
  validatePhone,
  validateRequired
} from './profileFormUtils';

const USER_TEXT_FIELDS = [
  'username',
  'firstName',
  'lastName1',
  'lastName2',
  'email',
  'phone',
  'street',
  'number'
];

const resolveAddress = (user = {}) => {
  if (Array.isArray(user.address)) return user.address[0] || {};
  return user.address || {};
};

export const mapUserToFormData = (user = {}) => {
  const address = resolveAddress(user);

  return {
    username: user.username || '',
    password: '',
    confirmPassword: '',
    firstName: user.firstName || '',
    lastName1: user.lastName1 || '',
    lastName2: user.lastName2 || '',
    email: user.email || '',
    phone: user.phone || '',
    birthDate: user.birthDate || '',
    roleId: user.roleId || user.role?.roleId || '',
    addressId: user.addressId || address.id || address.addressId || '',
    provinceId: address.provinceId || address.province?.id || '',
    cityId: address.cityId || address.city?.id || '',
    street: address.street || '',
    number: address.number || '',
    activeStatus: user.activeStatus ?? true
  };
};

export const buildAddressPayload = (formData) => {
  const values = trimValues(formData, USER_TEXT_FIELDS);

  return {
    street: values.street,
    number: values.number,
    provinceId: Number(formData.provinceId),
    cityId: Number(formData.cityId)
  };
};

export const buildUserPayload = (formData, { includePassword = true, roleId } = {}) => {
  const values = trimValues(formData, USER_TEXT_FIELDS);
  const payload = {
    username: values.username,
    firstName: values.firstName,
    lastName1: values.lastName1,
    lastName2: values.lastName2,
    birthDate: formData.birthDate,
    email: values.email,
    phone: values.phone,
    roleId: Number(roleId || formData.roleId),
    activeStatus: formData.activeStatus === true || formData.activeStatus === '1' || formData.activeStatus === 1
  };

  if (includePassword && formData.password) {
    payload.password = formData.password;
  }

  return payload;
};

export const validateUserForm = (formData, { isEdit = false } = {}) => {
  const errors = {};

  validateRequired(formData.username?.trim(), 'username', errors);
  validateRequired(formData.firstName?.trim(), 'firstName', errors);
  validateRequired(formData.lastName1?.trim(), 'lastName1', errors);
  validateRequired(formData.email?.trim(), 'email', errors);
  validateRequired(formData.phone?.trim(), 'phone', errors);
  validateRequired(formData.birthDate, 'birthDate', errors);
  validateRequired(formData.provinceId, 'provinceId', errors);
  validateRequired(formData.cityId, 'cityId', errors);
  validateRequired(formData.street?.trim(), 'street', errors);
  validateRequired(formData.number?.trim(), 'number', errors);

  if (!isEdit || formData.password || formData.confirmPassword) {
    validatePasswordPair(formData.password, formData.confirmPassword, errors);
  }

  validateEmail(formData.email, errors);
  validatePhone(formData.phone, errors);

  return errors;
};
