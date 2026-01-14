import PublicLayout from '../../components/layout/public/PublicLayout.jsx';
import VehicleCard from '../../components/common/card/VehicleCard';

const vehicles = [
  { id: 1, name: 'BMW Serie 3', price: 90 },
  { id: 2, name: 'Audi A4', price: 85 }
];

function Catalog() {
  return (
    <PublicLayout>
      {vehicles.map(v => (
        <VehicleCard key={v.id} vehicle={v} />
      ))}
    </PublicLayout>
  );
}

export default Catalog;
