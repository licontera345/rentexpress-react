import { Link } from 'react-router-dom';
import { FiGrid, FiLogIn, FiLogOut, FiUserPlus, FiUser, FiBookOpen, FiMoon, FiSun } from 'react-icons/fi';
import { ROUTES, THEME } from '../../constants/index.js';

/**
 * Cabecera presentacional. Todas las etiquetas por props para poder usar t() en el padre.
 */
export function Header({
  homeTo = ROUTES.HOME,
  brandName = 'RentExpress',
  logoSrc,
  navLinks = [],
  sidebarToggle,
  theme,
  themeLabel,
  onToggleTheme,
  isAuthenticated,
  profileTo = ROUTES.PROFILE,
  profileImageSrc,
  displayName,
  roleLabel,
  onLogout,
  loginTo = ROUTES.LOGIN,
  registerTo = ROUTES.REGISTER,
  signInLabel = 'Entrar',
  signOutLabel = 'Salir',
  createAccountLabel = 'Crear cuenta',
  catalogLabel = 'Catálogo',
  dashboardLabel = 'Panel',
  skipToContentLabel = 'Ir al contenido',
  navigate,
}) {
  const navItems = [
    { to: ROUTES.CATALOG, label: catalogLabel },
    ...(isAuthenticated ? [{ to: ROUTES.DASHBOARD, label: dashboardLabel }] : []),
    ...navLinks,
  ];

  return (
    <header className="header">
      <div className="header-container">
        {sidebarToggle}
        <Link to={homeTo} className="logo">
          {logoSrc && <img className="logo-image" src={logoSrc} alt="" />}
          <span className="logo-text">{brandName}</span>
        </Link>
        <nav className="header-nav" aria-label="Principal">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="nav-link">
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="header-right">
          {onToggleTheme && (
            <button
              type="button"
              className="theme-toggle"
              onClick={onToggleTheme}
              aria-label={themeLabel}
            >
              <span aria-hidden="true">
                {theme === THEME.DARK ? <FiSun /> : <FiMoon />}
              </span>
            </button>
          )}
          <div className="auth-buttons">
            {isAuthenticated ? (
              <>
                <Link to={profileTo} className="auth-user auth-user-link" aria-label="Perfil">
                  <span className="auth-user-avatar" aria-hidden="true">
                    {profileImageSrc ? (
                      <img src={profileImageSrc} alt="" className="auth-user-avatar-image" />
                    ) : (
                      <FiUser aria-hidden="true" />
                    )}
                  </span>
                  <span className="auth-user-text">
                    <span className="auth-user-name">{displayName}</span>
                    <span className="auth-user-role">{roleLabel}</span>
                  </span>
                </Link>
                <button type="button" className="btn btn-ghost btn-small" onClick={onLogout}>
                  <FiLogOut aria-hidden="true" />
                  {signOutLabel}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={() => navigate?.(loginTo)}
                >
                  <FiLogIn aria-hidden="true" />
                  {signInLabel}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-small btn-register"
                  onClick={() => navigate?.(registerTo)}
                >
                  <FiUserPlus aria-hidden="true" />
                  {createAccountLabel}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
