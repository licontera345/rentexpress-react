/**
 * Helpers para el formulario de perfil de empleado.
 * Reutiliza profileFormHelpers para checkDirty, validate y runPostSubmitReset.
 */
import EmployeeService from '../../api/services/employeeService';
import {
  createCheckDirty,
  validateProfileFields,
  runPostSubmitReset,
} from '../profile/profileFormHelpers';

export const EMPLOYEE_PROFILE_TRIM_FIELDS = [
  'employeeName', 'firstName', 'lastName1', 'lastName2', 'email', 'phone',
];

const employeeCheckDirtyOptions = {
  compareTrimmedKeys: ['employeeName', 'firstName', 'lastName1', 'lastName2', 'phone'],
  compareRawKeys: [],
};

export const checkDirty = createCheckDirty(EMPLOYEE_PROFILE_TRIM_FIELDS, employeeCheckDirtyOptions);

const employeeValidateOptions = {
  required: ['employeeName', 'firstName', 'lastName1', 'email', 'phone'],
  rawRequired: [],
  email: false,
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
    employeeValidateOptions
  );
}

export const getInitialFormData = (user) => ({
  employeeName: user?.employeeName || user?.username || '',
  firstName: user?.firstName || '',
  lastName1: user?.lastName1 || '',
  lastName2: user?.lastName2 || '',
  email: user?.email || '',
  phone: user?.phone || '',
  password: '',
  confirmPassword: '',
});

export const getBaselineData = (user) => ({
  employeeName: (user?.employeeName || user?.username || '').trim(),
  firstName: (user?.firstName || '').trim(),
  lastName1: (user?.lastName1 || '').trim(),
  lastName2: (user?.lastName2 || '').trim(),
  phone: (user?.phone || '').trim(),
});

export const submit = async (ctx) => {
  const {
    trimmedData,
    passwordValue,
    profileImageFile,
    hasImage,
    uploadImage,
    removeImage,
    updateUser,
    refreshProfileImage,
    user,
    entityId,
    setErrorMessage,
    MESSAGES: MSG,
  } = ctx;

  const employeeId = user?.employeeId ?? entityId;
  const roleId = user?.roleId;
  const headquartersId = user?.headquartersId;

  if (roleId == null || headquartersId == null) {
    setErrorMessage(MSG.ERROR_UPDATING);
    return;
  }

  if (!employeeId) throw new Error(MSG.ERROR_UPDATING);

  const payload = Object.assign(
    {},
    {
      employeeName: trimmedData.employeeName,
      roleId,
      headquartersId,
      firstName: trimmedData.firstName,
      lastName1: trimmedData.lastName1,
      lastName2: trimmedData.lastName2,
      email: trimmedData.email,
      phone: trimmedData.phone,
    },
    passwordValue ? { password: passwordValue } : {},
    { activeStatus: (Number(user?.activeStatus) === 1 || user?.activeStatus === true) ? 1 : 0 }
  );

  const updated = await EmployeeService.update(employeeId, payload);

  if (profileImageFile) {
    if (hasImage) await removeImage();
    await uploadImage(profileImageFile);
  }

  updateUser(Object.assign({}, user || {}, updated || payload));
  if (refreshProfileImage) refreshProfileImage();
  runPostSubmitReset(ctx, MSG.PROFILE_UPDATED);
};
