import { useCallback, useEffect, useMemo, useState } from 'react';
import EmployeeService from '../../api/services/EmployeeService';
import { useAuth } from '../core/useAuth';
import { DEFAULT_ACTIVE_STATUS, MESSAGES } from '../../constants';
import {
  trimValues,
  validatePasswordPair,
  validatePhone,
  validateRequired
} from '../../forms/profileFormUtils';
import {
  resolveEmployeeHeadquartersId,
  resolveEmployeeRoleId,
  resolveUserId
} from '../../utils/profileUtils';

const useEmployeeProfilePage = () => {
  const { user, updateUser } = useAuth();
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
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    setFormData((prev) => Object.assign({}, prev, {
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
    setIsEditing(false);
    setShowPasswordFields(false);
  }, [user]);

  const baselineData = useMemo(() => ({
    employeeName: (user?.employeeName || user?.username || '').trim(),
    firstName: (user?.firstName || '').trim(),
    lastName1: (user?.lastName1 || '').trim(),
    lastName2: (user?.lastName2 || '').trim(),
    phone: (user?.phone || '').trim()
  }), [user]);

  const hasPasswordInput = Boolean(formData.password || formData.confirmPassword);

  const isDirty = useMemo(() => {
    const trimmedData = trimValues(formData, [
      'employeeName',
      'firstName',
      'lastName1',
      'lastName2',
      'phone'
    ]);

    return (
      trimmedData.employeeName !== baselineData.employeeName
      || trimmedData.firstName !== baselineData.firstName
      || trimmedData.lastName1 !== baselineData.lastName1
      || trimmedData.lastName2 !== baselineData.lastName2
      || trimmedData.phone !== baselineData.phone
      || hasPasswordInput
    );
  }, [baselineData, formData, hasPasswordInput]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => Object.assign({}, prev, {
      [name]: value
    }));

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
      employeeName: user?.employeeName || user?.username || '',
      firstName: user?.firstName || '',
      lastName1: user?.lastName1 || '',
      lastName2: user?.lastName2 || '',
      email: user?.email || '',
      phone: user?.phone || '',
      password: '',
      confirmPassword: ''
    });
    setFieldErrors({});
    setStatusMessage('');
    setErrorMessage('');
    setShowPasswordFields(false);
  }, [user]);

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
      'employeeName',
      'firstName',
      'lastName1',
      'lastName2',
      'email',
      'phone'
    ]);
    const passwordValue = showPasswordFields ? formData.password : '';
    const confirmPasswordValue = showPasswordFields ? formData.confirmPassword : '';

    const nextErrors = {};
    validateRequired(trimmedData.employeeName, 'employeeName', nextErrors);
    validateRequired(trimmedData.firstName, 'firstName', nextErrors);
    validateRequired(trimmedData.lastName1, 'lastName1', nextErrors);
    validateRequired(trimmedData.email, 'email', nextErrors);
    validateRequired(trimmedData.phone, 'phone', nextErrors);

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
  }, [employeeMeta, formData, isDirty, isEditing, resetPasswordFields, showPasswordFields, updateUser, user]);

  return {
    state: {
      formData,
      fieldErrors
    },
    ui: {
      statusMessage,
      errorMessage,
      isSaving,
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

export default useEmployeeProfilePage;
