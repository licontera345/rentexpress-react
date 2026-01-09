import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ onLoginClick }) => {
    const { user, logout, isAuthenticated, isEmployee } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '20px 32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="/img/android-chrome-192x192.png" alt="RentExpress Logo" style={{ height: '48px', width: 'auto' }} />
                <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>RentExpress</h1>
            </div>

            {isAuthenticated() ? (
                <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', background: '#f1f5f9', borderRadius: '8px' }}>
                        <span style={{ background: '#380cd8', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                            {isEmployee() ? 'Empleado' : 'Usuario'}
                        </span>
                        <span style={{ fontWeight: '600', color: '#0f172a' }}>
                            {user?.username}
                        </span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        style={{ background: '#dc3545', color: 'white', textDecoration: 'none', fontWeight: '500', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                        Cerrar Sesión
                    </button>
                </nav>
            ) : (
                <nav>
                    <Link to="/" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500', padding: '8px 16px', borderRadius: '6px', marginRight: '8px' }}>
                        Inicio
                    </Link>
                    <button 
                        onClick={onLoginClick}
                        style={{ background: 'linear-gradient(135deg, #380cd8 0%, #2e04c5 100%)', color: 'white', textDecoration: 'none', fontWeight: '500', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                    >
                        Iniciar Sesión
                    </button>
                </nav>
            )}
        </header>
    );
};

export default Header;