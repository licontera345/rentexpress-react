import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, MESSAGES } from '../../../constants';
import { availableLocales, getLocale, setLocale, subscribeLocale, t } from '../../../i18n';
import useTheme from '../../../hooks/useTheme';
import logo from '../../../assets/logo.png';

function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [locale, setLocaleState] = useState(getLocale());

  useEffect(() => {
    const unsubscribe = subscribeLocale(setLocaleState);

    return unsubscribe;
  }, []);

  const themeLabel = theme === 'dark' ? MESSAGES.THEME_LIGHT : MESSAGES.THEME_DARK;
  const themeIcon = theme === 'dark' ? '☀️' : '🌙';
  const localeFlags = {
    en: '🇺🇸',
    es: '🇪🇸',
    fr: '🇫🇷',
  };

  const handleLocaleChange = (event) => {
    setLocale(event.target.value);
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
        <nav className="header-nav">
          <Link to={ROUTES.CATALOG} className="nav-link">{MESSAGES.NAV_CATALOG}</Link>
        </nav>

        {/* Right side */}
        <div className="header-right">
          <div className="header-language-wrapper">
            <span
              className="header-language-flag"
              role="img"
              aria-label={`${MESSAGES.LANGUAGE_LABEL}: ${locale.toUpperCase()}`}
            >
              {localeFlags[locale] ?? '🌐'}
            </span>
            <select
              className="header-language"
              value={locale}
              onChange={handleLocaleChange}
              aria-label={MESSAGES.LANGUAGE_LABEL}
            >
              {availableLocales.map((availableLocale) => (
                <option key={availableLocale} value={availableLocale}>
                  {localeFlags[availableLocale] ?? '🌐'} {availableLocale.toUpperCase()}
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
