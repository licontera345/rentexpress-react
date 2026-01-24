import { useCallback, useEffect, useState } from 'react';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import Card from '../../components/common/layout/Card';
import FormField from '../../components/common/forms/FormField';
import Button from '../../components/common/actions/Button';
import { useAuth } from '../../context/useAuth';
import { MESSAGES, BUTTON_VARIANTS } from '../../constants';
import useProvinces from '../../hooks/useProvinces';
import useCities from '../../hooks/useCities';
import useHeadquarters from '../../hooks/useHeadquarters';
import AddressService from '../../api/services/AddressService';
import UserService from '../../api/services/UserService';
import EmployeeService from '../../api/services/EmployeeService';

const resolveAddress = (currentUser) => {
  if (!currentUser) return null;
  if (Array.isArray(currentUser.address) && currentUser.address.length > 0) {
    return currentUser.address[0];
  }
  if (currentUser.address && typeof currentUser.address === 'object') {
    return currentUser.address;
  }
  return null;
};

const resolveUserId = (currentUser) => (
  currentUser?.userId || currentUser?.id || currentUser?.employeeId || null
);

const resolveEmployeeRoleId = (currentUser) => (
  currentUser?.roleId || currentUser?.role?.roleId || currentUser?.role?.id || null
);

const resolveEmployeeHeadquartersId = (currentUser) => (
  currentUser?.headquartersId || currentUser?.headquarters?.headquartersId || currentUser?.headquarters?.id || null
);

const resolveEmployeeRoleName = (currentUser) => {
  if (!currentUser) return null;
  const candidate = (
    currentUser?.role?.roleName ||
    currentUser?.role?.name ||
    currentUser?.employeeRole ||
    currentUser?.position ||
    currentUser?.roleName ||
    null
  );
  if (typeof candidate === 'string' && candidate.toLowerCase() === 'employee') {
    return null;
  }
  return candidate;
};

const resolveEmployeeHeadquartersName = (currentUser) => (
  currentUser?.headquarters?.headquartersName ||
  currentUser?.headquarters?.name ||
  currentUser?.headquartersName ||
  null
);

