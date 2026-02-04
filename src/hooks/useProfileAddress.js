import { useCallback, useEffect, useState } from 'react';
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
  const [addressId, setAddressId] = useState(user?.addressId || null);

  const syncAddress = useCallback((address) => {
    // Notifica al consumidor cuando se resuelve la dirección.
    if (!address) return;
    onAddressResolved?.(address);
  }, [onAddressResolved]);

  useEffect(() => {
    // Actualiza el ID de dirección si cambia el usuario.
    setAddressId(user?.addressId || null);
  }, [user]);

  useEffect(() => {
    // Primero intenta resolver la dirección embebida en el usuario.
    const directAddress = resolveAddress(user);
    if (directAddress) {
      const nextId = directAddress.id || directAddress.addressId || user?.addressId || null;
      setAddressId(nextId);
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
        const nextId = data.id || data.addressId || user.addressId;
        setAddressId(nextId);
        syncAddress(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAddress();
    return () => {
      isMounted = false;
    };
  }, [syncAddress, token, user]);

  return {
    addressId,
    setAddressId
  };
};

export default useProfileAddress;
