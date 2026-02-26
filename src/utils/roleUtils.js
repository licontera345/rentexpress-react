/**
 * Nombres de rol que se consideran "cliente" (no personal).
 * En el área de empleados solo se muestran EMPLOYEE y ADMIN.
 */
const CLIENT_ROLE_NAMES = ['client', 'cliente', 'user', 'usuario'];

/**
 * Indica si un rol del API es de tipo cliente (no staff).
 * @param {{ roleName?: string }} role - Objeto rol con roleName
 * @returns {boolean}
 */
export const isClientRole = (role) => {
  if (!role) return false;
  const name = (role.roleName || '').toString().toLowerCase().trim();
  return CLIENT_ROLE_NAMES.includes(name);
};

/**
 * Filtra la lista de roles para dejar solo los de personal (EMPLOYEE, ADMIN).
 * Excluye CLIENT y equivalentes.
 * @param {Array<{ roleId?: number, roleName?: string }>} roles
 * @returns {Array}
 */
export const getStaffRoles = (roles = []) => {
  return Array.isArray(roles) ? roles.filter((r) => !isClientRole(r)) : [];
};
