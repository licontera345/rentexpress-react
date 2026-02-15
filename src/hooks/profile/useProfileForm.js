import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../core/useAuth';
import useProfileImage, { validateProfileImageFile } from './useProfileImage';
import { trimValues } from '../../utils/formValidation';
import { MESSAGES } from '../../constants';

/**
 * Hook genérico de formulario de perfil (cliente o empleado).
 * Recibe opciones para adaptar la lógica según el tipo de perfil.
 *
 * @param {Object} options
 * @param {'client'|'employee'} options.profileType
 * @param {'user'|'employee'} options.entityType - Para useProfileImage
 * @param {Function} options.getEntityId - (user) => userId | employeeId
 * @param {Function} options.getInitialFormData - (user, resolvedAddress?) => formData
 * @param {Function} options.getBaselineData - (user, resolvedAddress?) => baseline
 * @param {string[]} options.trimFields - Campos a trimear para validación
 * @param {Function} options.checkDirty - (formData, baselineData, extra) => boolean
 * @param {Function} options.getChangeExtras - (name, value, prev) => partialUpdate
 * @param {Function} options.validate - (formData, trimmedData, passwordValue, confirmValue, nextErrors) => void
 * @param {Function} options.submit - async (ctx) => void
 * @param {boolean} [options.useAddress=false]
 * @param {Function} [options.getResolvedAddress] - (user) => address
 * @param {Function} [options.fetchAddress] - (addressId) => Promise<address>
 * @param {Function} [options.syncAddressToForm] - (address, setFormData) => void
 * @param {Object} [options.extraState] - Estado adicional (provinces, cities, etc.)
 * @param {Object} [options.extraUi] - UI adicional (loadingProvinces, etc.)
 */
