import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useHeaderProps } from '../../hooks/index.js';
import { useAuth } from '../../hooks/index.js';
import { getShortcutsForRole } from '../../constants/index.js';

/**
 * Layout privado: sidebar (menú), Header con toggle, main, Footer.
 * menuItems: [{ to, label }]. Si no se pasan, se construyen con getShortcutsForRole usando labelKey como label.
 */
export function PrivateLayout({
  children,
  menuItems: menuItemsProp,
  skipToContentLabel = 'Ir al contenido',
  menuTitle = 'Panel',
  closeLabel = 'Cerrar',
  menuToggleLabel = 'Menú',
  ...footerProps
}) {
  const headerProps = useHeaderProps();
  const { isEmployee } = useAuth();
  const shortcuts = getShortcutsForRole(isEmployee);
  const menuItems = menuItemsProp ?? shortcuts.map((s) => ({ to: s.route, label: s.labelKey }));

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleButtonRef = useRef(null);

  const closeMenu = () => {
    toggleButtonRef.current?.focus();
    setIsMenuOpen(false);
  };

  const sidebarToggle = (
    <button
      type="button"
      className="sidebar-toggle"
      onClick={() => setIsMenuOpen((o) => !o)}
      aria-label={menuToggleLabel}
      aria-expanded={isMenuOpen}
      ref={toggleButtonRef}
    >
      <FiMenu aria-hidden="true" />
    </button>
  );

  return (
    <div className="private-layout">
      <a className="skip-link" href="#main-content">
        {skipToContentLabel}
      </a>
      <aside className={`sidebar ${isMenuOpen ? 'is-open' : ''}`} inert={!isMenuOpen ? '' : undefined}>
        <div className="sidebar-header">
          <span className="sidebar-title">{menuTitle}</span>
          <button type="button" className="sidebar-close" onClick={closeMenu} aria-label={closeLabel}>
            <FiX aria-hidden="true" />
            <span>{closeLabel}</span>
          </button>
        </div>
        <nav className="sidebar-nav" aria-label="Principal">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="sidebar-link"
              onClick={closeMenu}
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      {isMenuOpen && (
        <button type="button" className="sidebar-overlay" aria-label={closeLabel} onClick={closeMenu} />
      )}
      <Header {...headerProps} sidebarToggle={sidebarToggle} />
      <main id="main-content" className="main-content">
        {children}
      </main>
      <Footer {...footerProps} />
    </div>
  );
}

export default PrivateLayout;
