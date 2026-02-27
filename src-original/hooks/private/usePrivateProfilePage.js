import { useMemo } from 'react';
import { useAuth } from '../core/useAuth';
import useHeadquarters from '../location/useHeadquarters';
import { MESSAGES, USER_ROLES } from '../../constants';
import { resolveUserId } from '../../utils/ui/uiUtils';
import useProfileImage from '../profile/useProfileImage';
import { useClientProfilePage } from '../client/useClientPages';
import useEmployeeProfilePage from '../employee/useEmployeeProfilePage';

const usePrivateProfilePage = () => {
  const { user, role } = useAuth();
  const { headquarters } = useHeadquarters();
  const isEmployee = role === USER_ROLES.EMPLOYEE;

  const clientProfile = useClientProfilePage();
  const employeeProfile = useEmployeeProfilePage();

  // Nombre de usuario para la sección de perfil.
  const displayName = user?.firstName || user?.username || MESSAGES.USERNAME;
  // Rol del usuario para la sección de perfil.
  const roleLabel = role ? (isEmployee ? MESSAGES.EMPLOYEE_ROLE : MESSAGES.CUSTOMER_ROLE) : MESSAGES.NOT_AVAILABLE;

  // Rol del empleado para la sección de perfil.
  const employeeRoleName = user?.roleName ?? user?.role?.roleName ?? null;
  // Nombre de la sede del empleado para la sección de perfil.
  const headquartersNameFromUser = user?.headquarters?.name ?? null;
  // Identificador de la sede del empleado para la sección de perfil.
  const headquartersId = user?.headquartersId ?? user?.headquarters?.id ?? null;

  // Identificador de entidad para la imagen de perfil.
  const profileEntityId = isEmployee ? (user?.employeeId ?? resolveUserId(user)) : (user?.userId ?? resolveUserId(user));
  const { imageSrc: profileImageSrc } = useProfileImage({
    entityType: isEmployee ? 'employee' : 'user',
    entityId: profileEntityId,
    refreshKey: profileEntityId ?? 0
  });

  // Nombre de la sede del empleado para la sección de perfil.
  const headquartersNameFromList = useMemo(() => {
    const headquartersMatch = headquarters.find((hq) => hq.id === headquartersId);
    return headquartersMatch?.name;
  }, [headquarters, headquartersId]);

  // Sección de perfil para el cliente o el empleado.
  const profileSection = isEmployee ? employeeProfile : clientProfile;

  return {
    // Estado de la sección de perfil.
    state: {
      user,
      isEmployee,
      displayName,
      roleLabel,
      employeeRoleName,
      employeeHeadquartersName: headquartersNameFromUser || headquartersNameFromList,
      profileImageSrc
    },
    profileSection: {
      state: profileSection.state,
      ui: profileSection.ui,
      actions: profileSection.actions
    }
  };
};

export default usePrivateProfilePage;
