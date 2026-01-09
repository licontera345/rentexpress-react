const VehicleCard = ({ vehicle, onClick }) => {
    return (
        <li 
            onClick={() => onClick(vehicle.vehicleId)}
            className="vehicle-card"
        >
            <div className="vehicle-card-image">
                <span className="vehicle-card-initials">
                    {vehicle.brand.charAt(0)}{vehicle.model.charAt(0)}
                </span>
                <p className="vehicle-card-no-image">Sin imagen</p>
            </div>

            <div className="vehicle-card-body">
                <div className="vehicle-card-header">
                    <span className="vehicle-card-title">
                        {vehicle.brand} {vehicle.model}
                    </span>
                    <span className="vehicle-card-year">
                        {vehicle.manufactureYear}
                    </span>
                </div>

                <div className="vehicle-card-info">
                    <p>
                        <strong>Matrícula:</strong> {vehicle.licensePlate}
                    </p>
                    <p>
                        <strong>Kilometraje:</strong> {vehicle.currentMileage.toLocaleString()} km
                    </p>
                </div>

                <div className="vehicle-card-footer">
                    <span className="vehicle-card-price-label">Precio por día</span>
                    <span className="vehicle-card-price">
                        {vehicle.dailyPrice}€
                    </span>
                </div>
            </div>
        </li>
    );
};

export default VehicleCard;