function VehicleDetailModal({ vehicle, onClose }) {
  if (!vehicle) return null;

  return (
    <div>
      <h2>{vehicle.name}</h2>
      <p>{vehicle.description}</p>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}

export default VehicleDetailModal;
