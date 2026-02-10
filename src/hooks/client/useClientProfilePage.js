import { useCallback, useEffect, useMemo, useState } from 'react';
import AddressService from '../../api/services/AddressService';
import UserService from '../../api/services/UserService';
import { useAuth } from '../core/useAuth';
import useCities from '../location/useCities';
import useProvinces from '../location/useProvinces';
import { DEFAULT_ACTIVE_STATUS, MESSAGES } from '../../constants';
import { resolveAddress, resolveUserId } from '../../utils/profileUtils';
import {
  trimValues,
  validateEmail,
  validatePasswordPair,
  validatePhone,
  validateRequired
} from '../../forms/profileFormUtils';

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
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const resolvedAddress = useMemo(() => resolveAddress(user), [user]);
  const [addressId, setAddressId] = useState(() => (
    resolvedAddress?.id || resolvedAddress?.addressId || user?.addressId || null
  ));

  const baselineData = useMemo(() => ({
    firstName: (user?.firstName || '').trim(),
    lastName1: (user?.lastName1 || '').trim(),
    lastName2: (user?.lastName2 || '').trim(),
    username: (user?.username || '').trim(),
    email: (user?.email || '').trim(),
    phone: (user?.phone || '').trim(),
    birthDate: user?.birthDate || '',
    street: (resolvedAddress?.street || '').trim(),
    number: (resolvedAddress?.number || '').trim(),
    provinceId: resolvedAddress?.provinceId ? String(resolvedAddress.provinceId) : '',
    cityId: resolvedAddress?.cityId ? String(resolvedAddress.cityId) : ''
  }), [resolvedAddress, user]);

  const hasPasswordInput = Boolean(formData.password || formData.confirmPassword);

  const isDirty = useMemo(() => {
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

    return (
      trimmedData.firstName !== baselineData.firstName
      || trimmedData.lastName1 !== baselineData.lastName1
      || trimmedData.lastName2 !== baselineData.lastName2
      || trimmedData.username !== baselineData.username
      || trimmedData.email !== baselineData.email
      || trimmedData.phone !== baselineData.phone
      || formData.birthDate !== baselineData.birthDate
      || trimmedData.street !== baselineData.street
      || trimmedData.number !== baselineData.number
      || formData.provinceId !== baselineData.provinceId
      || formData.cityId !== baselineData.cityId
      || hasPasswordInput
    );
  }, [baselineData, formData, hasPasswordInput]);

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
    setIsEditing(false);
    setShowPasswordFields(false);
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

  const resetPasswordFields = useCallback(() => {
    setFormData((prev) => Object.assign({}, prev, {
      password: '',
      confirmPassword: ''
    }));
    setFieldErrors((prev) => Object.assign({}, prev, {
      password: null,
      confirmPassword: null
    }));
  }, []);

  const handleReset = useCallback(() => {
    setFormData({
      firstName: user?.firstName || '',
      lastName1: user?.lastName1 || '',
      lastName2: user?.lastName2 || '',
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate || '',
      password: '',
      confirmPassword: '',
      street: resolvedAddress?.street || '',
      number: resolvedAddress?.number || '',
      provinceId: resolvedAddress?.provinceId ? String(resolvedAddress.provinceId) : '',
      cityId: resolvedAddress?.cityId ? String(resolvedAddress.cityId) : ''
    });
    setFieldErrors({});
    setStatusMessage('');
    setErrorMessage('');
    setShowPasswordFields(false);
  }, [resolvedAddress, user]);

  const toggleEditMode = useCallback(() => {
    setStatusMessage('');
    setErrorMessage('');
    setFieldErrors({});

    if (isEditing) {
      handleReset();
      setIsEditing(false);
      return;
    }

    setIsEditing(true);
  }, [handleReset, isEditing]);

  const togglePasswordFields = useCallback(() => {
    if (!isEditing || isSaving) {
      return;
    }

    setShowPasswordFields((prev) => {
      const next = !prev;
      if (!next) {
        resetPasswordFields();
      }
      return next;
    });
  }, [isEditing, isSaving, resetPasswordFields]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    if (!isEditing || !isDirty) {
      return;
    }

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
    const passwordValue = showPasswordFields ? formData.password : '';
    const confirmPasswordValue = showPasswordFields ? formData.confirmPassword : '';

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
      resetPasswordFields();
      setShowPasswordFields(false);
      setIsEditing(false);
      setStatusMessage(MESSAGES.PROFILE_UPDATED);
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.message || MESSAGES.ERROR_UPDATING);
    } finally {
      setIsSaving(false);
    }
  }, [addressId, formData, isDirty, isEditing, resetPasswordFields, showPasswordFields, updateUser, user]);

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
      citiesError,
      isDirty,
      isEditing,
      showPasswordFields
    },
    actions: {
      handleChange,
      handleSubmit,
      handleReset,
      toggleEditMode,
      togglePasswordFields
    },
    meta: {}
  };
};

export default useClientProfilePage;
