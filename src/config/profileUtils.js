import { USER_ROLES } from '../constants';

export const resolveAddress = (currentUser) => {
  if (!currentUser) return null;
  if (Array.isArray(currentUser.address) && currentUser.address.length > 0) {
    return currentUser.address[0];
  }
  if (currentUser.address && typeof currentUser.address === 'object') {
    return currentUser.address;
  }
  return null;
};

export const resolveUserId = (currentUser) => (
  currentUser?.userId || currentUser?.id || currentUser?.employeeId || null
);

export const resolveEmployeeRoleId = (currentUser) => (
  currentUser?.roleId || currentUser?.role?.roleId || currentUser?.role?.id || null
);

export const resolveEmployeeHeadquartersId = (currentUser) => (
  currentUser?.headquartersId || currentUser?.headquarters?.headquartersId || currentUser?.headquarters?.id || null
);

export const resolveEmployeeRoleName = (currentUser) => {
  if (!currentUser) return null;
  const candidate = (
    currentUser?.role?.roleName ||
    currentUser?.role?.name ||
    currentUser?.employeeRole ||
    currentUser?.position ||
    currentUser?.roleName ||
    null
  );
  if (typeof candidate === 'string' && candidate.toLowerCase() === USER_ROLES.EMPLOYEE) {
    return null;
  }
  return candidate;
};

export const resolveEmployeeHeadquartersName = (currentUser) => (
  currentUser?.headquarters?.headquartersName ||
  currentUser?.headquarters?.name ||
  currentUser?.headquartersName ||
  null
);
