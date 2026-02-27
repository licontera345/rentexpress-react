import './i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import './styles/app.css';
//import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(

    // <GoogleOAuthProvider clientId="983385335826-4gcf6skskeh4votp94gbdeo5se6us97g.apps.googleusercontent.com">
    //     <App />
    // </GoogleOAuthProvider>
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
