import PublicLayout from '../../components/layout/public/PublicLayout';
import LoginForm from '../../components/auth/forms/LoginForm';
import useLoginForm from '../../hooks/useLoginForm';

// Página de inicio de sesión con lógica de autenticación y redirección.
function Login() {
  const {
    formData,
    isLoading,
    errorMessage,
    handleChange,
    handleSubmit
  } = useLoginForm();

  return (
    <PublicLayout>
      {/* Formulario de login con sus estados controlados */}
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
