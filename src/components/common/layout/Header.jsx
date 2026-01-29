import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, THEME, USER_ROLES } from '../../../constants';
import { MESSAGES } from '../../../constants/messages';
import { availableLocales, getLocale, setLocale, subscribeLocale, t } from '../../../i18n';
import useTheme from '../../../hooks/useTheme';
import { useAuth } from '../../../hooks/useAuth';
import logo from '../../../assets/logo.png';
import flagUs from '../../../assets/flags/us.svg';
import flagEs from '../../../assets/flags/es.svg';
import flagFr from '../../../assets/flags/fr.svg';

function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, role, logout } = useAuth();
  const [locale, setLocaleState] = useState(getLocale());

  useEffect(() => {
    const unsubscribe = subscribeLocale(setLocaleState);

    return unsubscribe;
  }, []);

  const themeLabel = theme === THEME.DARK ? MESSAGES.THEME_LIGHT : MESSAGES.THEME_DARK;
  const themeIcon = theme === THEME.DARK ? '☀️' : '🌙';
  const localeMetadata = {
    en: { label: 'EN', flag: flagUs, name: 'United States' },
    es: { label: 'ES', flag: flagEs, name: 'España' },
    fr: { label: 'FR', flag: flagFr, name: 'France' },
  };
  const currentLocale = localeMetadata[locale] ?? { label: locale.toUpperCase() };
  const displayName = user?.firstName || user?.username || MESSAGES.USERNAME;
  const roleLabel = role === USER_ROLES.EMPLOYEE ? MESSAGES.EMPLOYEE_ROLE : MESSAGES.CUSTOMER_ROLE;

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
          <img className="logo-image" src={logo} alt="RentExpress" />
          <span className="logo-text">RentExpress</span>
        </Link>

        {/* Navigation Links */}
        <nav className="header-nav" aria-label={MESSAGES.PRIMARY_NAVIGATION}>
          <Link to={ROUTES.CATALOG} className="nav-link">{MESSAGES.NAV_CATALOG}</Link>
          {isAuthenticated && (
            <Link to={ROUTES.DASHBOARD} className="nav-link">{MESSAGES.DASHBOARD}</Link>
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
              ) : ('🌐')
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
                  {localeMetadata[availableLocale]?.label ?? availableLocale.toUpperCase()}
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
            <span className="theme-toggle-icon" aria-hidden="true">{themeIcon}</span>
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
                  <span className="auth-user-name">{displayName}</span>
                  <span className="auth-user-role">{roleLabel}</span>
                </Link>
                <button
                  className="btn-ghost"
                  onClick={handleLogout}
                  type="button"
                >
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
                  {MESSAGES.SIGN_IN}
                </button>
                <button
                  className="btn-ghost btn-register"
                  onClick={() => navigate(ROUTES.REGISTER)}
                  type="button"
                >
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
