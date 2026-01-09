import { useAuth } from '../context/AuthContext';

const Footer = () => {
    const { isAuthenticated } = useAuth();

    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>RentExpress</h3>
                    <p>
                        {isAuthenticated() ? 'Panel de administración' : 'Tu solución de alquiler de vehículos de confianza'}
                    </p>
                </div>
                
                <div className="footer-section">
                    <h4>{isAuthenticated() ? 'Soporte' : 'Contacto'}</h4>
                    <p>📧 {isAuthenticated() ? 'soporte@rentexpress.com' : 'info@rentexpress.com'}</p>
                    <p>📞 +34 900 123 456</p>
                </div>

                {!isAuthenticated() && (
                    <div className="footer-section">
                        <h4>Horario</h4>
                        <p>Lunes - Viernes: 8:00 - 20:00</p>
                        <p>Sábados: 9:00 - 14:00</p>
                    </div>
                )}
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} RentExpress. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;