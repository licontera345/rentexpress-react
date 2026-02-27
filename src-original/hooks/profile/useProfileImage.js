import { useCallback, useEffect, useMemo, useState } from 'react';
import ProfileImageService from '../../api/services/ProfileImageService';
import VehicleImageService from '../../api/services/VehicleImageService';
import { IMAGE_CONFIG, MESSAGES } from '../../constants';

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

// Obtiene la imagen principal de la lista de imágenes.
const getPrimaryImage = (images = []) => {
  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  return images.find((image) => image?.primary) ?? images[0];
};

// Valida el archivo de imagen.
export const validateProfileImageFile = (file) => {
  if (!file) {
    return MESSAGES.ERROR_LOADING_DATA;
  }

  if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return MESSAGES.INVALID_IMAGE_TYPE;
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return MESSAGES.IMAGE_TOO_LARGE;
  }

  return null;
};

// Sube el archivo de imagen a Cloudinary.
const uploadToCloudinary = async (file, signatureData) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signatureData.apiKey);
  formData.append('timestamp', String(signatureData.timestamp));
  formData.append('signature', signatureData.signature);

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;
  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(MESSAGES.ERROR_SAVING);
  }

  return response.json();
};

// Sube el archivo de imagen a Cloudinary.
export const uploadProfileImageFile = async ({ entityType, entityId, file }) => {
  const validationError = validateProfileImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const signatureData = await VehicleImageService.getCloudinarySignature();
  const cloudinaryResult = await uploadToCloudinary(file, signatureData);

  const payload = {
    publicId: cloudinaryResult.public_id,
    secureUrl: cloudinaryResult.secure_url,
    primary: true
  };

  if (entityType === 'employee') {
    return ProfileImageService.uploadEmployee(entityId, payload);
  }

  return ProfileImageService.uploadUser(entityId, payload);
};

function useProfileImage({ entityType, entityId, refreshKey = 0 }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carga las imágenes del perfil.
  const loadImages = useCallback(async () => {
    if (!entityId) {
      setImages([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = entityType === 'employee'
        ? await ProfileImageService.listEmployees(entityId)
        : await ProfileImageService.listUsers(entityId);
      setImages(Array.isArray(response) ? response : []);
    } catch (err) {
      setImages([]);
      setError(err?.message || MESSAGES.ERROR_LOADING_DATA);
    } finally {
      setIsLoading(false);
    }
  }, [entityId, entityType]);

  // Carga las imágenes del perfil cuando cambia el refreshKey.
  useEffect(() => {
    loadImages();
  }, [loadImages, refreshKey]);

  // Obtiene la imagen principal.
  const image = useMemo(() => getPrimaryImage(images), [images]);

  // Sube la imagen del perfil.
  const uploadImage = useCallback(async (file) => {
    await uploadProfileImageFile({ entityType, entityId, file });
    await loadImages();
  }, [entityId, entityType, loadImages]);

  // Elimina la imagen del perfil.
  const removeImage = useCallback(async () => {
    const currentImage = getPrimaryImage(images);
    if (!currentImage?.imageId) {
      return;
    }

    await ProfileImageService.remove(currentImage.imageId);
    await loadImages();
  }, [images, loadImages]);

  // Estado y callbacks para el hook.
    return {
    imageSrc: image?.secureUrl ?? '',
    image,
    images,
    hasImage: Boolean(image?.secureUrl),
    isLoading,
    error,
    uploadImage,
    removeImage,
    reload: loadImages
  };
}

export default useProfileImage;
