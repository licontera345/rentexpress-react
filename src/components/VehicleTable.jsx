import VehicleRow from './VehicleRow';


const VehicleTable = ({ vehicles, onEdit, onDelete }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Vehículo</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Año</th>
                    <th>Matrícula</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {vehicles.map(v => (
                    <VehicleRow key={v.vehicleId} vehicle={v} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </tbody>
        </table>
    );
};


export default VehicleTable;