import PublicLayout from '../../components/layout/public/PublicLayout';
import LoginForm from '../../components/auth/forms/LoginForm';
import usePublicLoginPage from '../../hooks/public/usePublicLoginPage';

function Login() {
  const { state, ui, actions } = usePublicLoginPage();

  return (
    <PublicLayout>
      <LoginForm
        formData={state.formData}
        isLoading={ui.isLoading}
        errorMessage={ui.errorMessage}
        onChange={actions.handleChange}
        onSubmit={actions.handleSubmit}
      />
    </PublicLayout>
  );
}

export default Login;
 