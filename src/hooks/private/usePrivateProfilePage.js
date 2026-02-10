import { useMemo } from 'react';
import { useAuth } from '../core/useAuth';
import useHeadquarters from '../location/useHeadquarters';
import { MESSAGES, USER_ROLES } from '../../constants';
import {
  resolveEmployeeHeadquartersId,
  resolveEmployeeHeadquartersName,
  resolveEmployeeRoleName
} from '../../utils/profileUtils';

const usePrivateProfilePage = () => {
  const { user, role } = useAuth();
  const { headquarters } = useHeadquarters();
  const isEmployee = role === USER_ROLES.EMPLOYEE;

  const displayName = user?.firstName || user?.username || MESSAGES.USERNAME;
  const roleLabel = role ? (isEmployee ? MESSAGES.EMPLOYEE_ROLE : MESSAGES.CUSTOMER_ROLE) : MESSAGES.NOT_AVAILABLE;

  const employeeRoleName = resolveEmployeeRoleName(user);
  const headquartersNameFromUser = resolveEmployeeHeadquartersName(user);
  const headquartersId = resolveEmployeeHeadquartersId(user);

  const headquartersNameFromList = useMemo(() => {
    const headquartersMatch = headquarters.find((hq) => hq.id === headquartersId);
    return headquartersMatch?.name;
  }, [headquarters, headquartersId]);

  return {
    state: {
      user,
      isEmployee,
      displayName,
      roleLabel,
      employeeRoleName,
      employeeHeadquartersName: headquartersNameFromUser || headquartersNameFromList
    },
    ui: {},
    actions: {},
    meta: {}
  };
};

export default usePrivateProfilePage;
