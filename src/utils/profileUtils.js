// Resuelve la dirección principal del usuario.
export const resolveAddress = (currentUser) => {
  if (!currentUser) return null;
  // Contrato OpenAPI: `address` es un array de AddressDTO (UserDTO).
  return Array.isArray(currentUser.address) ? (currentUser.address[0] ?? null) : null;
};

// Obtiene el identificador de entidad autenticada (userId o employeeId).
export const resolveUserId = (currentUser) => (
  // En sesión: `userId` (cliente) o `employeeId` (empleado).
  currentUser?.userId ?? currentUser?.employeeId ?? null
);
