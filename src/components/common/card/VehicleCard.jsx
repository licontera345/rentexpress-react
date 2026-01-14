function VehicleCard({ vehicle }) {
  return (
    <div>
      <h3>{vehicle.name}</h3>
      <p>{vehicle.price} €/día</p>
    </div>
  );
}

export default VehicleCard;
