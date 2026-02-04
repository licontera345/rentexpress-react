import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import RegisterForm from '../../components/auth/forms/RegisterForm';
import { DEFAULT_ACTIVE_STATUS, DEFAULT_FORM_DATA, MESSAGES, ROUTES } from '../../constants';
import AuthService from '../../api/services/AuthService';
import AddressService from '../../api/services/AddressService';
import useProvinces from '../../hooks/useProvinces';
import useCities from '../../hooks/useCities';

// Página de registro que valida datos y crea cuenta pública.
function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA.REGISTER);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const { provinces, loading: loadingProvinces, error: provincesError } = useProvinces();
  const { cities, loading: loadingCities, error: citiesError } = useCities(formData.provinceId);

  // Sincroniza los campos del formulario y limpia errores locales.
  const handleChange = (e) => {
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
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    // Normaliza y valida los datos antes de enviar al backend.
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
      setError(MESSAGES.REQUIRED_FIELDS);
      return;
    }

    setIsLoading(true);
    try {
      // Crea la dirección primero y luego registra el usuario.
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
        activeStatus: DEFAULT_ACTIVE_STATUS
      });
      navigate(ROUTES.LOGIN);
    } catch (err) {
      // Reporta errores inesperados en la creación de cuenta.
      console.error(err);
      setError(err?.message || MESSAGES.UNEXPECTED_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [formData, navigate]);

  return (
    <PublicLayout>
      {/* Formulario de registro con estados controlados */}
      <RegisterForm
        formData={formData}
        fieldErrors={fieldErrors}
        error={error}
        isLoading={isLoading}
        loadingProvinces={loadingProvinces}
        provincesError={provincesError}
        provinces={provinces}
        loadingCities={loadingCities}
        citiesError={citiesError}
        cities={cities}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onLoginClick={() => navigate(ROUTES.LOGIN)}
      />
    </PublicLayout>
  );
}

export default Register;
