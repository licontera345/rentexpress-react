import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/public/Home';
import CatalogPage from './pages/public/Catalog';
import LoginPage from './pages/public/Login';
import ManageVehicles from './pages/private/ManageVehicles';
import './App.css';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentPage(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    // Proteger rutas privadas
    if (currentPage === 'manage-vehicles' && user?.loginType !== 'employee') {
      window.location.hash = 'home';
      return <HomePage />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'catalog':
        return <CatalogPage />;
      case 'login':
        return user ? <HomePage /> : <LoginPage />;
      case 'manage-vehicles':
        return <ManageVehicles />;
      default:
        return <HomePage />;
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div id="app">
      <Header />
      <main className={user ? 'main-with-sidebar' : 'main-full-width'}>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;