import { useAuth } from '../context/AuthContext';

const Footer = () => {
    const { isAuthenticated } = useAuth();

    return (
        <footer className="app-footer">
            <p>
                {isAuthenticated
                    ? 'Panel de administración'
                    : 'Tu solución de alquiler de vehículos'}
            </p>
        </footer>
    );
};

export default Footer;
