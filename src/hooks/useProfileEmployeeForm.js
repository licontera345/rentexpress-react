import { useCallback, useEffect, useMemo, useState } from 'react';
import EmployeeService from '../api/services/EmployeeService';
import { useAuth } from './useAuth';
import { DEFAULT_ACTIVE_STATUS, MESSAGES } from '../constants';
import {
  trimValues,
  validateEmail,
  validatePasswordPair,
  validatePhone,
  validateRequired
} from '../config/profileFormUtils';
import {
  resolveEmployeeHeadquartersId,
  resolveEmployeeRoleId,
  resolveUserId
} from '../config/profileUtils';

const EDITABLE_FIELDS = ['employeeName', 'firstName', 'lastName1', 'lastName2', 'phone'];
const COMPARABLE_FIELDS = ['employeeName', 'firstName', 'lastName1', 'lastName2', 'email', 'phone'];

// Hook que administra el formulario del perfil de empleado.
const useProfileEmployeeForm = () => {
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
  const [baselineData, setBaselineData] = useState(() => trimValues(formData, COMPARABLE_FIELDS));
  const [fieldErrors, setFieldErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sincroniza el formulario y metadatos al cambiar el usuario autenticado.
  useEffect(() => {
    const nextData = {
      employeeName: user?.employeeName || user?.username || '',
      firstName: user?.firstName || '',
      lastName1: user?.lastName1 || '',
      lastName2: user?.lastName2 || '',
      email: user?.email || '',
      phone: user?.phone || '',
      password: '',
      confirmPassword: ''
    };

    setFormData(prev => Object.assign({}, prev, nextData));
    setBaselineData(trimValues(nextData, COMPARABLE_FIELDS));
    setEmployeeMeta({
      id: resolveUserId(user),
      roleId: resolveEmployeeRoleId(user),
      headquartersId: resolveEmployeeHeadquartersId(user)
    });
  }, [user]);

  const hasChanges = useMemo(() => {
    const currentComparable = trimValues(formData, COMPARABLE_FIELDS);
    const hasProfileChanges = COMPARABLE_FIELDS.some((field) => currentComparable[field] !== baselineData[field]);
    const hasPasswordChanges = Boolean(formData.password || formData.confirmPassword);
    return hasProfileChanges || hasPasswordChanges;
  }, [baselineData, formData]);

  // Maneja cambios de inputs y limpia errores/avisos.
  const handleChange = useCallback((e) => {
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
  }, [errorMessage, fieldErrors, statusMessage]);

  // Envía el formulario, valida datos y actualiza el perfil del empleado.
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    if (!hasChanges) {
      return;
    }

    const trimmedData = trimValues(formData, COMPARABLE_FIELDS);
    const passwordValue = formData.password;
    const confirmPasswordValue = formData.confirmPassword;

    const nextErrors = {};
    EDITABLE_FIELDS.forEach((field) => validateRequired(trimmedData[field], field, nextErrors));
    validateRequired(trimmedData.email, 'email', nextErrors);

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
      setBaselineData(trimmedData);
      setStatusMessage(MESSAGES.PROFILE_UPDATED);
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.message || MESSAGES.ERROR_UPDATING);
    } finally {
      setIsSaving(false);
    }
  }, [employeeMeta, formData, hasChanges, updateUser, user]);

  return {
    formData,
    fieldErrors,
    statusMessage,
    errorMessage,
    hasChanges,
    isSaving,
    handleChange,
    handleSubmit
  };
};

export default useProfileEmployeeForm;
