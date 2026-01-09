import { createContext, useContext, useEffect, useState } from 'react';


const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);


    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };


    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
    };


    const value = {
        user,
        token,
        loading,
        isAuthenticated: user !== null && token !== null,
        isEmployee: user?.loginType === 'employee',
        login,
        logout
    };


    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};