
import { MESSAGES } from '../../../constants';
import { t } from '../../../i18n';
import logo from '../../../assets/logo.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <img className="footer-logo-image" src={logo} alt="RentExpress" />
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
              <p className="contact-detail">{t('FOOTER_PHONE', { phone: '+34 988 000 123' })}</p>
            </div>
            <div className="contact-item">
              <p className="contact-detail">{t('FOOTER_EMAIL', { email: 'soporte@rentexpress.com' })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t('FOOTER_COPYRIGHT', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}

export default Footer;
