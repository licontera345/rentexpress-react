import { useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiBriefcase,
  FiCalendar,
  FiGrid,
  FiMenu,
  FiTruck,
  FiUser,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import Header from '../../common/layout/Header';
import Footer from '../../common/layout/Footer';
import { useAuth } from '../../../hooks/core/useAuth';
import { MESSAGES, ROUTES } from '../../../constants';

// Componente PrivateLayout que define la interfaz y organiza la lógica de esta vista.

function PrivateLayout({ children }) {
  const { isEmployee } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleButtonRef = useRef(null);

  const menuItems = useMemo(() => {
    if (isEmployee) {
      return [
        { label: MESSAGES.DASHBOARD, to: ROUTES.DASHBOARD, icon: FiGrid },
        { label: MESSAGES.EMPLOYEE_LIST_TITLE, to: ROUTES.EMPLOYEE_LIST, icon: FiBriefcase },
        { label: MESSAGES.CLIENT_LIST_TITLE, to: ROUTES.CLIENT_LIST, icon: FiUsers },
        { label: MESSAGES.VEHICLE_LIST_TITLE, to: ROUTES.VEHICLE_LIST, icon: FiTruck },
        { label: MESSAGES.RESERVATIONS_LIST_TITLE, to: ROUTES.RESERVATIONS_LIST, icon: FiCalendar },
        { label: MESSAGES.RENTALS_LIST_TITLE, to: ROUTES.RENTALS_LIST, icon: FiCalendar },
      ];
    }

    return [
      { label: MESSAGES.DASHBOARD, to: ROUTES.DASHBOARD, icon: FiGrid },
      { label: MESSAGES.MY_RESERVATIONS_TITLE, to: ROUTES.MY_RESERVATIONS, icon: FiCalendar },
      { label: MESSAGES.MY_RENTALS_TITLE, to: ROUTES.MY_RENTALS, icon: FiCalendar },
      { label: MESSAGES.PROFILE_TITLE, to: ROUTES.PROFILE, icon: FiUser },
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
        <FiMenu aria-hidden="true" />
      </button>
      <aside className={`sidebar ${isMenuOpen ? 'is-open' : ''}`} inert={!isMenuOpen}>
        <div className="sidebar-header">
          <span className="sidebar-title">{MESSAGES.DASHBOARD}</span>
          <button type="button" className="sidebar-close" onClick={closeMenu}>
            <FiX aria-hidden="true" />
            <span>{MESSAGES.CLOSE}</span>
          </button>
        </div>
        <nav className="sidebar-nav" aria-label={MESSAGES.PRIMARY_NAVIGATION}>
          {menuItems.map((item) => {
            const ItemIcon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="sidebar-link"
                onClick={closeMenu}
              >
                {ItemIcon ? <ItemIcon aria-hidden="true" /> : null}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
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
