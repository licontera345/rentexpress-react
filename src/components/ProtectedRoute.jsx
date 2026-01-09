import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireEmployee = false }) => {
    const { isAuthenticated, isEmployee, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="loading-text">
                Cargando...
            </div>
        );
    }

    if (!isAuthenticated()) {
        alert('Debes iniciar sesión para acceder a esta sección');
        return <Navigate to="/" replace />;
    }

    if (requireEmployee && !isEmployee()) {
        alert('No tienes permisos para acceder a esta sección');
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;