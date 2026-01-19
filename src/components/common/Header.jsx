import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthService from '../../api/services/AuthService';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    setShowMenu(false);
    navigate('/');
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
          <Link to="/catalog" className="nav-link">Catálogo</Link>
          {isAuthenticated && (
            <>
              <Link to="/my-reservations" className="nav-link">Mis Reservas</Link>
              <Link to="/manage-vehicles" className="nav-link">Mis Vehículos</Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="header-right">
          {isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowMenu(!showMenu)}
              >
                {user?.name || 'Mi Cuenta'}
              </button>
              
              {showMenu && (
                <div className="dropdown-menu">
                  <button className="menu-item" onClick={() => handleNavClick('/profile')}>
                    Mi Perfil
                  </button>
                  <button className="menu-item" onClick={() => handleNavClick('/my-reservations')}>
                    Mis Reservas
                  </button>
                  <button className="menu-item" onClick={() => handleNavClick('/manage-vehicles')}>
                    Gestionar Vehículos
                  </button>
                  <hr className="menu-divider" />
                  <button className="menu-item logout" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="btn-ghost"
                onClick={() => navigate('/login')}
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