const useProfileForm = (options) => {
  const {
    entityType,
    getEntityId,
    getInitialFormData,
    getBaselineData,
    trimFields,
    checkDirty,
    getChangeExtras = () => ({}),
    validate,
    submit,
    useAddress = false,
    getResolvedAddress,
    fetchAddress,
    syncAddressToForm,
    extraState = {},
    extraUi = {}
  } = options;

  const { user, token, updateUser } = useAuth();
  const entityId = getEntityId(user);
  const resolvedAddress = useMemo(
    () => (useAddress && getResolvedAddress ? getResolvedAddress(user) : null),
    [useAddress, getResolvedAddress, user]
  );

  const [formData, setFormData] = useState(() =>
    getInitialFormData(user, resolvedAddress)
  );
  const [addressId, setAddressId] = useState(() => {
    if (!useAddress || !resolvedAddress) return null;
    return resolvedAddress?.id ?? resolvedAddress?.addressId ?? user?.addressId ?? null;
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [profileImageError, setProfileImageError] = useState(null);

  const { imageSrc, hasImage, uploadImage, removeImage } = useProfileImage({
    entityType,
    entityId,
    refreshKey: entityId ?? 0
  });

  const baselineData = useMemo(
    () => getBaselineData(user, resolvedAddress),
    [user, resolvedAddress, getBaselineData]
  );
  const hasPasswordInput = Boolean(formData.password || formData.confirmPassword);
  const isDirty = useMemo(
    () => checkDirty(formData, baselineData, { profileImageFile, hasPasswordInput }),
    [formData, baselineData, profileImageFile, hasPasswordInput, checkDirty]
  );

  // Sync address to form when resolved
  const doSyncAddress = useCallback((address) => {
    if (syncAddressToForm && address) {
      const partial = syncAddressToForm(address);
      setFormData((prev) => Object.assign({}, prev, partial));
    }
  }, [syncAddressToForm]);

  // Fetch address when user has addressId but no resolvedAddress
  useEffect(() => {
    if (!useAddress || !fetchAddress) return;

    const nextAddressId = resolvedAddress?.id ?? resolvedAddress?.addressId ?? user?.addressId ?? null;
    setAddressId(nextAddressId);

    if (resolvedAddress) {
      doSyncAddress(resolvedAddress);
      return;
    }
    if (!token || !user?.addressId) return;

    let isMounted = true;
    fetchAddress(user.addressId).then((data) => {
      if (isMounted && data) doSyncAddress(data);
    });
    return () => { isMounted = false; };
  }, [useAddress, resolvedAddress, token, user?.addressId, fetchAddress, doSyncAddress]);

  // Sync form when user changes (only user in deps to avoid reset loops)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...getInitialFormData(user, resolvedAddress)
    }));
    setIsEditing(false);
    setShowPasswordFields(false);
    setProfileImageFile(null);
    setProfileImagePreview('');
    setProfileImageError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when user identity changes
  }, [user]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const extras = getChangeExtras(name, value, formData);
    setFormData((prev) => Object.assign({}, prev, { [name]: value }, extras));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => Object.assign({}, prev, { [name]: null }));
    }
    if (statusMessage) setStatusMessage('');
    if (errorMessage) setErrorMessage('');
  }, [errorMessage, fieldErrors, statusMessage, formData, getChangeExtras]);

  const resetPasswordFields = useCallback(() => {
    setFormData((prev) => Object.assign({}, prev, { password: '', confirmPassword: '' }));
    setFieldErrors((prev) => Object.assign({}, prev, { password: null, confirmPassword: null }));
  }, []);

  const handleReset = useCallback(() => {
    setFormData(getInitialFormData(user, resolvedAddress));
    setFieldErrors({});
    setStatusMessage('');
    setErrorMessage('');
    setShowPasswordFields(false);
  }, [user, resolvedAddress, getInitialFormData]);

  const toggleEditMode = useCallback(() => {
    setStatusMessage('');
    setErrorMessage('');
    setFieldErrors({});
    if (isEditing) {
      handleReset();
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [handleReset, isEditing]);

  const togglePasswordFields = useCallback(() => {
    if (!isEditing || isSaving) return;
    setShowPasswordFields((prev) => {
      const next = !prev;
      if (!next) resetPasswordFields();
      return next;
    });
  }, [isEditing, isSaving, resetPasswordFields]);

  const handleProfileImageChange = useCallback((event) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    const validationError = validateProfileImageFile(file);
    if (validationError) {
      setProfileImageError(validationError);
      setProfileImageFile(null);
      setProfileImagePreview('');
      return;
    }

    const preview = URL.createObjectURL(file);
    setProfileImageFile(file);
    setProfileImagePreview(preview);
    setProfileImageError(null);
    if (statusMessage) setStatusMessage('');
    if (errorMessage) setErrorMessage('');
  }, [errorMessage, statusMessage]);

  const resetProfileImage = useCallback(async () => {
    setProfileImageFile(null);
    setProfileImagePreview('');
    setProfileImageError(null);
    if (hasImage) await removeImage();
  }, [hasImage, removeImage]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    if (!isEditing || !isDirty) return;

    const trimmedData = trimValues(formData, trimFields);
    const passwordValue = showPasswordFields ? formData.password : '';
    const confirmValue = showPasswordFields ? formData.confirmPassword : '';

    const nextErrors = {};
    validate(formData, trimmedData, passwordValue, confirmValue, nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setErrorMessage(MESSAGES.REQUIRED_FIELDS);
      return;
    }

    setIsSaving(true);
    try {
      const ctx = {
        formData,
        trimmedData,
        passwordValue,
        profileImageFile,
        hasImage,
        uploadImage,
        removeImage,
        updateUser,
        user,
        entityId,
        addressId: useAddress ? addressId : undefined,
        setAddressId: useAddress ? setAddressId : () => {},
        setFieldErrors,
        setStatusMessage,
        setErrorMessage,
        resetPasswordFields,
        setShowPasswordFields,
        setIsEditing,
        setProfileImageFile,
        setProfileImagePreview,
        setProfileImageError,
        MESSAGES
      };
      await submit(ctx);
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.message || MESSAGES.ERROR_UPDATING);
    } finally {
      setIsSaving(false);
    }
  }, [
    formData, isEditing, isDirty, showPasswordFields, profileImageFile, hasImage,
    removeImage, uploadImage, updateUser, user, entityId, addressId, useAddress,
    trimFields, validate, submit, resetPasswordFields
  ]);

  return {
    state: {
      formData,
      fieldErrors,
      profileImage: {
        imageSrc,
        hasImage,
        previewSrc: profileImagePreview,
        selectedFileName: profileImageFile?.name || '',
        fileError: profileImageError
      },
      ...extraState
    },
    ui: {
      statusMessage,
      errorMessage,
      isSaving,
      isDirty,
      isEditing,
      showPasswordFields,
      ...extraUi
    },
    actions: {
      handleChange,
      handleSubmit,
      handleReset,
      toggleEditMode,
      togglePasswordFields,
      handleProfileImageChange,
      resetProfileImage
    },
    meta: {}
  };
};

export default useProfileForm;
