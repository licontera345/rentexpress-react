import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { isEmployee } = useAuth();
    const location = useLocation();

    const employeeMenu = [
        { path: '/', icon: '🏠', text: 'Inicio' },
        { path: '/catalog', icon: '🚗', text: 'Catálogo' },
        { path: '/manage-vehicles', icon: '⚙️', text: 'Gestionar Vehículos' }
    ];

    const userMenu = [
        { path: '/', icon: '🏠', text: 'Inicio' },
        { path: '/catalog', icon: '🚗', text: 'Buscar Vehículos' }
    ];

    const menuItems = isEmployee() ? employeeMenu : userMenu;

    return (
        <aside style={{ position: 'fixed', left: '20px', top: '160px', width: '260px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: '0' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>Menú</h3>
            </div>
            <nav style={{ padding: '12px' }}>
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            color: location.pathname === item.path ? 'white' : '#64748b',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            marginBottom: '4px',
                            background: location.pathname === item.path ? 'linear-gradient(135deg, #380cd8 0%, #2e04c5 100%)' : 'transparent',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                        <span style={{ fontWeight: '500' }}>{item.text}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;