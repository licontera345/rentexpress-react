import EmployeeService from '../../api/services/EmployeeService';
import { MESSAGES } from '../../constants';
import { resolveUserId } from '../../utils/ui/uiUtils';
import {
  trimValues,
  validatePasswordPair,
  validatePhone,
  validateRequired
} from '../../utils/form/formValidation';
import useProfileForm from '../profile/useProfileForm';

// Campos a trimear para validación.
const TRIM_FIELDS = ['employeeName', 'firstName', 'lastName1', 'lastName2', 'email', 'phone'];
// Obtiene los datos iniciales del formulario.

const getInitialFormData = (user) => ({
  employeeName: user?.employeeName || user?.username || '',
  firstName: user?.firstName || '',
  lastName1: user?.lastName1 || '',
  lastName2: user?.lastName2 || '',
  email: user?.email || '',
  phone: user?.phone || '',
  password: '',
  confirmPassword: ''
});

// Obtiene los datos base del formulario.
const getBaselineData = (user) => ({
  employeeName: (user?.employeeName || user?.username || '').trim(),
  firstName: (user?.firstName || '').trim(),
  lastName1: (user?.lastName1 || '').trim(),
  lastName2: (user?.lastName2 || '').trim(),
  phone: (user?.phone || '').trim()
});

// Verifica si el formulario está sucio.
const checkDirty = (formData, baselineData, { profileImageFile, hasPasswordInput }) => {
  const trimmedData = trimValues(formData, TRIM_FIELDS);
  return (
    trimmedData.employeeName !== baselineData.employeeName ||
    trimmedData.firstName !== baselineData.firstName ||
    trimmedData.lastName1 !== baselineData.lastName1 ||
    trimmedData.lastName2 !== baselineData.lastName2 ||
    trimmedData.phone !== baselineData.phone ||
    Boolean(profileImageFile) ||
    hasPasswordInput
  );
};

// Valida los datos del formulario.
const validate = (formData, trimmedData, passwordValue, confirmValue, nextErrors) => {
  validateRequired(trimmedData.employeeName, 'employeeName', nextErrors);
  validateRequired(trimmedData.firstName, 'firstName', nextErrors);
  validateRequired(trimmedData.lastName1, 'lastName1', nextErrors);
  validateRequired(trimmedData.email, 'email', nextErrors);
  validateRequired(trimmedData.phone, 'phone', nextErrors);
  validatePhone(trimmedData.phone, nextErrors);
  validatePasswordPair(passwordValue, confirmValue, nextErrors);
};

// Actualiza el perfil del empleado.
const submit = async (ctx) => {
  const {
    trimmedData,
    passwordValue,
    profileImageFile,
    hasImage,
    uploadImage,
    removeImage,
    updateUser,
    user,
    entityId,
    setErrorMessage,
    resetPasswordFields,
    setShowPasswordFields,
    setIsEditing,
    setProfileImageFile,
    setProfileImagePreview,
    setProfileImageError,
    setStatusMessage,
    MESSAGES
  } = ctx;

  // Obtiene el identificador del empleado.
  const employeeId = user?.employeeId ?? entityId;
  const roleId = user?.roleId;
  const headquartersId = user?.headquartersId;

  // Verifica si el rol o la sede es nulo.
  if (roleId == null || headquartersId == null) {
    setErrorMessage(MESSAGES.ERROR_UPDATING);
    return;
  }

  if (!employeeId) throw new Error(MESSAGES.ERROR_UPDATING);

  // Construye el payload de actualización.
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
      phone: trimmedData.phone
    },
    passwordValue ? { password: passwordValue } : {},
    { activeStatus: (Number(user?.activeStatus) === 1 || user?.activeStatus === true) ? 1 : 0 }
  );

  // Actualiza el empleado.
  const updated = await EmployeeService.update(employeeId, payload);

  // Actualiza la imagen del perfil.
  if (profileImageFile) {
    if (hasImage) await removeImage();
    await uploadImage(profileImageFile);
  }

  // Actualiza el usuario.
  updateUser(Object.assign({}, user || {}, updated || payload));
  resetPasswordFields();
  setShowPasswordFields(false);
  setIsEditing(false);
  setProfileImageFile(null);
  setProfileImagePreview('');
  setProfileImageError(null);
  setStatusMessage(MESSAGES.PROFILE_UPDATED);
};

// Hook para la página de perfil del empleado.
const useEmployeeProfilePage = () => {
  // Estado y callbacks para el hook.
  return useProfileForm({
    profileType: 'employee',
    entityType: 'employee',
    getEntityId: (user) => user?.employeeId ?? resolveUserId(user),
    getInitialFormData,
    getBaselineData,
    trimFields: TRIM_FIELDS,
    checkDirty,
    validate,
    submit,
    useAddress: false
  });
};

export default useEmployeeProfilePage;
