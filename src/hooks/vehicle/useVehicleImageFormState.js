import { useCallback, useEffect, useState } from 'react';
import { validateVehicleImageFile } from '../../utils/vehicle';

export function useVehicleImageFormState() {
  const [imageFile, setImageFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');

  const updatePreview = useCallback((nextSrc) => {
    setPreviewSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextSrc;
    });
  }, []);

  useEffect(() => () => {
    setPreviewSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return '';
    });
  }, []);

  const onFileChange = useCallback((event) => {
    const file = event.target.files?.[0] ?? null;
    setFileError(null);
    const validationError = file ? validateVehicleImageFile(file) : null;
    if (validationError) {
      setFileError(validationError);
      setImageFile(null);
      updatePreview('');
      return;
    }
    setImageFile(file);
    updatePreview(file ? URL.createObjectURL(file) : '');
  }, [updatePreview]);

  const reset = useCallback(() => {
    setImageFile(null);
    setFileError(null);
    updatePreview('');
  }, [updatePreview]);

  return {
    imageFile,
    fileError,
    setFileError,
    previewSrc,
    selectedFileName: imageFile?.name || '',
    onFileChange,
    reset,
  };
}
