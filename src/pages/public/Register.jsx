import PublicLayout from '../../components/layout/public/PublicLayout';
import RegisterForm from '../../components/auth/forms/RegisterForm';
import usePublicRegisterPage from '../../hooks/usePublicRegisterPage';

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
  } = usePublicRegisterPage();

  return (
    <PublicLayout>
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
