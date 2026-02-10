import PublicLayout from '../../components/layout/public/PublicLayout';
import LoginForm from '../../components/auth/forms/LoginForm';
import usePublicLoginPage from '../../hooks/usePublicLoginPage';

function Login() {
  const {
    formData,
    isLoading,
    errorMessage,
    handleChange,
    handleSubmit
  } = usePublicLoginPage();

  return (
    <PublicLayout>
      <LoginForm
        formData={formData}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </PublicLayout>
  );
}

export default Login;
