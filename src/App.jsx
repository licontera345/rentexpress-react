import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ManageVehiclesPage from './pages/ManageVehiclesPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="app-container">
            <Header />

            <div className="app-layout">
                {isAuthenticated && <Sidebar />}

                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/catalog" element={<CatalogPage />} />
                        <Route
                            path="/manage-vehicles"
                            element={
                                <ProtectedRoute requireEmployee>
                                    <ManageVehiclesPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default App;
