import { MESSAGES } from '../constants';

/**
 * Recorta espacios y deja string vacío en campos que no existan.
 * Así todos los campos tienen un valor limpio para el formulario.
 */
export const trimValues = (source, fields) => {
  const result = {};
  for (const field of fields) {
    const value = source?.[field];
    result[field] = typeof value === 'string' ? value.trim() : '';
  }
  return result;
};

/** Si el valor está vacío, marca el campo como requerido. */
export const validateRequired = (value, fieldName, errors) => {
  if (!value) {
    errors[fieldName] = MESSAGES.FIELD_REQUIRED;
  }
};

/** Solo comprueba el formato si el usuario ha escrito algo. */
export const validateEmail = (email, errors) => {
  if (!email) return;
  if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = MESSAGES.INVALID_EMAIL;
  }
};

/** Solo comprueba el formato si el usuario ha escrito algo. Mínimo 7 caracteres. */
export const validatePhone = (phone, errors) => {
  if (!phone) return;
  if (!/^[\d\s()+-]{7,}$/.test(phone)) {
    errors.phone = MESSAGES.INVALID_PHONE;
  }
};

/**
 * Comprueba contraseña y confirmación: que existan, longitud mínima y que coincidan.
 * Si ambos están vacíos no se muestra error (el campo requerido lo gestiona otro).
 */
export const validatePasswordPair = (passwordValue, confirmPasswordValue, errors) => {
  const tienePassword = Boolean(passwordValue);
  const tieneConfirmacion = Boolean(confirmPasswordValue);

  if (!tienePassword && !tieneConfirmacion) return;

  if (!tienePassword) {
    errors.password = MESSAGES.FIELD_REQUIRED;
    return;
  }
  if (!tieneConfirmacion) {
    errors.confirmPassword = MESSAGES.FIELD_REQUIRED;
    return;
  }
  if (passwordValue.length < 6) {
    errors.password = MESSAGES.PASSWORD_MIN_LENGTH;
    return;
  }
  if (passwordValue !== confirmPasswordValue) {
    errors.confirmPassword = MESSAGES.PASSWORDS_DONT_MATCH;
  }
};
