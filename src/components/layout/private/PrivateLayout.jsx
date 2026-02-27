import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import Header from '../../common/layout/Header';
import Footer from '../../common/layout/Footer';
import useHeader from '../../../hooks/layout/useHeader';
import useKeyboardShortcuts from '../../../hooks/useKeyboardShortcuts';
import { usePrivateLayout } from '../../../hooks/private/usePrivatePages';
import { useAuth } from '../../../hooks/core/useAuth';
import { MESSAGES, USER_ROLES, getShortcutsForRole } from '../../../constants';
import KeyboardShortcutsHelp from '../../common/KeyboardShortcutsHelp';

function PrivateLayout({ children }) {
  const headerProps = useHeader();
  const { menuItems } = usePrivateLayout();
  const { role } = useAuth();
  const isEmployee = role === USER_ROLES.EMPLOYEE;
  const shortcuts = getShortcutsForRole(isEmployee);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  useKeyboardShortcuts({ onShowShortcutsHelp: () => setShowShortcutsHelp(true) });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleButtonRef = useRef(null);

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
      <Header
        {...headerProps}
        sidebarToggle={
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
        }
      />
      <main id="main-content" className="main-content">
        {children}
      </main>
      <Footer />
      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
        shortcuts={shortcuts}
      />
    </div>
  );
}

export default PrivateLayout;
