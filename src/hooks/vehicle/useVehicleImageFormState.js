import { useCallback, useEffect, useState } from 'react';
import { validateVehicleImageFile } from '../../utils/vehicle';

export function useVehicleImageFormState() {
  const [imageFile, setImageFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');

  // Actualiza la preview de la imagen.
  const updatePreview = useCallback((nextSrc) => {
    setPreviewSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextSrc;
    });
  }, []);

  // Revoca la URL de la preview cuando se desmonta el componente.
  useEffect(() => () => {
    setPreviewSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return '';
    });
  }, []);

  // Manejador de cambio de archivo.
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

  // Resetea el estado de la imagen.
  const reset = useCallback(() => {
    setImageFile(null);
    setFileError(null);
    updatePreview('');
  }, [updatePreview]);

  // Estado y callbacks para el hook.
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
