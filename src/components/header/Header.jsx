import { UseAuth } from 'src\hooks\UseAuth.js';

const Header = () => {
  const { user, logout } = UseAuth();

  return (
    <header className="header">
      <div className="header-brand">
        <img 
          src="/img/android-chrome-192x192.png" 
          alt="RentExpress Logo" 
          className="header-logo"
        />
        <h1>RentExpress</h1>
      </div>

      <nav className="header-nav">
        {!user ? (
          <>
            <a href="#home" className="nav-link">Inicio</a>
            <a href="#catalog" className="nav-link">Catálogo</a>
            <a href="#login" className="nav-link nav-link-primary">
              Iniciar Sesión
            </a>
          </>
        ) : (
          <>
            <div className="user-info">
              <span className="user-badge">
                {user.loginType === 'employee' ? 'Empleado' : 'Usuario'}
              </span>
              <span className="user-name">{user.username}</span>
            </div>
            <button 
              onClick={logout} 
              className="nav-link nav-link-danger"
            >
              Cerrar Sesión
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;