import { MESSAGES } from '../constants';

export const trimValues = (source, fields) => fields.reduce((acc, field) => {
  acc[field] = source?.[field]?.trim() || '';
  return acc;
}, {});

export const validateRequired = (value, fieldName, errors) => {
  if (!value) {
    errors[fieldName] = MESSAGES.FIELD_REQUIRED;
  }
};

export const validateEmail = (email, errors) => {
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    errors.email = MESSAGES.INVALID_EMAIL;
  }
};

export const validatePhone = (phone, errors) => {
  if (phone && !/^[\d\s()+-]{7,}$/.test(phone)) {
    errors.phone = MESSAGES.INVALID_PHONE;
  }
};

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
