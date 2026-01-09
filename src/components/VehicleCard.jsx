const VehicleCard = ({ vehicle, onClick }) => {
    return (
        <li 
            onClick={() => onClick(vehicle.vehicleId)}
            style={{ 
                background: '#f8fafc', 
                border: '2px solid #e2e8f0', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                listStyle: 'none'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = '#380cd8';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #380cd8 0%, #2e04c5 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <span style={{ fontSize: '3rem', fontWeight: '700', letterSpacing: '4px', marginBottom: '8px' }}>
                    {vehicle.brand.charAt(0)}{vehicle.model.charAt(0)}
                </span>
                <p style={{ fontSize: '0.9rem', opacity: '0.8', margin: 0 }}>Sin imagen</p>
            </div>

            <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>
                        {vehicle.brand} {vehicle.model}
                    </span>
                    <span style={{ background: '#e2e8f0', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
                        {vehicle.manufactureYear}
                    </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <p style={{ margin: '10px 0', fontSize: '0.95rem', color: '#64748b' }}>
                        <strong>Matrícula:</strong> {vehicle.licensePlate}
                    </p>
                    <p style={{ margin: '10px 0', fontSize: '0.95rem', color: '#64748b' }}>
                        <strong>Kilometraje:</strong> {vehicle.currentMileage.toLocaleString()} km
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Precio por día</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#380cd8' }}>
                        {vehicle.dailyPrice}€
                    </span>
                </div>
            </div>
        </li>
    );
};

export default VehicleCard;