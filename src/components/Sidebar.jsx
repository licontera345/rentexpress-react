import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { isEmployee } = useAuth();
    const location = useLocation();

    const employeeMenu = [
        { path: '/', text: 'Inicio' },
        { path: '/catalog', text: 'Catálogo' },
        { path: '/manage-vehicles', text: 'Gestionar vehículos' }
    ];

    const userMenu = [
        { path: '/', text: 'Inicio' },
        { path: '/catalog', text: 'Buscar vehículos' }
    ];

    const menu = isEmployee ? employeeMenu : userMenu;

    return (
        <aside className="sidebar">
            {menu.map(item => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={location.pathname === item.path ? 'active' : ''}
                >
                    {item.text}
                </Link>
            ))}
        </aside>
    );
};

export default Sidebar;
