import { useMemo } from 'react';
import { useAuth } from '../core/useAuth';
import { USER_ROLES } from '../../constants';
import { getMenuItems } from '../../utils/uiUtils';

/**
 * Hook con la lógica del layout privado: ítems del menú según rol.
 */
function usePrivateLayout() {
  const { role } = useAuth();
  const isEmployee = role === USER_ROLES.EMPLOYEE;

  const menuItems = useMemo(() => getMenuItems(isEmployee), [isEmployee]);

  return { menuItems };
}

export default usePrivateLayout;
