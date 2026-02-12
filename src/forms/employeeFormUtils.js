import {
  trimValues,
  validateEmail,
  validatePasswordPair,
  validatePhone,
  validateRequired
} from './profileFormUtils';

const EMPLOYEE_TEXT_FIELDS = [
  'employeeName',
  'firstName',
  'lastName1',
  'lastName2',
  'email',
  'phone'
];

export const mapEmployeeToFormData = (employee = {}) => ({
  employeeName: employee.employeeName || '',
  password: '',
  confirmPassword: '',
  roleId: employee.roleId || employee.role?.roleId || '',
  headquartersId: employee.headquartersId || employee.headquarters?.id || '',
  firstName: employee.firstName || '',
  lastName1: employee.lastName1 || '',
  lastName2: employee.lastName2 || '',
  email: employee.email || '',
  phone: employee.phone || '',
  activeStatus: employee.activeStatus ?? true
});

export const buildEmployeePayload = (formData, { includePassword = true } = {}) => {
  const values = trimValues(formData, EMPLOYEE_TEXT_FIELDS);
  const payload = {
    employeeName: values.employeeName,
    roleId: Number(formData.roleId),
    headquartersId: Number(formData.headquartersId),
    firstName: values.firstName,
    lastName1: values.lastName1,
    lastName2: values.lastName2,
    email: values.email,
    phone: values.phone,
    activeStatus: formData.activeStatus === true || formData.activeStatus === '1' || formData.activeStatus === 1
  };

  if (includePassword && formData.password) {
    payload.password = formData.password;
  }

  return payload;
};

export const validateEmployeeForm = (formData, { isEdit = false } = {}) => {
  const errors = {};

  validateRequired(formData.employeeName?.trim(), 'employeeName', errors);
  validateRequired(formData.roleId, 'roleId', errors);
  validateRequired(formData.headquartersId, 'headquartersId', errors);
  validateRequired(formData.firstName?.trim(), 'firstName', errors);
  validateRequired(formData.lastName1?.trim(), 'lastName1', errors);
  validateRequired(formData.email?.trim(), 'email', errors);

  if (!isEdit || formData.password || formData.confirmPassword) {
    validatePasswordPair(formData.password, formData.confirmPassword, errors);
  }

  validateEmail(formData.email, errors);
  validatePhone(formData.phone, errors);

  return errors;
};
