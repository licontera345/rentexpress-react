import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../api/services/AuthService';
import AddressService from '../../api/services/AddressService';
import useProvinces from '../location/useProvinces';
import useCities from '../location/useCities';
import { t } from '../../i18n';
import { DEFAULT_FORM_DATA, MESSAGES, MIN_AGE_FOR_REGISTER, ROUTES } from '../../constants';

const getAgeFromBirthDate = (birthDateStr) => {
  if (!birthDateStr) return null;
  const birth = new Date(birthDateStr);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
};

const isDuplicateAccountError = (err) => {
  const status = err?.status;
  const msg = (err?.message || '').toLowerCase();
  if (status === 409) return true;
  const duplicateKeywords = ['already exists', 'ya existe', 'duplicate', 'duplicado', 'unique', 'username', 'email', 'existente'];
  return duplicateKeywords.some((k) => msg.includes(k));
};

const usePublicRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA.REGISTER);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const { provinces, loading: loadingProvinces, error: provincesError } = useProvinces();
  const { cities, loading: loadingCities, error: citiesError } = useCities(formData.provinceId);

  // Sincroniza inputs del formulario de registro y limpia errores.
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setFormData(prev => Object.assign({}, prev, {
      [name]: nextValue
    }, name === 'provinceId' ? { cityId: '' } : {}));
    if (fieldErrors[name]) {
      setFieldErrors(prev => Object.assign({}, prev, {
        [name]: null
      }));
    }
    if (error) {
      setError('');
    }
  }, [error, fieldErrors]);

  // Valida y envía el registro de usuario, creando dirección pública.
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    const trimmedData = {
      firstName: formData.firstName.trim(),
      lastName1: formData.lastName1.trim(),
      lastName2: formData.lastName2.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      birthDate: formData.birthDate,
      street: formData.street.trim(),
      number: formData.number.trim()
    };
    const nextErrors = {};

    if (!trimmedData.firstName) nextErrors.firstName = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.lastName1) nextErrors.lastName1 = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.username) nextErrors.username = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.email) nextErrors.email = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.phone) nextErrors.phone = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.birthDate) nextErrors.birthDate = MESSAGES.FIELD_REQUIRED;
    const age = getAgeFromBirthDate(trimmedData.birthDate);
    if (trimmedData.birthDate && (age === null || age < MIN_AGE_FOR_REGISTER)) {
      nextErrors.birthDate = t('REGISTER_AGE_MIN', { minAge: MIN_AGE_FOR_REGISTER });
    }
    if (!trimmedData.street) nextErrors.street = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.number) nextErrors.number = MESSAGES.FIELD_REQUIRED;
    if (!formData.provinceId) nextErrors.provinceId = MESSAGES.FIELD_REQUIRED;
    if (!formData.cityId) nextErrors.cityId = MESSAGES.FIELD_REQUIRED;
    if (!formData.password) nextErrors.password = MESSAGES.FIELD_REQUIRED;
    if (!formData.confirmPassword) nextErrors.confirmPassword = MESSAGES.FIELD_REQUIRED;
    if (!formData.acceptTerms) nextErrors.acceptTerms = MESSAGES.ACCEPT_TERMS_REQUIRED;

    if (trimmedData.email && !/\S+@\S+\.\S+/.test(trimmedData.email)) {
      nextErrors.email = MESSAGES.INVALID_EMAIL;
    }

    if (trimmedData.phone && !/^[\d\s()+-]{7,}$/.test(trimmedData.phone)) {
      nextErrors.phone = MESSAGES.INVALID_PHONE;
    }

    if (formData.password && formData.password.length < 6) {
      nextErrors.password = MESSAGES.PASSWORD_MIN_LENGTH;
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = MESSAGES.PASSWORDS_DONT_MATCH;
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError(MESSAGES.VALIDATION_ERROR);
      return;
    }

    setIsLoading(true);
    try {
      const address = await AddressService.createPublic({
        street: trimmedData.street,
        number: trimmedData.number,
        provinceId: Number(formData.provinceId),
        cityId: Number(formData.cityId)
      });
      const addressId = address?.id || address?.addressId;
      if (!addressId) {
        throw new Error(MESSAGES.ERROR_SAVING);
      }

      await AuthService.register({
        username: trimmedData.username,
        email: trimmedData.email,
        password: formData.password,
        firstName: trimmedData.firstName,
        lastName1: trimmedData.lastName1,
        lastName2: trimmedData.lastName2,
        birthDate: trimmedData.birthDate,
        phone: trimmedData.phone,
        addressId,
        activeStatus: 1
      });
      navigate(ROUTES.LOGIN);
    } catch (err) {
      console.error(err);
      if (isDuplicateAccountError(err)) {
        setError(MESSAGES.REGISTER_ACCOUNT_EXISTS_USE_RECOVER);
      } else {
        setError(err?.message || MESSAGES.UNEXPECTED_ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, navigate]);

  // Permite navegar manualmente a la pantalla de login.
  const handleLoginClick = useCallback(() => {
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  return {
    state: {
      formData,
      fieldErrors,
      provinces,
      cities
    },
    ui: {
      error,
      isLoading,
      loadingProvinces,
      loadingCities,
      provincesError,
      citiesError
    },
    actions: {
      handleChange,
      handleSubmit,
      handleLoginClick
    },
    options: {}
  };
};

export default usePublicRegisterPage;
