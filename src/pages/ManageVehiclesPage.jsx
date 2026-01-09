import { useEffect, useState } from 'react';
import { VehicleService } from '../services/api';
import VehicleForm from '../components/VehicleForm';
import VehicleTable from '../components/VehicleTable';


const ManageVehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);


    useEffect(() => { load(); }, []);


    const load = async () => {
        const data = await VehicleService.search({ pageNumber: 1, pageSize: 100 });
        setVehicles(data.results || []);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        if (editing) await VehicleService.update(editing.vehicleId, data);
        else await VehicleService.create(data);
        setShowForm(false);
        setEditing(null);
        load();
    };


    const handleEdit = async (id) => {
        const v = await VehicleService.findById(id);
        setEditing(v);
        setShowForm(true);
    };


    const handleDelete = async (id) => {
        await VehicleService.delete(id);
        load();
    };


    return (
        <>
            <button onClick={() => setShowForm(true)}>Nuevo vehículo</button>
            {showForm && (
                <VehicleForm
                    initialData={editing}
                    onSubmit={handleSubmit}
                    onCancel={() => { setShowForm(false); setEditing(null); }}
                />
            )}
            <VehicleTable vehicles={vehicles} onEdit={handleEdit} onDelete={handleDelete} />
        </>
    );
};


export default ManageVehiclesPage;