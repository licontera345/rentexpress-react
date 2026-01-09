import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ onLoginClick }) => {
    const { user, logout, isAuthenticated, isEmployee } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="app-header">
            <div className="header-brand">
                <img src="/img/android-chrome-192x192.png" alt="RentExpress Logo" className="header-logo" />
                <h1 className="header-title">RentExpress</h1>
            </div>

            {isAuthenticated() ? (
                <nav className="header-nav">
                    <div className="header-user-info">
                        <span className="header-user-badge">
                            {isEmployee() ? 'Empleado' : 'Usuario'}
                        </span>
                        <span className="header-username">
                            {user?.username}
                        </span>
                    </div>
                    <button onClick={handleLogout} className="btn-logout">
                        Cerrar Sesión
                    </button>
                </nav>
            ) : (
                <nav className="header-nav">
                    <Link to="/" className="nav-link">
                        Inicio
                    </Link>
                    <button onClick={onLoginClick} className="btn-login">
                        Iniciar Sesión
                    </button>
                </nav>
            )}
        </header>
    );
};

export default Header;