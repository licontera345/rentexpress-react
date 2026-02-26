import { Link } from 'react-router-dom';
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
import { ROUTES, MESSAGES, THEME } from '../../../constants';
import logo from '../../../assets/logo.png';
import CustomSelect from '../forms/CustomSelect';

function Header({
  theme,
  themeLabel,
  toggleTheme,
  isAuthenticated,
  profileImageSrc,
  displayName,
  roleLabel,
  locale,
  currentLocale,
  availableLocales,
  localeMetadata,
  handleLocaleChange,
  handleLogout,
  navigate,
  t,
  sidebarToggle
}) {
  return (
    <header className="header">
      <div className="header-container">
        {sidebarToggle}
        <Link to={ROUTES.HOME} className="logo">
          <img className="logo-image" src={logo} alt={MESSAGES.BRAND_NAME} />
          <span className="logo-text">{MESSAGES.BRAND_NAME}</span>
        </Link>

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
              )}
            </span>
            <CustomSelect
              id="header-language"
              name="locale"
              value={locale}
              onChange={handleLocaleChange}
              options={availableLocales.map((availableLocale) => ({
                value: availableLocale,
                label: localeMetadata[availableLocale]?.label ?? availableLocale.toUpperCase(),
              }))}
              variant="header"
              aria-label={MESSAGES.LANGUAGE_LABEL}
            />
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={t('THEME_TOGGLE', { mode: themeLabel.toLowerCase() })}
          >
            <span className="theme-toggle-icon" aria-hidden="true">
              {theme === THEME.DARK ? <FiSun /> : <FiMoon />}
            </span>
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
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={handleLogout}
                >
                  <FiLogOut aria-hidden="true" />
                  {MESSAGES.SIGN_OUT}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  <FiLogIn aria-hidden="true" />
                  {MESSAGES.SIGN_IN}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-small btn-register"
                  onClick={() => navigate(ROUTES.REGISTER)}
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
