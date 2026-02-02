import { useCallback, useEffect, useState } from 'react';
import Card from '../../../components/common/layout/Card';
import FormField from '../../../components/common/forms/FormField';
import { useAuth } from '../../../hooks/useAuth';
import { DEFAULT_ACTIVE_STATUS, MESSAGES } from '../../../constants';
import EmployeeService from '../../../api/services/EmployeeService';
import ProfileContactFields from '../../../components/profile/ProfileContactFields';
import ProfileFormActions from '../../../components/profile/ProfileFormActions';
import ProfilePasswordFields from '../../../components/profile/ProfilePasswordFields';
import { resolveEmployeeHeadquartersId, resolveEmployeeRoleId, resolveUserId } from '../../../config/profileUtils';
import {
  trimValues,
  validateEmail,
  validatePasswordPair,
  validatePhone,
  validateRequired
} from '../../../config/profileFormUtils';

function ProfileEmployee() {
  const { user, token, updateUser } = useAuth();
  const [employeeMeta, setEmployeeMeta] = useState(() => ({
    id: resolveUserId(user),
    roleId: resolveEmployeeRoleId(user),
    headquartersId: resolveEmployeeHeadquartersId(user)
  }));

  const [formData, setFormData] = useState(() => ({
    employeeName: user?.employeeName || user?.username || '',
    firstName: user?.firstName || '',
    lastName1: user?.lastName1 || '',
    lastName2: user?.lastName2 || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: ''
  }));
  const [fieldErrors, setFieldErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(prev => Object.assign({}, prev, {
      employeeName: user?.employeeName || user?.username || '',
      firstName: user?.firstName || '',
      lastName1: user?.lastName1 || '',
      lastName2: user?.lastName2 || '',
      email: user?.email || '',
      phone: user?.phone || '',
      password: '',
      confirmPassword: ''
    }));
    setEmployeeMeta({
      id: resolveUserId(user),
      roleId: resolveEmployeeRoleId(user),
      headquartersId: resolveEmployeeHeadquartersId(user)
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => Object.assign({}, prev, {
      [name]: value
    }));

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
      'employeeName',
      'firstName',
      'lastName1',
      'lastName2',
      'email',
      'phone'
    ]);
    const passwordValue = formData.password;
    const confirmPasswordValue = formData.confirmPassword;

    const nextErrors = {};
    validateRequired(trimmedData.employeeName, 'employeeName', nextErrors);
    validateRequired(trimmedData.firstName, 'firstName', nextErrors);
    validateRequired(trimmedData.lastName1, 'lastName1', nextErrors);
    validateRequired(trimmedData.email, 'email', nextErrors);
    validateRequired(trimmedData.phone, 'phone', nextErrors);

    validateEmail(trimmedData.email, nextErrors);
    validatePhone(trimmedData.phone, nextErrors);
    validatePasswordPair(passwordValue, confirmPasswordValue, nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setErrorMessage(MESSAGES.REQUIRED_FIELDS);
      return;
    }

    if (employeeMeta.roleId == null || employeeMeta.headquartersId == null) {
      setErrorMessage(MESSAGES.ERROR_UPDATING);
      return;
    }

    setIsSaving(true);
    try {
      const userId = employeeMeta.id || resolveUserId(user);
      if (!userId) {
        throw new Error(MESSAGES.ERROR_UPDATING);
      }

      const payload = Object.assign({}, {
        employeeName: trimmedData.employeeName,
        roleId: employeeMeta.roleId,
        headquartersId: employeeMeta.headquartersId,
        firstName: trimmedData.firstName,
        lastName1: trimmedData.lastName1,
        lastName2: trimmedData.lastName2,
        email: trimmedData.email,
        phone: trimmedData.phone
      }, passwordValue ? { password: passwordValue } : {}, {
        activeStatus: user?.activeStatus ?? DEFAULT_ACTIVE_STATUS
      });

      const updated = await EmployeeService.update(userId, payload);

      updateUser(Object.assign({}, user || {}, updated || payload));
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
  }, [employeeMeta, formData, token, updateUser, user]);

  return (
    <Card className="personal-space-card personal-space-card--profile">
      <h3>{MESSAGES.PROFILE_EDIT_TITLE}</h3>
      <p>{MESSAGES.PROFILE_EDIT_DESC}</p>

      <form className="profile-form" onSubmit={handleSubmit}>
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

        <ProfileContactFields
          formData={formData}
          fieldErrors={fieldErrors}
          isSaving={isSaving}
          onChange={handleChange}
        />

        <ProfilePasswordFields
          formData={formData}
          fieldErrors={fieldErrors}
          isSaving={isSaving}
          onChange={handleChange}
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

export default ProfileEmployee;
