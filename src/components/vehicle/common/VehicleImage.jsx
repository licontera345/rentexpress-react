import { MESSAGES } from '../../../constants';

function VehicleImage({
  imageSrc,
  hasImage,
  alt,
  className,
  fallbackClassName,
  showNoImageLabel = true,
  initials
}) {
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
