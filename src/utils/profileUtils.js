import { USER_ROLES } from '../constants';

// Resuelve la dirección principal del usuario, sin importar el formato de entrada.
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

// Obtiene un identificador de usuario/empleado a partir de distintos campos.
export const resolveUserId = (currentUser) => (
  currentUser?.userId || currentUser?.id || null
);

// Obtiene el id de rol desde diferentes estructuras de respuesta.
export const resolveEmployeeRoleId = (currentUser) => (
  currentUser?.roleId || currentUser?.role?.roleId || currentUser?.role?.id || null
);

// Obtiene el id de la sede del empleado en diferentes formatos posibles.
export const resolveEmployeeHeadquartersId = (currentUser) => (
  currentUser?.headquartersId || currentUser?.headquarters?.id || null
);

// Obtiene el nombre del rol y filtra el rol genérico de "empleado".
export const resolveEmployeeRoleName = (currentUser) => {
  if (!currentUser) return null;

  const candidate = (
    currentUser?.employeeRoleName ||
    currentUser?.positionName ||
    currentUser?.position ||
    currentUser?.jobTitle ||
    currentUser?.role?.roleName ||
    currentUser?.role?.name ||
    currentUser?.roleName ||
    null
  );

  if (typeof candidate === 'string' && candidate.toLowerCase() === USER_ROLES.EMPLOYEE) {
    return null;
  }

  return candidate;
};

// Obtiene el nombre de la sede del empleado si existe.
export const resolveEmployeeHeadquartersName = (currentUser) => (
  currentUser?.headquarters?.name || null
);
