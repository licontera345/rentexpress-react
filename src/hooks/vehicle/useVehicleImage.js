import { useCallback, useEffect, useMemo, useState } from 'react';
import VehicleImageService from '../../api/services/VehicleImageService';
import { IMAGE_CONFIG, MESSAGES } from '../../constants';

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

const getPrimaryImage = (images = []) => {
  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  return images.find((image) => image?.primary) ?? images[0];
};

export const validateVehicleImageFile = (file) => {
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

export const uploadVehicleImageFile = async (vehicleId, file) => {
  const validationError = validateVehicleImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const signatureData = await VehicleImageService.getCloudinarySignature();
  const cloudinaryResult = await uploadToCloudinary(file, signatureData);

  return VehicleImageService.upload(vehicleId, {
    publicId: cloudinaryResult.public_id,
    secureUrl: cloudinaryResult.secure_url,
    primary: true
  });
};

function useVehicleImage(vehicleId, refreshKey = 0) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadImages = useCallback(async () => {
    if (!vehicleId) {
      setImages([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await VehicleImageService.list(vehicleId);
      setImages(Array.isArray(response) ? response : []);
    } catch (err) {
      setImages([]);
      setError(err.message || MESSAGES.ERROR_LOADING_DATA);
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    loadImages();
  }, [loadImages, refreshKey]);

  const image = useMemo(() => getPrimaryImage(images), [images]);

  const uploadImage = useCallback(async (file) => {
    await uploadVehicleImageFile(vehicleId, file);
    await loadImages();
  }, [loadImages, vehicleId]);

  const removeImage = useCallback(async () => {
    const currentImage = getPrimaryImage(images);
    if (!currentImage?.imageId) {
      return;
    }

    await VehicleImageService.remove(currentImage.imageId);
    await loadImages();
  }, [images, loadImages]);

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

export default useVehicleImage;
