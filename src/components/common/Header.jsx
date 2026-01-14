import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>RentExpress</h1>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/catalog">Catálogo</Link>
        <Link to="/login">Iniciar sesión</Link>
      </nav>
    </header>
  );
}

export default Header;
