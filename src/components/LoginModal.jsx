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
        <div 
            style={{ 
                display: 'flex', 
                position: 'fixed', 
                inset: 0, 
                zIndex: 1000, 
                background: 'rgba(0, 0, 0, 0.6)', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '20px' 
            }}
            onClick={onClose}
        >
            <div 
                style={{ 
                    background: 'white', 
                    borderRadius: '16px', 
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)', 
                    overflow: 'hidden', 
                    maxWidth: '420px', 
                    width: '100%' 
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px 16px', borderBottom: '1px solid #e2e8f0' }}>
                    <h5 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a' }}>Iniciar Sesión</h5>
                    <button 
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', fontSize: '2rem', color: '#64748b', cursor: 'pointer', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        ×
                    </button>
                </div>

                <div style={{ padding: '32px' }}>
                    <form onSubmit={handleSubmit}>
                        <p style={{ marginBottom: '12px' }}>Tipo de acceso:</p>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ marginRight: '16px', cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="loginType" 
                                    value="user" 
                                    checked={loginType === 'user'}
                                    onChange={(e) => setLoginType(e.target.value)}
                                    style={{ marginRight: '6px' }}
                                />
                                Usuario
                            </label>
                            <label style={{ cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="loginType" 
                                    value="employee"
                                    checked={loginType === 'employee'}
                                    onChange={(e) => setLoginType(e.target.value)}
                                    style={{ marginRight: '6px' }}
                                />
                                Empleado
                            </label>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Usuario:</label>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Contraseña:</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
                            />
                        </div>

                        {error && (
                            <div style={{ marginBottom: '16px', padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '0.9rem' }}>
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #380cd8 0%, #2e04c5 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase' }}
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;