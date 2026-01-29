import { useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../../common/layout/Header';
import Footer from '../../common/layout/Footer';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants';
import { MESSAGES } from '../../../constants/messages';

function PrivateLayout({ children }) {
  const { isEmployee } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleButtonRef = useRef(null);

  const menuItems = useMemo(() => {
    if (isEmployee) {
      return [
        { label: MESSAGES.DASHBOARD, to: ROUTES.DASHBOARD },
        { label: MESSAGES.EMPLOYEE_LIST_TITLE, to: ROUTES.EMPLOYEE_LIST },
        { label: MESSAGES.CLIENT_LIST_TITLE, to: ROUTES.CLIENT_LIST },
        { label: MESSAGES.VEHICLE_LIST_TITLE, to: ROUTES.VEHICLE_LIST },
        { label: MESSAGES.RESERVATIONS_LIST_TITLE, to: ROUTES.RESERVATIONS_LIST },
        { label: MESSAGES.RENTALS_LIST_TITLE, to: ROUTES.RENTALS_LIST },
      ];
    }

    return [
      { label: MESSAGES.DASHBOARD, to: ROUTES.DASHBOARD },
      { label: MESSAGES.MY_RESERVATIONS_TITLE, to: ROUTES.MY_RESERVATIONS },
      { label: MESSAGES.MY_RENTALS_TITLE, to: ROUTES.MY_RENTALS },
      { label: MESSAGES.PROFILE_TITLE, to: ROUTES.PROFILE },
    ];
  }, [isEmployee]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => {
    if (toggleButtonRef.current) {
      toggleButtonRef.current.focus();
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="private-layout">
      <a className="skip-link" href="#main-content">
        {MESSAGES.SKIP_TO_CONTENT}
      </a>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={toggleMenu}
        aria-label={MESSAGES.MENU_TOGGLE}
        aria-expanded={isMenuOpen}
        ref={toggleButtonRef}
      >
        <span className="sidebar-toggle-line" />
        <span className="sidebar-toggle-line" />
        <span className="sidebar-toggle-line" />
      </button>
      <aside className={`sidebar ${isMenuOpen ? 'is-open' : ''}`} inert={!isMenuOpen}>
        <div className="sidebar-header">
          <span className="sidebar-title">{MESSAGES.DASHBOARD}</span>
          <button type="button" className="sidebar-close" onClick={closeMenu}>
            {MESSAGES.CLOSE}
          </button>
        </div>
        <nav className="sidebar-nav" aria-label={MESSAGES.PRIMARY_NAVIGATION}>
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="sidebar-link"
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {isMenuOpen && <button type="button" className="sidebar-overlay" onClick={closeMenu} />}
      <Header />
      <main id="main-content" className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default PrivateLayout;
