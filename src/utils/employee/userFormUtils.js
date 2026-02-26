import { toFormControlValue } from '../form/formatters';
import { MESSAGES } from '../../constants';
import { validateEmail, validatePhone } from '../form/formValidation';

export const USER_FORM_INITIAL_DATA = {
  username: '',
  password: '',
  firstName: '',
  lastName1: '',
  lastName2: '',
  birthDate: '',
  email: '',
  phone: '',
  roleId: '',
  activeStatus: true
};

const isActiveFromApi = (value) => Number(value) === 1 || value === true;

export const mapUserToFormData = (user = {}) => ({
  username: toFormControlValue(user.username || ''),
  password: '',
  firstName: toFormControlValue(user.firstName || ''),
  lastName1: toFormControlValue(user.lastName1 || ''),
  lastName2: toFormControlValue(user.lastName2 || ''),
  birthDate: user.birthDate ? String(user.birthDate).slice(0, 10) : '',
  email: toFormControlValue(user.email || ''),
  phone: toFormControlValue(user.phone || ''),
  roleId: toFormControlValue(user.roleId ?? user.role?.[0]?.roleId ?? ''),
  activeStatus: isActiveFromApi(user.activeStatus)
});

export const buildUserPayload = (formData, { includePassword = false } = {}) => {
  const payload = {
    username: formData.username?.trim() || undefined,
    firstName: formData.firstName?.trim() || undefined,
    lastName1: formData.lastName1?.trim() || undefined,
    lastName2: formData.lastName2?.trim() || undefined,
    birthDate: formData.birthDate?.trim() || undefined,
    email: formData.email?.trim() || undefined,
    phone: formData.phone?.trim() || undefined,
    roleId: formData.roleId ? Number(formData.roleId) : undefined,
    activeStatus: formData.activeStatus ? 1 : 0
  };
  if (formData.password?.trim()) {
    payload.password = formData.password.trim();
  }
  return payload;
};

export const validateUserForm = (formData, { isCreate = false } = {}) => {
  const errors = {};
  if (!formData.username?.trim()) errors.username = MESSAGES.FIELD_REQUIRED;
  if (!formData.firstName?.trim()) errors.firstName = MESSAGES.FIELD_REQUIRED;
  if (!formData.lastName1?.trim()) errors.lastName1 = MESSAGES.FIELD_REQUIRED;
  if (!formData.email?.trim()) errors.email = MESSAGES.FIELD_REQUIRED;
  else validateEmail(formData.email.trim(), errors);
  if (formData.phone?.trim()) validatePhone(formData.phone.trim(), errors);
  if (isCreate) {
    if (!formData.password?.trim()) errors.password = MESSAGES.FIELD_REQUIRED;
    else if (formData.password.trim().length < 6) errors.password = MESSAGES.PASSWORD_MIN_LENGTH;
  }
  return errors;
};
