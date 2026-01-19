import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthService from '../../api/services/AuthService';
import { ROUTES, MESSAGES } from '../../constants';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    setShowMenu(false);
    navigate(ROUTES.HOME);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setShowMenu(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={() => setShowMenu(false)}>
          <div className="logo-badge">RE</div>
          <span className="logo-text">RentExpress</span>
        </Link>

        {/* Navigation Links */}
        <nav className="header-nav">
          <Link to={ROUTES.CATALOG} className="nav-link">Catálogo de Coches</Link>
          {isAuthenticated && (
            <>
              <Link to={ROUTES.MY_RESERVATIONS} className="nav-link">{MESSAGES.MY_RESERVATIONS}</Link>
              <Link to={ROUTES.MANAGE_VEHICLES} className="nav-link">{MESSAGES.MANAGE_VEHICLES}</Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="header-right">
          <span className="header-language">ES</span>
          {isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowMenu(!showMenu)}
              >
                {user?.name || MESSAGES.MY_PROFILE}
              </button>
              
              {showMenu && (
                <div className="dropdown-menu">
                  <button className="menu-item" onClick={() => handleNavClick(ROUTES.PROFILE)}>
                    {MESSAGES.MY_PROFILE}
                  </button>
                  <button className="menu-item" onClick={() => handleNavClick(ROUTES.MY_RESERVATIONS)}>
                    {MESSAGES.MY_RESERVATIONS}
                  </button>
                  <button className="menu-item" onClick={() => handleNavClick(ROUTES.MANAGE_VEHICLES)}>
                    {MESSAGES.MANAGE_VEHICLES}
                  </button>
                  <hr className="menu-divider" />
                  <button className="menu-item logout" onClick={handleLogout}>
                    {MESSAGES.LOGOUT}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="btn-ghost"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                {MESSAGES.SIGN_IN}
              </button>
              <button
                className="btn-ghost btn-register"
                onClick={() => navigate(ROUTES.REGISTER)}
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
