import { useState, useEffect } from 'react';
import { VehicleService } from '../services/api';

const ManageVehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const response = await VehicleService.search({
                pageNumber: 1,
                pageSize: 100
            });
            setVehicles(response.results || []);
        } catch (error) {
            console.error('Error cargando vehículos:', error);
            showMessage('Error al cargar vehículos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleEdit = async (vehicleId) => {
        try {
            const vehicle = await VehicleService.findById(vehicleId);
            setEditingVehicle(vehicle);
            setShowForm(true);
        } catch (error) {
            showMessage('Error al cargar el vehículo', 'error');
        }
    };

    const handleDelete = async (vehicleId) => {
        if (!window.confirm('¿Estás seguro de eliminar este vehículo?')) return;

        try {
            await VehicleService.delete(vehicleId);
            showMessage('Vehículo eliminado correctamente');
            loadVehicles();
        } catch (error) {
            showMessage('Error al eliminar el vehículo', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            brand: formData.get('brand'),
            model: formData.get('model'),
            manufactureYear: parseInt(formData.get('manufactureYear')),
            licensePlate: formData.get('licensePlate'),
            vinNumber: formData.get('vinNumber'),
            currentMileage: parseInt(formData.get('currentMileage')),
            dailyPrice: parseFloat(formData.get('dailyPrice')),
            activeStatus: formData.get('activeStatus') === 'true'
        };

        try {
            if (editingVehicle) {
                await VehicleService.update(editingVehicle.vehicleId, data);
                showMessage('Vehículo actualizado correctamente');
            } else {
                await VehicleService.create(data);
                showMessage('Vehículo creado correctamente');
            }
            setShowForm(false);
            setEditingVehicle(null);
            loadVehicles();
        } catch (error) {
            showMessage('Error al guardar el vehículo', 'error');
        }
    };

    if (loading) {
        return <div className="loading-text">Cargando...</div>;
    }

    return (
        <div className="manage-container">
            {message && (
                <div className={`message-box message-${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="manage-header">
                <h2 className="manage-title">Gestión de Vehículos</h2>
                <button 
                    onClick={() => {
                        setEditingVehicle(null);
                        setShowForm(true);
                    }}
                    className="btn-new-vehicle"
                >
                    <span>➕</span> Nuevo Vehículo
                </button>
            </div>

            {showForm && (
                <div className="manage-form-container">
                    <h3 className="manage-form-title">
                        {editingVehicle ? 'Editar' : 'Nuevo'} Vehículo
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Marca *</label>
                                <input type="text" name="brand" defaultValue={editingVehicle?.brand} required />
                            </div>
                            <div className="form-group">
                                <label>Modelo *</label>
                                <input type="text" name="model" defaultValue={editingVehicle?.model} required />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Año *</label>
                                <input type="number" name="manufactureYear" defaultValue={editingVehicle?.manufactureYear} required />
                            </div>
                            <div className="form-group">
                                <label>Matrícula *</label>
                                <input type="text" name="licensePlate" defaultValue={editingVehicle?.licensePlate} required />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>VIN *</label>
                                <input type="text" name="vinNumber" defaultValue={editingVehicle?.vinNumber} required />
                            </div>
                            <div className="form-group">
                                <label>Kilometraje *</label>
                                <input type="number" name="currentMileage" defaultValue={editingVehicle?.currentMileage} required />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Precio/día (€) *</label>
                                <input type="number" step="0.01" name="dailyPrice" defaultValue={editingVehicle?.dailyPrice} required />
                            </div>
                            <div className="form-group">
                                <label>Estado</label>
                                <select name="activeStatus" defaultValue={editingVehicle?.activeStatus !== false ? 'true' : 'false'}>
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                        </div>

                        <div className="manage-form-actions">
                            <button 
                                type="button" 
                                onClick={() => { 
                                    setShowForm(false); 
                                    setEditingVehicle(null); 
                                }} 
                                className="btn-cancel"
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn-save">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="manage-table-container">
                <table className="manage-table">
                    <thead>
                        <tr>
                            <th>Iniciales</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Año</th>
                            <th>Matrícula</th>
                            <th>Precio/día</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="manage-table-empty">
                                    No hay vehículos registrados
                                </td>
                            </tr>
                        ) : (
                            vehicles.map(v => (
                                <tr key={v.vehicleId}>
                                    <td>
                                        <div className="vehicle-initials-cell">
                                            {v.brand.charAt(0)}{v.model.charAt(0)}
                                        </div>
                                    </td>
                                    <td>{v.brand}</td>
                                    <td>{v.model}</td>
                                    <td>{v.manufactureYear}</td>
                                    <td>{v.licensePlate}</td>
                                    <td>{v.dailyPrice}€</td>
                                    <td>
                                        <span className={`vehicle-status-badge ${v.activeStatus ? 'active' : 'inactive'}`}>
                                            {v.activeStatus ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="vehicle-actions">
                                            <button onClick={() => handleEdit(v.vehicleId)} className="btn-action" title="Editar">
                                                ✏️
                                            </button>
                                            <button onClick={() => handleDelete(v.vehicleId)} className="btn-action" title="Eliminar">
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageVehiclesPage;