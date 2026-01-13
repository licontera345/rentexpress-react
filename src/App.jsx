import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Catalog from './pages/public/Catalog'

function Navbar() {
  return (
    <nav>
      <Link to="/">Inicio </Link>
      <Link to="/catalog"> Catálogo </Link>
      <Link to="/login"> Iniciar Sesión </Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter> 
  )
}

export default App;
