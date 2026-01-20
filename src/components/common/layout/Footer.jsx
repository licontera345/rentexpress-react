
import logo from '../../../assets/logo.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <img className="footer-logo-image" src={logo} alt="RentExpress" />
            <span>RENTEXPRESS</span>
          </div>
          <p className="footer-description">
            Reserva online, confirma la recogida y disfruta de la ruta.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">CONTACTO</h3>
          <div className="footer-contact-info">
            <div className="contact-item">
              <p>Sede central</p>
              <p className="contact-detail">Av. des Mercedes, 123</p>
            </div>
            <div className="contact-item">
              <p className="contact-detail">Teléfono: +34 988 000 123</p>
            </div>
            <div className="contact-item">
              <p className="contact-detail">Email: soporte@rentexpress.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 RentExpress. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
