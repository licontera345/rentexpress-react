import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ onLoginClick }) => {
    const { user, logout, isAuthenticated, isEmployee } = useAuth();

    return (
        <header className="app-header">
            <div className="header-brand">
                <h1>RentExpress</h1>
            </div>

            {isAuthenticated ? (
                <nav className="header-nav">
                    <span>
                        {isEmployee ? 'Empleado' : 'Usuario'} · {user?.username}
                    </span>
                    <button onClick={logout}>Cerrar sesión</button>
                </nav>
            ) : (
                <nav className="header-nav">
                    <Link to="/">Inicio</Link>
                    <button onClick={onLoginClick}>Iniciar sesión</button>
                </nav>
            )}
        </header>
    );
};

export default Header;
