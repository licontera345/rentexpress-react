import { Link } from 'react-router-dom';
import { getCurrentYear } from '../../utils/date.js';
import { ROUTES } from '../../constants/index.js';

/**
 * Pie presentacional. Textos por props para poder usar t() en el padre.
 */
export function Footer({
  brandName = 'RentExpress',
  tagline = 'Alquiler de vehículos',
  contactTitle = 'Contacto',
  contactItems = [],
  links = [
    { to: ROUTES.PRIVACY_POLICY, label: 'Privacidad' },
    { to: ROUTES.TERMS, label: 'Términos' },
    { to: ROUTES.CONTACT, label: 'Contacto' },
  ],
  copyrightTemplate = '© {year}',
}) {
  const year = getCurrentYear();
  const copyrightText = copyrightTemplate.replace('{year}', String(year));

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <span>{brandName}</span>
          </div>
          {tagline && <p className="footer-description">{tagline}</p>}
        </div>
        {contactItems.length > 0 && (
          <div className="footer-section">
            <h3 className="footer-title">{contactTitle}</h3>
            <div className="footer-contact-info">
              {contactItems.map((item, i) => (
                <div key={i} className="contact-item">
                  {item.label && <p>{item.label}</p>}
                  {item.value && <p className="contact-detail">{item.value}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="footer-bottom">
        <div className="footer-links">
          {links.map((link) => (
            <Link key={link.to} className="footer-link" to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>
        <p>{copyrightText}</p>
      </div>
    </footer>
  );
}

export default Footer;
