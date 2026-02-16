import PublicLayout from '../../components/layout/public/PublicLayout';
import { MESSAGES } from '../../constants';
import { t } from '../../i18n';

function Contact() {
  return (
    <PublicLayout>
      <article className="contact-page">
        <header className="contact-page-header">
          <h1>{MESSAGES.CONTACT_TITLE}</h1>
          <p className="contact-page-subtitle">{MESSAGES.CONTACT_SUBTITLE}</p>
        </header>

        <section className="contact-page-content">
          <div className="contact-page-info">
            <div className="contact-info-item">
              <h3>{MESSAGES.CONTACT_ADDRESS_LABEL}</h3>
              <p>{MESSAGES.FOOTER_ADDRESS}</p>
            </div>
            <div className="contact-info-item">
              <h3>{MESSAGES.CONTACT_PHONE_LABEL}</h3>
              <p>{t('FOOTER_PHONE', { phone: '+34 XXX 000 123' })}</p>
            </div>
            <div className="contact-info-item">
              <h3>{MESSAGES.CONTACT_EMAIL_LABEL}</h3>
              <p>
                <a href="mailto:soporte@rentexpress.com">soporte@rentexpress.com</a>
              </p>
            </div>
          </div>
          <div className="contact-page-cta">
            <p>{MESSAGES.SUPPORT_HINT}</p>
            <a href="mailto:soporte@rentexpress.com" className="contact-send-link">
              {MESSAGES.CONTACT_SEND}
            </a>
          </div>
        </section>
      </article>
    </PublicLayout>
  );
}

export default Contact;
