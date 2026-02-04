import { MESSAGES } from '../constants';

// Recorta y normaliza valores de campos de formulario.
export const trimValues = (source, fields) => fields.reduce((acc, field) => {
  acc[field] = source?.[field]?.trim() || '';
  return acc;
}, {});

// Marca un error si el campo requerido está vacío.
export const validateRequired = (value, fieldName, errors) => {
  if (!value) {
    errors[fieldName] = MESSAGES.FIELD_REQUIRED;
  }
};

// Valida formato de correo electrónico.
export const validateEmail = (email, errors) => {
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    errors.email = MESSAGES.INVALID_EMAIL;
  }
};

// Valida formato de teléfono básico.
export const validatePhone = (phone, errors) => {
  if (phone && !/^[\d\s()+-]{7,}$/.test(phone)) {
    errors.phone = MESSAGES.INVALID_PHONE;
  }
};

// Valida que las contraseñas existan, tengan longitud y coincidan.
export const validatePasswordPair = (passwordValue, confirmPasswordValue, errors) => {
  if (!passwordValue && !confirmPasswordValue) return;

  if (!passwordValue) errors.password = MESSAGES.FIELD_REQUIRED;
  if (!confirmPasswordValue) errors.confirmPassword = MESSAGES.FIELD_REQUIRED;
  if (passwordValue && passwordValue.length < 6) {
    errors.password = MESSAGES.PASSWORD_MIN_LENGTH;
  }
  if (passwordValue && confirmPasswordValue && passwordValue !== confirmPasswordValue) {
    errors.confirmPassword = MESSAGES.PASSWORDS_DONT_MATCH;
  }
};
