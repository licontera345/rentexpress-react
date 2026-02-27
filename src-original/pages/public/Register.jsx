import PublicLayout from '../../components/layout/public/PublicLayout';
import RegisterForm from '../../components/auth/forms/RegisterForm';
import usePublicRegisterPage from '../../hooks/public/usePublicRegisterPage';

function Register() {
  const { state, ui, actions } = usePublicRegisterPage();

  return (
    <PublicLayout>
      <RegisterForm
        formData={state.formData}
        fieldErrors={state.fieldErrors}
        error={ui.error}
        isLoading={ui.isLoading}
        loadingProvinces={ui.loadingProvinces}
        provincesError={ui.provincesError}
        provinces={state.provinces}
        loadingCities={ui.loadingCities}
        citiesError={ui.citiesError}
        cities={state.cities}
        onChange={actions.handleChange}
        onSubmit={actions.handleSubmit}
        onLoginClick={actions.handleLoginClick}
      />
    </PublicLayout>
  );
}

export default Register;
