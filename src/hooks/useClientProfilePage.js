import { useCallback, useEffect, useMemo, useState } from 'react';
import AddressService from '../api/services/AddressService';
import UserService from '../api/services/UserService';
import { useAuth } from './useAuth';
import useCities from './useCities';
import useProvinces from './useProvinces';
import { DEFAULT_ACTIVE_STATUS, MESSAGES } from '../constants';
import { resolveAddress, resolveUserId } from '../utils/profileUtils';
import {
  trimValues,
  validateEmail,
  validatePasswordPair,
  validatePhone,
  validateRequired
} from '../forms/profileFormUtils';

const useClientProfilePage = () => {
  const { user, token, updateUser } = useAuth();
  const { provinces, loading: loadingProvinces, error: provincesError } = useProvinces();
  const [formData, setFormData] = useState(() => ({
    firstName: user?.firstName || '',
    lastName1: user?.lastName1 || '',
    lastName2: user?.lastName2 || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
    password: '',
    confirmPassword: '',
    street: '',
    number: '',
    provinceId: '',
    cityId: ''
  }));
  const { cities, loading: loadingCities, error: citiesError } = useCities(formData.provinceId);
  const [fieldErrors, setFieldErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resolvedAddress = useMemo(() => resolveAddress(user), [user]);
  const [addressId, setAddressId] = useState(() => (
    resolvedAddress?.id || resolvedAddress?.addressId || user?.addressId || null
  ));

  const syncAddressToForm = useCallback((address) => {
    if (!address) return;

    setFormData((prev) => Object.assign({}, prev, {
      street: address.street || prev.street,
      number: address.number || prev.number,
      provinceId: address.provinceId ? String(address.provinceId) : prev.provinceId,
      cityId: address.cityId ? String(address.cityId) : prev.cityId
    }));
  }, []);

  useEffect(() => {
    const nextAddressId = resolvedAddress?.id || resolvedAddress?.addressId || user?.addressId || null;
    setAddressId(nextAddressId);

    if (resolvedAddress) {
      syncAddressToForm(resolvedAddress);
      return;
    }

    if (!token || !user?.addressId) {
      return;
    }

    let isMounted = true;

    const fetchAddress = async () => {
      try {
        const data = await AddressService.findById(user.addressId);
        if (!isMounted || !data) return;
        syncAddressToForm(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAddress();

    return () => {
      isMounted = false;
    };
  }, [resolvedAddress, syncAddressToForm, token, user]);

  useEffect(() => {
    setFormData((prev) => Object.assign({}, prev, {
      firstName: user?.firstName || '',
      lastName1: user?.lastName1 || '',
      lastName2: user?.lastName2 || '',
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate || '',
      password: '',
      confirmPassword: ''
    }));
  }, [user]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => Object.assign({}, prev, {
      [name]: value
    }, name === 'provinceId' ? { cityId: '' } : {}));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => Object.assign({}, prev, {
        [name]: null
      }));
    }
    if (statusMessage) setStatusMessage('');
    if (errorMessage) setErrorMessage('');
  }, [errorMessage, fieldErrors, statusMessage]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    const trimmedData = trimValues(formData, [
      'firstName',
      'lastName1',
      'lastName2',
      'username',
      'email',
      'phone',
      'street',
      'number'
    ]);
    const passwordValue = formData.password;
    const confirmPasswordValue = formData.confirmPassword;

    const nextErrors = {};
    validateRequired(trimmedData.firstName, 'firstName', nextErrors);
    validateRequired(trimmedData.lastName1, 'lastName1', nextErrors);
    validateRequired(trimmedData.email, 'email', nextErrors);
    validateRequired(trimmedData.phone, 'phone', nextErrors);
    validateRequired(formData.birthDate, 'birthDate', nextErrors);
    validateRequired(trimmedData.username, 'username', nextErrors);
    validateRequired(trimmedData.street, 'street', nextErrors);
    validateRequired(trimmedData.number, 'number', nextErrors);
    validateRequired(formData.provinceId, 'provinceId', nextErrors);
    validateRequired(formData.cityId, 'cityId', nextErrors);

    validateEmail(trimmedData.email, nextErrors);
    validatePhone(trimmedData.phone, nextErrors);
    validatePasswordPair(passwordValue, confirmPasswordValue, nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setErrorMessage(MESSAGES.REQUIRED_FIELDS);
      return;
    }

    setIsSaving(true);
    try {
      let nextAddressId = addressId;
      let latestAddress = null;

      const addressPayload = {
        street: trimmedData.street,
        number: trimmedData.number,
        provinceId: Number(formData.provinceId),
        cityId: Number(formData.cityId)
      };

      if (nextAddressId) {
        try {
          latestAddress = await AddressService.update(nextAddressId, addressPayload);
        } catch (error) {
          if (error?.status !== 404) {
            throw error;
          }
          latestAddress = await AddressService.create(addressPayload);
        }
      } else {
        latestAddress = await AddressService.create(addressPayload);
      }

      nextAddressId = latestAddress?.id || latestAddress?.addressId || nextAddressId;
      setAddressId(nextAddressId);

      const userId = resolveUserId(user);
      if (!userId) {
        throw new Error(MESSAGES.ERROR_UPDATING);
      }

      const payload = Object.assign({}, {
        username: trimmedData.username,
        firstName: trimmedData.firstName,
        lastName1: trimmedData.lastName1,
        lastName2: trimmedData.lastName2,
        email: trimmedData.email,
        phone: trimmedData.phone,
        birthDate: formData.birthDate,
        addressId: nextAddressId || undefined
      }, passwordValue ? { password: passwordValue } : {}, {
        activeStatus: user?.activeStatus ?? DEFAULT_ACTIVE_STATUS
      });

      const updated = await UserService.update(userId, payload);
      const mergedUser = Object.assign({}, user || {}, updated || payload, latestAddress
        ? { address: latestAddress, addressId: nextAddressId }
        : {});

      updateUser(mergedUser);
      setFormData((prev) => Object.assign({}, prev, {
        password: '',
        confirmPassword: ''
      }));
      setStatusMessage(MESSAGES.PROFILE_UPDATED);
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.message || MESSAGES.ERROR_UPDATING);
    } finally {
      setIsSaving(false);
    }
  }, [addressId, formData, updateUser, user]);

  return {
    state: {
      formData,
      fieldErrors,
      provinces,
      cities
    },
    ui: {
      statusMessage,
      errorMessage,
      isSaving,
      loadingProvinces,
      loadingCities,
      provincesError,
      citiesError
    },
    actions: {
      handleChange,
      handleSubmit
    },
    meta: {}
  };
};

export default useClientProfilePage;
