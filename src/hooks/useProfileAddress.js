import { useCallback, useEffect, useState } from 'react';
import AddressService from '../api/services/AddressService';
import { resolveAddress } from '../config/profileUtils';

const useProfileAddress = ({
  user,
  token,
  onAddressResolved
}) => {
  const [addressId, setAddressId] = useState(user?.addressId || null);

  const syncAddress = useCallback((address) => {
    if (!address) return;
    onAddressResolved?.(address);
  }, [onAddressResolved]);

  useEffect(() => {
    setAddressId(user?.addressId || null);
  }, [user]);

  useEffect(() => {
    const directAddress = resolveAddress(user);
    if (directAddress) {
      const nextId = directAddress.id || directAddress.addressId || user?.addressId || null;
      setAddressId(nextId);
      syncAddress(directAddress);
      return;
    }

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
