import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, MESSAGES } from '../../../constants';
import useTheme from '../../../hooks/useTheme';
import logo from '../../../assets/logo.png';

function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const themeLabel = theme === 'dark' ? 'Claro' : 'Oscuro';
  const themeIcon = theme === 'dark' ? '☀️' : '🌙';

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="logo">
          <img className="logo-image" src={logo} alt="RentExpress" />
          <span className="logo-text">RentExpress</span>
        </Link>

        {/* Navigation Links */}
        <nav className="header-nav">
          <Link to={ROUTES.CATALOG} className="nav-link">Catálogo de Coches</Link>
        </nav>

        {/* Right side */}
        <div className="header-right">
          <span className="header-language">ES</span>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={`Activar modo ${themeLabel.toLowerCase()}`}
          >
            <span className="theme-toggle-icon" aria-hidden="true">{themeIcon}</span>
            <span className="theme-toggle-text">{themeLabel}</span>
          </button>
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
