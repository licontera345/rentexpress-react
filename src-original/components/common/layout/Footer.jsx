import { Link } from 'react-router-dom';
import { MESSAGES, ROUTES } from '../../../constants';
import { t } from '../../../i18n';
import { getCurrentYear } from '../../../utils/form/formatters';
import logo from '../../../assets/logo.png';

// Componente Footer que define la interfaz y organiza la lógica de esta vista.

function Footer() {
  const currentYear = getCurrentYear();
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <img className="footer-logo-image" src={logo} alt={MESSAGES.BRAND_NAME} />
            <span>{MESSAGES.BRAND_NAME}</span>
          </div>
          <p className="footer-description">
            {MESSAGES.FOOTER_TAGLINE}
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">{MESSAGES.FOOTER_CONTACT_TITLE}</h3>
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
        <p>{t('FOOTER_COPYRIGHT', { year: currentYear })}</p>
      </div>
    </footer>
  );
}

export default Footer;
