import useVehicleImage from '../../../hooks/useVehicleImage';
import { MESSAGES } from '../../../constants';

function VehicleImage({
  vehicleId,
  alt,
  className,
  fallbackClassName,
  refreshKey = 0,
  showNoImageLabel = true,
  initials
}) {
  const { imageSrc, hasImage } = useVehicleImage(vehicleId, refreshKey);

  if (hasImage) {
    return <img src={imageSrc} alt={alt} className={className} />;
  }

  return (
    <div className={fallbackClassName}>
      {initials && <span className="vehicle-initials">{initials}</span>}
      {showNoImageLabel && <p className="no-image-text">{MESSAGES.NO_IMAGE}</p>}
    </div>
  );
}

export default VehicleImage;
