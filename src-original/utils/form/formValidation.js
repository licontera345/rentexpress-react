import { MESSAGES } from '../../constants';

export const trimValues = (source, fields) => {
  const result = {};
  for (const field of fields) {
    const value = source?.[field];
    result[field] = typeof value === 'string' ? value.trim() : '';
  }
  return result;
};

export const validateRequired = (value, fieldName, errors) => {
  if (!value) {
    errors[fieldName] = MESSAGES.FIELD_REQUIRED;
  }
};

export const validateEmail = (email, errors) => {
  if (!email) return;
  if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = MESSAGES.INVALID_EMAIL;
  }
};

export const validatePhone = (phone, errors) => {
  if (!phone) return;
  if (!/^[\d\s()+-]{7,}$/.test(phone)) {
    errors.phone = MESSAGES.INVALID_PHONE;
  }
};

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