function Profile() {
  const { user, role, token, updateUser } = useAuth();
  const isEmployee = role === 'employee';
  const displayName = user?.firstName || user?.username || MESSAGES.USERNAME;
  const roleLabel = role
    ? (isEmployee ? MESSAGES.EMPLOYEE_ROLE : MESSAGES.CUSTOMER_ROLE)
    : MESSAGES.NOT_AVAILABLE;
  const { provinces, loading: loadingProvinces, error: provincesError } = useProvinces();
  const { headquarters } = useHeadquarters();
  const [addressId, setAddressId] = useState(user?.addressId || null);
  const [employeeMeta, setEmployeeMeta] = useState(() => ({
    id: resolveUserId(user),
    roleId: resolveEmployeeRoleId(user),
    headquartersId: resolveEmployeeHeadquartersId(user)
  }));

  const [formData, setFormData] = useState(() => ({
    firstName: user?.firstName || '',
    lastName1: user?.lastName1 || '',
    lastName2: user?.lastName2 || '',
    username: user?.username || '',
    employeeName: user?.employeeName || user?.username || '',
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
    setFormData(prev => ({
      ...prev,
      street: address.street || prev.street,
      number: address.number || prev.number,
      provinceId: address.provinceId ? String(address.provinceId) : prev.provinceId,
      cityId: address.cityId ? String(address.cityId) : prev.cityId
    }));
  }, []);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      firstName: user?.firstName || '',
      lastName1: user?.lastName1 || '',
      lastName2: user?.lastName2 || '',
      username: user?.username || '',
      employeeName: user?.employeeName || user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate || '',
      password: '',
      confirmPassword: ''
    }));
    setEmployeeMeta({
      id: resolveUserId(user),
      roleId: resolveEmployeeRoleId(user),
      headquartersId: resolveEmployeeHeadquartersId(user)
    });
  }, [user]);

  useEffect(() => {
    if (isEmployee) return;
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
  }, [isEmployee, syncAddressToForm, token, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'provinceId' ? { cityId: '' } : {})
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
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
      employeeName: formData.employeeName.trim(),
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
    if (!isEmployee && !formData.birthDate) nextErrors.birthDate = MESSAGES.FIELD_REQUIRED;

    if (isEmployee) {
      if (!trimmedData.employeeName) nextErrors.employeeName = MESSAGES.FIELD_REQUIRED;
    } else if (!trimmedData.username) {
      nextErrors.username = MESSAGES.FIELD_REQUIRED;
    }

    if (!isEmployee) {
      if (!trimmedData.street) nextErrors.street = MESSAGES.FIELD_REQUIRED;
      if (!trimmedData.number) nextErrors.number = MESSAGES.FIELD_REQUIRED;
      if (!formData.provinceId) nextErrors.provinceId = MESSAGES.FIELD_REQUIRED;
      if (!formData.cityId) nextErrors.cityId = MESSAGES.FIELD_REQUIRED;
    }

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

    if (isEmployee && (employeeMeta.roleId == null || employeeMeta.headquartersId == null)) {
      setErrorMessage(MESSAGES.ERROR_UPDATING);
      return;
    }

    setIsSaving(true);
    try {
      let nextAddressId = addressId;
      let latestAddress = null;

      if (!isEmployee) {
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
      }

      const userId = employeeMeta.id || resolveUserId(user);
      if (!userId) {
        throw new Error(MESSAGES.ERROR_UPDATING);
      }

      const payload = isEmployee
        ? {
          employeeName: trimmedData.employeeName,
          roleId: employeeMeta.roleId,
          headquartersId: employeeMeta.headquartersId,
          firstName: trimmedData.firstName,
          lastName1: trimmedData.lastName1,
          lastName2: trimmedData.lastName2,
          email: trimmedData.email,
          phone: trimmedData.phone,
          ...(passwordValue ? { password: passwordValue } : {}),
          activeStatus: user?.activeStatus ?? true
        }
        : {
          username: trimmedData.username,
          firstName: trimmedData.firstName,
          lastName1: trimmedData.lastName1,
          lastName2: trimmedData.lastName2,
          email: trimmedData.email,
          phone: trimmedData.phone,
          birthDate: formData.birthDate,
          addressId: nextAddressId || undefined,
          ...(passwordValue ? { password: passwordValue } : {}),
          activeStatus: user?.activeStatus ?? true
        };

      const updated = isEmployee
        ? await EmployeeService.update(userId, payload, token)
        : await UserService.update(userId, payload, token);

      const mergedUser = {
        ...(user || {}),
        ...(updated || payload),
        ...(latestAddress ? { address: latestAddress, addressId: nextAddressId } : {})
      };

      updateUser(mergedUser);
      setFormData(prev => ({
        ...prev,
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
  }, [addressId, employeeMeta, formData, isEmployee, token, updateUser, user]);

  const profileFormTitle = MESSAGES.PROFILE_EDIT_TITLE;
  const employeeRoleName = resolveEmployeeRoleName(user);
  const headquartersNameFromUser = resolveEmployeeHeadquartersName(user);
  const headquartersMatch = headquarters.find(
    (hq) => (hq.headquartersId || hq.id) === employeeMeta.headquartersId
  );
  const headquartersNameFromList = headquartersMatch?.headquartersName || headquartersMatch?.name;
  const employeeHeadquartersName = headquartersNameFromUser || headquartersNameFromList;

  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <p className="personal-space-greeting">{MESSAGES.WELCOME_BACK}, {displayName}</p>
            <h1>{MESSAGES.PROFILE_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.PROFILE_SUBTITLE}</p>
          </div>
        </header>

        <Card className="personal-space-card personal-space-card--profile">
          <h3>{MESSAGES.PROFILE_SUMMARY_TITLE}</h3>
          <p>{MESSAGES.PROFILE_SUMMARY_DESC}</p>
          <div className="personal-space-profile-info">
            <span>{MESSAGES.USERNAME}: <strong>{user?.username || user?.employeeName || MESSAGES.NOT_AVAILABLE}</strong></span>
            <span>{MESSAGES.ACCOUNT_TYPE}: <strong>{roleLabel}</strong></span>
            {isEmployee && (
              <>
                <span>{MESSAGES.EMPLOYEE_POSITION_LABEL}: <strong>{employeeRoleName || MESSAGES.NOT_AVAILABLE}</strong></span>
                <span>{MESSAGES.HEADQUARTERS_LABEL}: <strong>{employeeHeadquartersName || MESSAGES.NOT_AVAILABLE}</strong></span>
              </>
            )}
          </div>
        </Card>

        <Card className="personal-space-card personal-space-card--profile">
          <h3>{profileFormTitle}</h3>
          <p>{MESSAGES.PROFILE_EDIT_DESC}</p>

          <form className="profile-form" onSubmit={handleSubmit}>
            {isEmployee ? (
              <FormField
                label={MESSAGES.USERNAME}
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                required
                disabled={isSaving}
                error={fieldErrors.employeeName}
              />
            ) : (
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
            )}

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

            {!isEmployee && (
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
            )}

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

            <div className="profile-form-section">
              <h4>{MESSAGES.PASSWORD_CHANGE_TITLE}</h4>
              <p>{MESSAGES.PASSWORD_CHANGE_DESC}</p>
            </div>

            <FormField
              label={MESSAGES.NEW_PASSWORD}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSaving}
              error={fieldErrors.password}
              helper={MESSAGES.PASSWORD_HELPER}
            />

            <FormField
              label={MESSAGES.CONFIRM_PASSWORD}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSaving}
              error={fieldErrors.confirmPassword}
            />

            {!isEmployee && (
              <>
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
              </>
            )}

            {errorMessage && (
              <p className="profile-alert profile-alert--error" role="alert">
                {errorMessage}
              </p>
            )}

            {statusMessage && (
              <p className="profile-alert profile-alert--success" role="status">
                {statusMessage}
              </p>
            )}

            <div className="profile-form-actions">
              <Button
                type="submit"
                variant={BUTTON_VARIANTS.PRIMARY}
                size="large"
                disabled={isSaving}
              >
                {isSaving ? MESSAGES.STARTING : MESSAGES.SAVE_CHANGES}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </PrivateLayout>
  );
}

export default Profile;
