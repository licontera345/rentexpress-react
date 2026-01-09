import { useAuth } from '../context/AuthContext';

const Footer = () => {
    const { isAuthenticated } = useAuth();

    return (
        <footer style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', marginTop: '60px', padding: '40px 32px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '30px' }}>
                <div>
                    <h3 style={{ color: '#0f172a', marginBottom: '16px', fontSize: '1.5rem' }}>RentExpress</h3>
                    <p style={{ color: '#64748b', lineHeight: '1.8' }}>
                        {isAuthenticated() ? 'Panel de administración' : 'Tu solución de alquiler de vehículos de confianza'}
                    </p>
                </div>
                
                <div>
                    <h4 style={{ color: '#0f172a', marginBottom: '16px', fontSize: '1.1rem' }}>
                        {isAuthenticated() ? 'Soporte' : 'Contacto'}
                    </h4>
                    <p style={{ color: '#64748b', lineHeight: '1.8', marginBottom: '8px' }}>
                        📧 {isAuthenticated() ? 'soporte@rentexpress.com' : 'info@rentexpress.com'}
                    </p>
                    <p style={{ color: '#64748b', lineHeight: '1.8' }}>📞 +34 900 123 456</p>
                </div>

                {!isAuthenticated() && (
                    <div>
                        <h4 style={{ color: '#0f172a', marginBottom: '16px', fontSize: '1.1rem' }}>Horario</h4>
                        <p style={{ color: '#64748b', lineHeight: '1.8', marginBottom: '8px' }}>Lunes - Viernes: 8:00 - 20:00</p>
                        <p style={{ color: '#64748b', lineHeight: '1.8' }}>Sábados: 9:00 - 14:00</p>
                    </div>
                )}
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                <p>&copy; {new Date().getFullYear()} RentExpress. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;