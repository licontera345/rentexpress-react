import VehicleImageService from '../api/services/VehicleImageService';
import { IMAGE_CONFIG, MESSAGES } from '../constants';

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

// Obtiene la imagen principal de una lista de imágenes.
export const getPrimaryImage = (images = []) => {
  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }
  return images.find((image) => image?.primary) ?? images[0];
};

// Valida un archivo de imagen (tipo y tamaño).
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

// Sube un archivo a Cloudinary con la firma obtenida del backend.
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

// Obtiene firma, sube a Cloudinary y registra la imagen en el backend.
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
