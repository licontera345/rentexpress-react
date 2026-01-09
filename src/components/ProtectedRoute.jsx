import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const ProtectedRoute = ({ children, requireEmployee = false }) => {
    const { isAuthenticated, isEmployee, loading } = useAuth();


    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/" replace />;
    if (requireEmployee && !isEmployee) return <Navigate to="/" replace />;


    return children;
};


export default ProtectedRoute;