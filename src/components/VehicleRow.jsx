const VehicleRow = ({ vehicle, onEdit, onDelete }) => {
    return (
        <tr>
            <td>{vehicle.brand[0]}{vehicle.model[0]}</td>
            <td>{vehicle.brand}</td>
            <td>{vehicle.model}</td>
            <td>{vehicle.manufactureYear}</td>
            <td>{vehicle.licensePlate}</td>
            <td>{vehicle.dailyPrice}€</td>
            <td>{vehicle.activeStatus ? 'Activo' : 'Inactivo'}</td>
            <td>
                <button onClick={() => onEdit(vehicle.vehicleId)}>✏️</button>
                <button onClick={() => onDelete(vehicle.vehicleId)}>🗑️</button>
            </td>
        </tr>
    );
};


export default VehicleRow;