import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, MESSAGES } from '../../../constants';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="logo">
          <div className="logo-badge">RE</div>
          <span className="logo-text">RentExpress</span>
        </Link>

        {/* Navigation Links */}
        <nav className="header-nav">
          <Link to={ROUTES.CATALOG} className="nav-link">Catálogo de Coches</Link>
        </nav>

        {/* Right side */}
        <div className="header-right">
          <span className="header-language">ES</span>
          <div className="auth-buttons">
            <button 
              className="btn-ghost"
              onClick={() => navigate(ROUTES.LOGIN)}
              type="button"
            >
              {MESSAGES.SIGN_IN}
            </button>
            <button
              className="btn-ghost btn-register"
              onClick={() => navigate(ROUTES.REGISTER)}
              type="button"
            >
              {MESSAGES.CREATE_ACCOUNT}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
