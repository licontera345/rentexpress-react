/**
 * Helpers reutilizables para formularios de perfil (cliente y empleado).
 * Centraliza checkDirty, validación y reset post-submit para evitar duplicación.
 */
import {
  trimValues,
  validateEmail,
  validatePasswordPair,
  validatePhone,
  validateRequired,
} from '../form/formValidation';

/**
 * Crea una función checkDirty parametrizada por campos a comparar.
 * @param {string[]} trimFields - Campos que se recortan antes de comparar
 * @param {Object} options
 * @param {string[]} options.compareTrimmedKeys - Claves que se comparan con valor recortado
 * @param {string[]} [options.compareRawKeys=[]] - Claves que se comparan con valor raw (ej. birthDate, provinceId, cityId)
 * @returns {(formData, baselineData, extras) => boolean}
 */
export function createCheckDirty(trimFields, { compareTrimmedKeys, compareRawKeys = [] }) {
  return (formData, baselineData, { profileImageFile, hasPasswordInput }) => {
    const trimmedData = trimValues(formData, trimFields);
    for (const key of compareTrimmedKeys) {
      if (trimmedData[key] !== baselineData[key]) return true;
    }
    for (const key of compareRawKeys) {
      if (formData[key] !== baselineData[key]) return true;
    }
    return Boolean(profileImageFile) || hasPasswordInput;
  };
}

/**
 * Opciones de validación para validateProfileFields.
 * @typedef {Object} ValidateProfileOptions
 * @property {string[]} required - Campos requeridos (se leen de trimmedData)
 * @property {string[]} [rawRequired=[]] - Campos requeridos que se leen de formData (ej. birthDate, provinceId, cityId)
 * @property {boolean} [email=false] - Validar campo email
 * @property {boolean} [phone=false] - Validar campo phone
 * @property {boolean} [passwordPair=true] - Si se valida el par password/confirmPassword
 */

/**
 * Valida los campos del formulario de perfil según la configuración.
 * @param {Object} formData
 * @param {Object} trimmedData
 * @param {string} passwordValue
 * @param {string} confirmValue
 * @param {Object} nextErrors - Objeto de errores a rellenar (mutado)
 * @param {ValidateProfileOptions} options
 */
export function validateProfileFields(
  formData,
  trimmedData,
  passwordValue,
  confirmValue,
  nextErrors,
  options
) {
  const {
    required = [],
    rawRequired = [],
    email = false,
    phone = false,
    passwordPair = true,
  } = options;

  for (const field of required) {
    validateRequired(trimmedData[field], field, nextErrors);
  }
  for (const field of rawRequired) {
    validateRequired(formData[field], field, nextErrors);
  }
  if (email) validateEmail(trimmedData.email, nextErrors);
  if (phone) validatePhone(trimmedData.phone, nextErrors);
  if (passwordPair) {
    validatePasswordPair(passwordValue, confirmValue, nextErrors);
  }
}

/**
 * Aplica el reset común de UI después de un submit exitoso de perfil.
 * @param {Object} ctx - Contexto del submit (setStatusMessage, resetPasswordFields, etc.)
 * @param {string} successMessage - Mensaje a mostrar (ej. MESSAGES.PROFILE_UPDATED)
 */
export function runPostSubmitReset(ctx, successMessage) {
  const {
    resetPasswordFields,
    setShowPasswordFields,
    setIsEditing,
    setProfileImageFile,
    setProfileImagePreview,
    setProfileImageError,
    setStatusMessage,
  } = ctx;
  resetPasswordFields();
  if (setShowPasswordFields) setShowPasswordFields(false);
  if (setIsEditing) setIsEditing(false);
  if (setProfileImageFile) setProfileImageFile(null);
  if (setProfileImagePreview) setProfileImagePreview('');
  if (setProfileImageError) setProfileImageError(null);
  if (setStatusMessage && successMessage) setStatusMessage(successMessage);
}
