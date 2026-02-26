import VehicleImageService from '../../api/services/VehicleImageService';
import { MESSAGES, IMAGE_CONFIG } from '../../constants';

export const getPrimaryImage = (images = []) => {
  if (!Array.isArray(images) || images.length === 0) return null;
  return images.find((img) => img?.primary) ?? images[0];
};

export const validateVehicleImageFile = (file) => {
  if (!file) return MESSAGES.ERROR_LOADING_DATA;
  if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type)) return MESSAGES.INVALID_IMAGE_TYPE;
  if (file.size > IMAGE_CONFIG.MAX_SIZE) return MESSAGES.IMAGE_TOO_LARGE;
  return null;
};

const uploadToCloudinary = async (file, signatureData) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signatureData.apiKey);
  formData.append('timestamp', String(signatureData.timestamp));
  formData.append('signature', signatureData.signature);
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;
  const response = await fetch(cloudinaryUrl, { method: 'POST', body: formData });
  if (!response.ok) throw new Error(MESSAGES.ERROR_SAVING);
  return response.json();
};

export const uploadVehicleImageFile = async (vehicleId, file) => {
  const validationError = validateVehicleImageFile(file);
  if (validationError) throw new Error(validationError);
  const signatureData = await VehicleImageService.getCloudinarySignature();
  const cloudinaryResult = await uploadToCloudinary(file, signatureData);
  return VehicleImageService.upload(vehicleId, {
    publicId: cloudinaryResult.public_id,
    secureUrl: cloudinaryResult.secure_url,
    primary: true,
  });
};
