import { Routes, Route } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ManageVehiclesPage from './pages/ManageVehiclesPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';


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
                        <Route path="/manage-vehicles" element={
                            <ProtectedRoute requireEmployee>
                                <ManageVehiclesPage />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>
            </div>
            <Footer />
        </div>
    );
};


export default App;