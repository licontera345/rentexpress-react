import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiLogIn,
  FiLogOut,
  FiMoon,
  FiSun,
  FiUserPlus,
  FiUser,
  FiBookOpen,
  FiGlobe,
} from 'react-icons/fi';
import { ROUTES, MESSAGES } from '../../../constants';
import { availableLocales, getLocale, setLocale, subscribeLocale, t } from '../../../i18n';
import useTheme from '../../../hooks/core/useTheme';
import { useAuth } from '../../../hooks/core/useAuth';
import useProfileImage from '../../../hooks/profile/useProfileImage';
import { resolveUserId } from '../../../utils/profileUtils';
import {
  getThemeLabel,
  getThemeIcon,
  getLocaleMetadata,
  getUserDisplayName,
  getUserRoleLabel,
  LOCALE_METADATA
} from '../../../utils/headerUtils';
import logo from '../../../assets/logo.png';

// Componente Header que define la interfaz y organiza la lógica de esta vista.

function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, role, logout } = useAuth();
  const [locale, setLocaleState] = useState(getLocale());

  useEffect(() => {
    const unsubscribe = subscribeLocale(setLocaleState);

    return unsubscribe;
  }, []);

  const themeLabel = getThemeLabel(theme);
  const ThemeIcon = getThemeIcon(theme, { FiSun, FiMoon });
  const currentLocale = getLocaleMetadata(locale);
  const displayName = getUserDisplayName(user);
  const roleLabel = getUserRoleLabel(role);
  const userEntityId = resolveUserId(user);
  const { imageSrc: profileImageSrc } = useProfileImage({
    entityType: role === USER_ROLES.EMPLOYEE ? 'employee' : 'user',
    entityId: userEntityId,
    refreshKey: userEntityId ?? 0
  });

  const handleLocaleChange = (event) => {
    setLocale(event.target.value);
  };

  const handleLogout = () => {
    const shouldLogout = window.confirm(MESSAGES.CONFIRM_LOGOUT);
    if (!shouldLogout) return;
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="logo">
          <img className="logo-image" src={logo} alt={MESSAGES.BRAND_NAME} />
          <span className="logo-text">{MESSAGES.BRAND_NAME}</span>
        </Link>

        {/* Navigation Links */}
        <nav className="header-nav" aria-label={MESSAGES.PRIMARY_NAVIGATION}>
          <Link to={ROUTES.CATALOG} className="nav-link">
            <FiBookOpen aria-hidden="true" />
            <span>{MESSAGES.NAV_CATALOG}</span>
          </Link>
          {isAuthenticated && (
            <Link to={ROUTES.DASHBOARD} className="nav-link">
              <FiGrid aria-hidden="true" />
              <span>{MESSAGES.DASHBOARD}</span>
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="header-right">
          <div className="header-language-wrapper">
            <span
              className="header-language-flag"
              role="img"
              aria-label={t('LANGUAGE_LABEL_WITH_VALUE', { locale: locale.toUpperCase() })}
            >
              {currentLocale?.flag ? (
                <img
                  src={currentLocale.flag}
                  alt={currentLocale.name ?? locale.toUpperCase()}
                  className="header-language-flag-image"
                />
              ) : (
                <FiGlobe aria-hidden="true" />
              )
              }
            </span>
            <select
              className="header-language"
              value={locale}
              onChange={handleLocaleChange}
              aria-label={MESSAGES.LANGUAGE_LABEL}
            >
              {availableLocales.map((availableLocale) => (
                <option key={availableLocale} value={availableLocale}>
                  {LOCALE_METADATA[availableLocale]?.label ?? availableLocale.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={t('THEME_TOGGLE', { mode: themeLabel.toLowerCase() })}
          >
            <span className="theme-toggle-icon" aria-hidden="true"><ThemeIcon /></span>
            <span className="theme-toggle-text">{themeLabel}</span>
          </button>
          <div className="auth-buttons">
            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.PROFILE}
                  className="auth-user auth-user-link"
                  aria-label={MESSAGES.PROFILE_TITLE}
                >
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
                <button
                  className="btn-ghost"
                  onClick={handleLogout}
                  type="button"
                >
                  <FiLogOut aria-hidden="true" />
                  {MESSAGES.SIGN_OUT}
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn-ghost"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  type="button"
                >
                  <FiLogIn aria-hidden="true" />
                  {MESSAGES.SIGN_IN}
                </button>
                <button
                  className="btn-ghost btn-register"
                  onClick={() => navigate(ROUTES.REGISTER)}
                  type="button"
                >
                  <FiUserPlus aria-hidden="true" />
                  {MESSAGES.CREATE_ACCOUNT}
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
