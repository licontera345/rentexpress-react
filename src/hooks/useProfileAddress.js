import { useCallback, useEffect, useMemo } from 'react';
import AddressService from '../api/services/AddressService';
import { resolveAddress } from '../config/profileUtils';

/**
 * Hook para resolver la dirección del perfil de usuario.
 * Prioriza dirección embebida y, si no existe, consulta el backend con token.
 */
// Hook que resuelve y sincroniza la dirección del perfil del usuario.
const useProfileAddress = ({
  user,
  token,
  onAddressResolved
}) => {
  const directAddress = useMemo(() => resolveAddress(user), [user]);
  const addressId = useMemo(() => (
    directAddress?.id
      || directAddress?.addressId
      || user?.addressId
      || null
  ), [directAddress, user?.addressId]);

  const syncAddress = useCallback((address) => {
    // Notifica al consumidor cuando se resuelve la dirección.
    if (!address) return;
    onAddressResolved?.(address);
  }, [onAddressResolved]);


  useEffect(() => {
    // Primero intenta resolver la dirección embebida en el usuario.
    if (directAddress) {
      syncAddress(directAddress);
      return;
    }

    // Si no hay dirección embebida, consulta la API con token válido.
    if (!token || !user?.addressId) return;

    let isMounted = true;
    const fetchAddress = async () => {
      try {
        const data = await AddressService.findById(user.addressId);
        if (!isMounted || !data) return;
        syncAddress(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAddress();
    return () => {
      isMounted = false;
    };
  }, [directAddress, syncAddress, token, user]);

  return {
    addressId
  };
};

export default useProfileAddress;
