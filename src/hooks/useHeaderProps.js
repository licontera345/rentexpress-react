import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, THEME, USER_ROLES } from '../constants/index.js';
import { useAuth } from './useAuth.js';
import { useTheme } from './useTheme.js';

/**
 * Devuelve las props para Header. El layout las pasa al Header presentacional.
 * Sin i18n: labels en español. Cuando haya t(), el padre puede mapear.
 */
export function useHeaderProps() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, role, logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    navigate(ROUTES.HOME);
  }, [logout, navigate]);

  return {
    theme,
    themeLabel: theme === THEME.DARK ? 'Claro' : 'Oscuro',
    toggleTheme,
    isAuthenticated,
    displayName: user?.firstName ?? user?.username ?? '',
    roleLabel: role === USER_ROLES.EMPLOYEE ? 'Empleado' : 'Cliente',
    profileImageSrc: null,
    handleLogout,
    navigate,
  };
}

export default useHeaderProps;
