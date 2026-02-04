import { useCallback, useEffect, useState } from 'react';
import Card from '../../../components/common/layout/Card';
import FormField from '../../../components/common/forms/FormField';
import { useAuth } from '../../../hooks/useAuth';
import { DEFAULT_ACTIVE_STATUS, MESSAGES } from '../../../constants';
import useProvinces from '../../../hooks/useProvinces';
import useCities from '../../../hooks/useCities';
import AddressService from '../../../api/services/AddressService';
import UserService from '../../../api/services/UserService';
import ProfileAddressFields from '../../../components/profile/fields/ProfileAddressFields';
import ProfileContactFields from '../../../components/profile/fields/ProfileContactFields';
import ProfileFormActions from '../../../components/profile/actions/ProfileFormActions';
import ProfilePasswordFields from '../../../components/profile/fields/ProfilePasswordFields';
import useProfileAddress from '../../../hooks/useProfileAddress';
import { resolveUserId } from '../../../config/profileUtils';
import {
  trimValues,
  validateEmail,
  validatePasswordPair,
  validatePhone,
  validateRequired
} from '../../../config/profileFormUtils';

// Componente ProfileClient que define la interfaz y organiza la lógica de esta vista.

function ProfileClient() {
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

  const syncAddressToForm = useCallback((address) => {
    if (!address) return;
    setFormData(prev => Object.assign({}, prev, {
      street: address.street || prev.street,
      number: address.number || prev.number,
      provinceId: address.provinceId ? String(address.provinceId) : prev.provinceId,
      cityId: address.cityId ? String(address.cityId) : prev.cityId
    }));
  }, []);
  const { addressId, setAddressId } = useProfileAddress({
    user,
    token,
    onAddressResolved: syncAddressToForm
  });

  useEffect(() => {
    setFormData(prev => Object.assign({}, prev, {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => Object.assign({}, prev, {
      [name]: value
    }, name === 'provinceId' ? { cityId: '' } : {}));

    if (fieldErrors[name]) {
      setFieldErrors(prev => Object.assign({}, prev, {
        [name]: null
      }));
    }
    if (statusMessage) setStatusMessage('');
    if (errorMessage) setErrorMessage('');
  };

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
      setAddressId(nextAddressId || null);

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
      setFormData(prev => Object.assign({}, prev, {
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
  }, [addressId, formData, token, updateUser, user]);

  return (
    <Card className="personal-space-card personal-space-card--profile">
      <h3>{MESSAGES.PROFILE_EDIT_TITLE}</h3>
      <p>{MESSAGES.PROFILE_EDIT_DESC}</p>

      <form className="profile-form" onSubmit={handleSubmit}>
        <FormField
          label={MESSAGES.USERNAME}
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={isSaving}
          error={fieldErrors.username}
        />

        <ProfileContactFields
          formData={formData}
          fieldErrors={fieldErrors}
          isSaving={isSaving}
          onChange={handleChange}
          showBirthDate
        />

        <ProfilePasswordFields
          formData={formData}
          fieldErrors={fieldErrors}
          isSaving={isSaving}
          onChange={handleChange}
        />

        <ProfileAddressFields
          formData={formData}
          fieldErrors={fieldErrors}
          isSaving={isSaving}
          onChange={handleChange}
          provinces={provinces}
          cities={cities}
          loadingProvinces={loadingProvinces}
          loadingCities={loadingCities}
          provincesError={provincesError}
          citiesError={citiesError}
        />

        <ProfileFormActions
          errorMessage={errorMessage}
          statusMessage={statusMessage}
          isSaving={isSaving}
        />
      </form>
    </Card>
  );
}

export default ProfileClient;
