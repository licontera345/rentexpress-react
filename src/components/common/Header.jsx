import { Link, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import AuthService from '../../api/services/AuthService';
import SearchPanel from './search/SearchPanel';
import useVehicleSearch from '../../hooks/useVehicleSearch';
import { ROUTES, MESSAGES } from '../../constants';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { searchVehicles } = useVehicleSearch();
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

  const handleSearch = useCallback(async (criteria) => {
    await searchVehicles(criteria).catch(() => {});
    navigate(ROUTES.CATALOG);
  }, [searchVehicles, navigate]);

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
          <Link to={ROUTES.CATALOG} className="nav-link">{MESSAGES.SEARCH_VEHICLES}</Link>
          {isAuthenticated && (
            <>
              <Link to={ROUTES.MY_RESERVATIONS} className="nav-link">{MESSAGES.MY_RESERVATIONS}</Link>
              <Link to={ROUTES.MANAGE_VEHICLES} className="nav-link">{MESSAGES.MANAGE_VEHICLES}</Link>
            </>
          )}
        </nav>

        {/* Search Panel */}
        <div className="header-search">
          <SearchPanel onSearch={handleSearch} />
        </div>

        {/* Right side */}
        <div className="header-right">
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
