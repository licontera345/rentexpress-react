import { toFormControlValue } from '../form/formatters';
import { MESSAGES } from '../../constants';
import { validateEmail, validatePhone } from '../form/formValidation';

export const EMPLOYEE_FORM_INITIAL_DATA = {
  employeeName: '',
  password: '',
  roleId: '',
  headquartersId: '',
  firstName: '',
  lastName1: '',
  lastName2: '',
  email: '',
  phone: '',
  activeStatus: true
};

const isActiveFromApi = (value) => Number(value) === 1 || value === true || value === '1';

function getActiveStatusFromEmployee(employee) {
  return employee?.activeStatus;
}

export const mapEmployeeToFormData = (employee = {}) => ({
  employeeName: toFormControlValue(employee.employeeName || ''),
  password: '',
  roleId: toFormControlValue(employee.roleId ?? employee.role?.roleId ?? ''),
  headquartersId: toFormControlValue(employee.headquartersId ?? employee.headquarters?.id ?? ''),
  firstName: toFormControlValue(employee.firstName || ''),
  lastName1: toFormControlValue(employee.lastName1 || ''),
  lastName2: toFormControlValue(employee.lastName2 || ''),
  email: toFormControlValue(employee.email || ''),
  phone: toFormControlValue(employee.phone || ''),
  activeStatus: isActiveFromApi(getActiveStatusFromEmployee(employee))
});

export const buildEmployeePayload = (formData, { omitPasswordIfEmpty = true } = {}) => {
  const payload = {
    employeeName: formData.employeeName?.trim() || undefined,
    roleId: formData.roleId ? Number(formData.roleId) : undefined,
    headquartersId: formData.headquartersId ? Number(formData.headquartersId) : undefined,
    firstName: formData.firstName?.trim() || undefined,
    lastName1: formData.lastName1?.trim() || undefined,
    lastName2: formData.lastName2?.trim() || undefined,
    email: formData.email?.trim() || undefined,
    phone: formData.phone?.trim() || undefined,
    activeStatus: formData.activeStatus ? 1 : 0
  };
  if (formData.password?.trim() && (!omitPasswordIfEmpty || formData.password.trim().length > 0)) {
    payload.password = formData.password.trim();
  }
  return payload;
};

export const validateEmployeeForm = (formData, { isCreate = false } = {}) => {
  const errors = {};
  if (!formData.employeeName?.trim()) errors.employeeName = MESSAGES.FIELD_REQUIRED;
  if (!formData.firstName?.trim()) errors.firstName = MESSAGES.FIELD_REQUIRED;
  if (!formData.lastName1?.trim()) errors.lastName1 = MESSAGES.FIELD_REQUIRED;
  if (!formData.email?.trim()) errors.email = MESSAGES.FIELD_REQUIRED;
  else validateEmail(formData.email.trim(), errors);
  if (formData.phone?.trim()) validatePhone(formData.phone.trim(), errors);
  if (!formData.roleId) errors.roleId = MESSAGES.FIELD_REQUIRED;
  if (!formData.headquartersId) errors.headquartersId = MESSAGES.FIELD_REQUIRED;
  if (isCreate) {
    if (!formData.password?.trim()) errors.password = MESSAGES.FIELD_REQUIRED;
    else if (formData.password.trim().length < 6) errors.password = MESSAGES.PASSWORD_MIN_LENGTH;
  } else if (formData.password?.trim() && formData.password.trim().length < 6) {
    errors.password = MESSAGES.PASSWORD_MIN_LENGTH;
  }
  return errors;
};
