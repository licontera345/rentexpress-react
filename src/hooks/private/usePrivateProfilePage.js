import { useMemo } from 'react';
import { useAuth } from '../core/useAuth';
import useHeadquarters from '../location/useHeadquarters';
import { MESSAGES, USER_ROLES } from '../../constants';
import { resolveUserId } from '../../utils/ui/uiUtils';
import useProfileImage from '../profile/useProfileImage';
import { useClientProfilePage } from '../client/useClientPages';
import useEmployeeProfilePage from '../employee/useEmployeeProfilePage';

const usePrivateProfilePage = () => {
  const { user, role, profileImageVersion } = useAuth();
  const { headquarters } = useHeadquarters();
  const isEmployee = role === USER_ROLES.EMPLOYEE;

  const clientProfile = useClientProfilePage();
  const employeeProfile = useEmployeeProfilePage();

  const displayName = user?.firstName || user?.username || MESSAGES.USERNAME;
  const roleLabel = role ? (isEmployee ? MESSAGES.EMPLOYEE_ROLE : MESSAGES.CUSTOMER_ROLE) : MESSAGES.NOT_AVAILABLE;

  const employeeRoleName = user?.roleName ?? user?.role?.roleName ?? null;
  const headquartersNameFromUser = user?.headquarters?.name ?? null;
  const headquartersId = user?.headquartersId ?? user?.headquarters?.id ?? null;

  const profileEntityId = isEmployee ? (user?.employeeId ?? resolveUserId(user)) : (user?.userId ?? resolveUserId(user));
  const { imageSrc: profileImageSrc } = useProfileImage({
    entityType: isEmployee ? 'employee' : 'user',
    entityId: profileEntityId,
    refreshKey: `${profileEntityId ?? 0}-${profileImageVersion ?? 0}`,
  });

  const headquartersNameFromList = useMemo(() => {
    const headquartersMatch = headquarters.find((hq) => hq.id === headquartersId);
    return headquartersMatch?.name;
  }, [headquarters, headquartersId]);

  const profileSection = isEmployee ? employeeProfile : clientProfile;

  return {
    state: {
      user,
      isEmployee,
      displayName,
      roleLabel,
      employeeRoleName,
      employeeHeadquartersName: headquartersNameFromUser || headquartersNameFromList,
      profileImageSrc,
    },
    profileSection: {
      state: profileSection.state,
      ui: profileSection.ui,
      actions: profileSection.actions,
      loadingProfile: profileSection.loadingProfile,
    },
  };
};

export default usePrivateProfilePage;
