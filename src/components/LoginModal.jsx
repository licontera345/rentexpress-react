import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/api';

const LoginModal = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginType, setLoginType] = useState('user');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Por favor, completa usuario y contraseña');
            return;
        }

        try {
            const credentials = { username, password };
            const data = loginType === 'user' 
                ? await AuthService.loginUser(credentials)
                : await AuthService.loginEmployee(credentials);

            login({ username, loginType }, data.token);
            onClose();
            setUsername('');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Credenciales inválidas');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-dialog modal-sm" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h5 className="modal-title">Iniciar Sesión</h5>
                    <button onClick={onClose} className="btn-close">×</button>
                </div>

                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="login-type-selector">
                            <p>Tipo de acceso:</p>
                            <label className="login-type-label">
                                <input 
                                    type="radio" 
                                    name="loginType" 
                                    value="user" 
                                    checked={loginType === 'user'}
                                    onChange={(e) => setLoginType(e.target.value)}
                                />
                                Usuario
                            </label>
                            <label className="login-type-label">
                                <input 
                                    type="radio" 
                                    name="loginType" 
                                    value="employee"
                                    checked={loginType === 'employee'}
                                    onChange={(e) => setLoginType(e.target.value)}
                                />
                                Empleado
                            </label>
                        </div>

                        <div className="form-group">
                            <label>Usuario:</label>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Contraseña:</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        <button type="submit" className="login-button">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;