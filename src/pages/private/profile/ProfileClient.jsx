import { useCallback, useEffect, useState } from 'react';
import Card from '../../../components/common/layout/Card';
import FormField from '../../../components/common/forms/FormField';
import { useAuth } from '../../../hooks/useAuth';
import { DEFAULT_ACTIVE_STATUS, MESSAGES } from '../../../constants';
import useProvinces from '../../../hooks/useProvinces';
import useCities from '../../../hooks/useCities';
import AddressService from '../../../api/services/AddressService';
import UserService from '../../../api/services/UserService';
import ProfileFormActions from '../../../components/profile/ProfileFormActions';
import ProfilePasswordFields from '../../../components/profile/ProfilePasswordFields';
import { resolveAddress, resolveUserId } from './profileUtils';

function ProfileClient() {
  const { user, token, updateUser } = useAuth();
  const { provinces, loading: loadingProvinces, error: provincesError } = useProvinces();
  const [addressId, setAddressId] = useState(user?.addressId || null);

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

  useEffect(() => {
    const directAddress = resolveAddress(user);
    if (directAddress) {
      setAddressId(directAddress.id || directAddress.addressId || user?.addressId || null);
      syncAddressToForm(directAddress);
      return;
    }

    if (!token || !user?.addressId) return;

    const fetchAddress = async () => {
      try {
        const data = await AddressService.findById(user.addressId, token);
        if (data) {
          setAddressId(data.id || data.addressId || user.addressId);
          syncAddressToForm(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchAddress();
  }, [syncAddressToForm, token, user]);

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

    const trimmedData = {
      firstName: formData.firstName.trim(),
      lastName1: formData.lastName1.trim(),
      lastName2: formData.lastName2.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      street: formData.street.trim(),
      number: formData.number.trim()
    };
    const passwordValue = formData.password;
    const confirmPasswordValue = formData.confirmPassword;

    const nextErrors = {};
    if (!trimmedData.firstName) nextErrors.firstName = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.lastName1) nextErrors.lastName1 = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.email) nextErrors.email = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.phone) nextErrors.phone = MESSAGES.FIELD_REQUIRED;
    if (!formData.birthDate) nextErrors.birthDate = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.username) nextErrors.username = MESSAGES.FIELD_REQUIRED;

    if (!trimmedData.street) nextErrors.street = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.number) nextErrors.number = MESSAGES.FIELD_REQUIRED;
    if (!formData.provinceId) nextErrors.provinceId = MESSAGES.FIELD_REQUIRED;
    if (!formData.cityId) nextErrors.cityId = MESSAGES.FIELD_REQUIRED;

    if (trimmedData.email && !/\S+@\S+\.\S+/.test(trimmedData.email)) {
      nextErrors.email = MESSAGES.INVALID_EMAIL;
    }

    if (trimmedData.phone && !/^[\d\s()+-]{7,}$/.test(trimmedData.phone)) {
      nextErrors.phone = MESSAGES.INVALID_PHONE;
    }

    if (passwordValue || confirmPasswordValue) {
      if (!passwordValue) nextErrors.password = MESSAGES.FIELD_REQUIRED;
      if (!confirmPasswordValue) nextErrors.confirmPassword = MESSAGES.FIELD_REQUIRED;
      if (passwordValue && passwordValue.length < 6) {
        nextErrors.password = MESSAGES.PASSWORD_MIN_LENGTH;
      }
      if (passwordValue && confirmPasswordValue && passwordValue !== confirmPasswordValue) {
        nextErrors.confirmPassword = MESSAGES.PASSWORDS_DONT_MATCH;
      }
    }

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
          latestAddress = await AddressService.update(nextAddressId, addressPayload, token);
        } catch (error) {
          if (error?.status !== 404) {
            throw error;
          }
          latestAddress = await AddressService.create(addressPayload, token);
        }
      } else {
        latestAddress = await AddressService.create(addressPayload, token);
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

      const updated = await UserService.update(userId, payload, token);

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

        <FormField
          label={MESSAGES.FIRST_NAME}
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          disabled={isSaving}
          error={fieldErrors.firstName}
        />

        <FormField
          label={MESSAGES.LAST_NAME_1}
          type="text"
          name="lastName1"
          value={formData.lastName1}
          onChange={handleChange}
          required
          disabled={isSaving}
          error={fieldErrors.lastName1}
        />

        <FormField
          label={MESSAGES.LAST_NAME_2}
          type="text"
          name="lastName2"
          value={formData.lastName2}
          onChange={handleChange}
          disabled={isSaving}
          error={fieldErrors.lastName2}
        />

        <FormField
          label={MESSAGES.BIRTH_DATE}
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          required
          disabled={isSaving}
          error={fieldErrors.birthDate}
        />

        <FormField
          label={MESSAGES.EMAIL}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isSaving}
          error={fieldErrors.email}
        />

        <FormField
          label={MESSAGES.PHONE}
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          disabled={isSaving}
          error={fieldErrors.phone}
        />

        <ProfilePasswordFields
          formData={formData}
          fieldErrors={fieldErrors}
          isSaving={isSaving}
          onChange={handleChange}
        />

        <div className="profile-form-section">
          <h4>{MESSAGES.ADDRESS_SECTION_TITLE}</h4>
          <p>{MESSAGES.ADDRESS_SECTION_DESC}</p>
        </div>

        <FormField
          label={MESSAGES.STREET}
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
          disabled={isSaving}
          error={fieldErrors.street}
        />

        <FormField
          label={MESSAGES.NUMBER}
          type="text"
          name="number"
          value={formData.number}
          onChange={handleChange}
          required
          disabled={isSaving}
          error={fieldErrors.number}
        />

        <FormField
          label={MESSAGES.PROVINCE}
          name="provinceId"
          value={formData.provinceId}
          onChange={handleChange}
          required
          disabled={isSaving || loadingProvinces}
          error={fieldErrors.provinceId}
          as="select"
          helper={provincesError || null}
        >
          <option value="">{MESSAGES.SELECT_PROVINCE}</option>
          {provinces.map((province) => (
            <option key={province.provinceId || province.id} value={province.provinceId || province.id}>
              {province.provinceName || province.name}
            </option>
          ))}
        </FormField>

        <FormField
          label={MESSAGES.CITY}
          name="cityId"
          value={formData.cityId}
          onChange={handleChange}
          required
          disabled={isSaving || loadingCities || !formData.provinceId}
          error={fieldErrors.cityId}
          as="select"
          helper={citiesError || null}
        >
          <option value="">{MESSAGES.SELECT_CITY}</option>
          {cities.map((city) => (
            <option key={city.cityId || city.id} value={city.cityId || city.id}>
              {city.cityName || city.name}
            </option>
          ))}
        </FormField>

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
