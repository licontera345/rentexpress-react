import { useCallback, useEffect, useMemo, useState } from 'react';
import VehicleImageService from '../../api/services/VehicleImageService';
import { MESSAGES } from '../../constants';
import {
  getPrimaryImage,
  validateVehicleImageFile,
  uploadVehicleImageFile
} from '../../utils/vehicle';

export { validateVehicleImageFile, uploadVehicleImageFile };

function useVehicleImage(vehicleId, refreshKey = 0) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carga las imágenes del vehículo.
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

  // Carga las imágenes del vehículo cuando cambia el refreshKey.
  useEffect(() => {
    loadImages();
  }, [loadImages, refreshKey]);

  // Obtiene la imagen principal.
  const image = useMemo(() => getPrimaryImage(images), [images]);

  // Sube la imagen del vehículo.
  const uploadImage = useCallback(async (file) => {
    await uploadVehicleImageFile(vehicleId, file);
    await loadImages();
  }, [loadImages, vehicleId]);

  // Elimina la imagen del vehículo.
  const removeImage = useCallback(async () => {
    if (!image?.imageId) {
      return;
    }
    await VehicleImageService.remove(image.imageId);
    await loadImages();
  }, [image, loadImages]);

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

export default useVehicleImage;
