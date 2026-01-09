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
        return <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Cargando...</div>;
    }

    return (
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)' }}>
            {message && (
                <div style={{ 
                    padding: '16px 24px', 
                    borderRadius: '8px', 
                    marginBottom: '20px', 
                    fontWeight: '500',
                    background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                    color: message.type === 'success' ? '#065f46' : '#991b1b',
                    borderLeft: `4px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`
                }}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '20px', borderBottom: '2px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '2rem', color: '#0f172a' }}>Gestión de Vehículos</h2>
                <button 
                    onClick={() => {
                        setEditingVehicle(null);
                        setShowForm(true);
                    }}
                    style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', background: 'linear-gradient(135deg, #380cd8 0%, #2e04c5 100%)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                    <span>➕</span> Nuevo Vehículo
                </button>
            </div>

            {showForm && (
                <div style={{ marginBottom: '32px', padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
                    <h3 style={{ marginBottom: '24px', color: '#0f172a' }}>
                        {editingVehicle ? 'Editar' : 'Nuevo'} Vehículo
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>Marca *</label>
                                <input type="text" name="brand" defaultValue={editingVehicle?.brand} required style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>Modelo *</label>
                                <input type="text" name="model" defaultValue={editingVehicle?.model} required style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>Año *</label>
                                <input type="number" name="manufactureYear" defaultValue={editingVehicle?.manufactureYear} required style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>Matrícula *</label>
                                <input type="text" name="licensePlate" defaultValue={editingVehicle?.licensePlate} required style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>VIN *</label>
                                <input type="text" name="vinNumber" defaultValue={editingVehicle?.vinNumber} required style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>Kilometraje *</label>
                                <input type="number" name="currentMileage" defaultValue={editingVehicle?.currentMileage} required style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>Precio/día (€) *</label>
                                <input type="number" step="0.01" name="dailyPrice" defaultValue={editingVehicle?.dailyPrice} required style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>Estado</label>
                                <select name="activeStatus" defaultValue={editingVehicle?.activeStatus !== false ? 'true' : 'false'} style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}>
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                            <button type="button" onClick={() => { setShowForm(false); setEditingVehicle(null); }} style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', background: '#e2e8f0', color: '#475569' }}>
                                Cancelar
                            </button>
                            <button type="submit" style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', background: '#10b981', color: 'white' }}>
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Iniciales</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Marca</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Modelo</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Año</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Matrícula</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Precio/día</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Estado</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', fontSize: '1.1rem' }}>
                                    No hay vehículos registrados
                                </td>
                            </tr>
                        ) : (
                            vehicles.map(v => (
                                <tr key={v.vehicleId}>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                                        <div style={{ width: '80px', height: '60px', background: 'linear-gradient(135deg, #380cd8 0%, #2e04c5 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '1.5rem', letterSpacing: '2px' }}>
                                            {v.brand.charAt(0)}{v.model.charAt(0)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>{v.brand}</td>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>{v.model}</td>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>{v.manufactureYear}</td>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>{v.licensePlate}</td>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>{v.dailyPrice}€</td>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                                        <span style={{ 
                                            padding: '6px 12px', 
                                            borderRadius: '20px', 
                                            fontSize: '0.85rem', 
                                            fontWeight: '600',
                                            background: v.activeStatus ? '#d1fae5' : '#fee2e2',
                                            color: v.activeStatus ? '#065f46' : '#991b1b'
                                        }}>
                                            {v.activeStatus ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => handleEdit(v.vehicleId)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', padding: '8px', borderRadius: '6px' }} title="Editar">
                                                ✏️
                                            </button>
                                            <button onClick={() => handleDelete(v.vehicleId)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', padding: '8px', borderRadius: '6px' }} title="Eliminar">
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