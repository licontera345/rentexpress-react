import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth';
import { USER_ROLES } from '../../constants';

/**
 * Devuelve la traducción según el perfil/rol del usuario (i18n por perfil).
 * Prueba primero la clave con sufijo del rol (keyBase_EMPLOYEE, keyBase_CUSTOMER, keyBase_ADMIN)
 * y si no existe usa la clave genérica keyBase.
 *
 * @param {string} keyBase - Clave base de traducción (ej. 'DASHBOARD_TITLE')
 * @returns {string} Texto traducido para el rol actual
 */
export function useProfileMessage(keyBase) {
  const { t } = useTranslation();
  const { role } = useAuth();

  return useMemo(() => {
    const suffix = role === USER_ROLES.ADMIN ? 'ADMIN' : role === USER_ROLES.EMPLOYEE ? 'EMPLOYEE' : 'CUSTOMER';
    const roleKey = `${keyBase}_${suffix}`;
    const fallback = t(keyBase);
    const byRole = t(roleKey);
    return byRole !== roleKey ? byRole : fallback;
  }, [t, role, keyBase]);
}

export default useProfileMessage;
