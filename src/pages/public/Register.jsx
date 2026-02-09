import PublicLayout from '../../components/layout/public/PublicLayout';
import RegisterForm from '../../components/auth/forms/RegisterForm';
import useRegisterForm from '../../hooks/useRegisterForm';

// Página de registro que valida datos y crea cuenta pública. Gestiona validaciones y creación de dirección.
function Register() {
  const {
    formData,
    fieldErrors,
    error,
    isLoading,
    provinces,
    cities,
    loadingProvinces,
    loadingCities,
    provincesError,
    citiesError,
    handleChange,
    handleSubmit,
    handleLoginClick
  } = useRegisterForm();

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
        onLoginClick={handleLoginClick}
      />
    </PublicLayout>
  );
}

export default Register;
