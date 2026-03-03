import { Link } from 'react-router-dom';
import { MESSAGES, ROUTES, USER_ROLES } from '../../../constants';
import { t } from '../../../i18n';
import { useAuth } from '../../../hooks/core/useAuth';
import logo from '../../../assets/logo.png';

function Footer() {
  const { isAuthenticated, role } = useAuth();
  const isEmployee = role === USER_ROLES.EMPLOYEE;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <img className="footer-logo-image" src={logo} alt={MESSAGES.LOGO_ALT} />
            <span>{MESSAGES.BRAND_NAME}</span>
          </div>
          <p className="footer-description">
            {MESSAGES.FOOTER_TAGLINE}
          </p>
        </div>

        <div className="footer-section">
          <h2 className="footer-title">{MESSAGES.FOOTER_NAV_LABEL}</h2>
          <nav className="footer-nav" aria-label={MESSAGES.FOOTER_NAV_LABEL}>
            <ul className="footer-nav-list">
              <li><Link className="footer-link" to={ROUTES.HOME}>{MESSAGES.NAV_HOME}</Link></li>
              {!isEmployee && (
                <li><Link className="footer-link" to={ROUTES.CATALOG}>{MESSAGES.NAV_CATALOG}</Link></li>
              )}
              <li><Link className="footer-link" to={ROUTES.CONTACT}>{MESSAGES.CONTACT_TITLE}</Link></li>
              {!isAuthenticated && (
                <>
                  <li><Link className="footer-link" to={ROUTES.LOGIN}>{MESSAGES.SIGN_IN}</Link></li>
                  <li><Link className="footer-link" to={ROUTES.REGISTER}>{MESSAGES.CREATE_ACCOUNT}</Link></li>
                </>
              )}
              {isAuthenticated && (
                <>
                  <li><Link className="footer-link" to={ROUTES.DASHBOARD}>{MESSAGES.DASHBOARD}</Link></li>
                  <li><Link className="footer-link" to={ROUTES.PROFILE}>{MESSAGES.PROFILE_TITLE}</Link></li>
                </>
              )}
            </ul>
          </nav>
        </div>

        <div className="footer-section">
          <h2 className="footer-title">{MESSAGES.FOOTER_CONTACT_TITLE}</h2>
          <div className="footer-contact-info">
            <div className="contact-item">
              <p>{MESSAGES.FOOTER_HQ_LABEL}</p>
              <p className="contact-detail">{MESSAGES.FOOTER_ADDRESS}</p>
            </div>
            <div className="contact-item">
              <p className="contact-detail">{t('FOOTER_PHONE', { phone: '+34 XXX 000 123' })}</p>
            </div>
            <div className="contact-item">
              <p className="contact-detail">{t('FOOTER_EMAIL', { email: 'soporte@rentexpress.com' })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-links">
          <Link className="footer-link" to={ROUTES.PRIVACY_POLICY}>
            {MESSAGES.PRIVACY_POLICY}
          </Link>
          <Link className="footer-link" to={ROUTES.TERMS}>
            {MESSAGES.TERMS_LINK}
          </Link>
          <Link className="footer-link" to={ROUTES.CONTACT}>
            {MESSAGES.CONTACT_TITLE}
          </Link>
        </div>
        <p>{t('FOOTER_COPYRIGHT', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}

export default Footer;
