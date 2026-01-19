import './VehicleCardSkeleton.css';

function VehicleCardSkeleton() {
  return (
    <div className="vehicle-card skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-header"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-price"></div>
      </div>
    </div>
  );
}

export default VehicleCardSkeleton;
