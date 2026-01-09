import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ManageVehiclesPage from './pages/ManageVehiclesPage';

const AppContent = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { isAuthenticated } = useAuth();

    return (
        <>
            <div className="app-container">
                <Header onLoginClick={() => setShowLoginModal(true)} />

                <div className="app-layout">
                    {isAuthenticated() && <Sidebar />}
                    
                    <main className={`app-main ${isAuthenticated() ? 'with-sidebar' : ''}`}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/catalog" element={<CatalogPage />} />
                            <Route 
                                path="/manage-vehicles" 
                                element={
                                    <ProtectedRoute requireEmployee={true}>
                                        <ManageVehiclesPage />
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    </main>
                </div>

                <Footer />
            </div>

            <LoginModal 
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;