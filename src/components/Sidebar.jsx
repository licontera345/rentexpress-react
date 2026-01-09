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
        <aside className="sidebar">
            <div className="sidebar-header">
                <h3 className="sidebar-title">Menú</h3>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="sidebar-link-icon">{item.icon}</span>
                        <span className="sidebar-link-text">{item.text}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;