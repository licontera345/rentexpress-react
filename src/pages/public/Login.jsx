import PublicLayout from '../../components/layout/public/PublicLayout.jsx';


function Login() {
  return (
    <PublicLayout>
      <form>
        <input placeholder="Usuario" />
        <button>Entrar</button>
      </form>
    </PublicLayout>
  );
}

export default Login;
