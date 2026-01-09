const VehicleForm = ({ initialData, onSubmit, onCancel }) => {
    return (
        <form onSubmit={onSubmit}>
            <input name="brand" defaultValue={initialData?.brand} required />
            <input name="model" defaultValue={initialData?.model} required />
            <input name="manufactureYear" type="number" defaultValue={initialData?.manufactureYear} required />
            <input name="licensePlate" defaultValue={initialData?.licensePlate} required />
            <input name="vinNumber" defaultValue={initialData?.vinNumber} required />
            <input name="currentMileage" type="number" defaultValue={initialData?.currentMileage} required />
            <input name="dailyPrice" type="number" step="0.01" defaultValue={initialData?.dailyPrice} required />
            <select name="activeStatus" defaultValue={initialData?.activeStatus !== false ? 'true' : 'false'}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
            </select>
            <button type="button" onClick={onCancel}>Cancelar</button>
            <button type="submit">Guardar</button>
        </form>
    );
};


export default VehicleForm;