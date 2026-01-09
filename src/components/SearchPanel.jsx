import { useState, useEffect } from 'react';
import { HeadquartersService, AddressService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SearchPanel = ({ onSearch }) => {
    const [headquarters, setHeadquarters] = useState([]);
    const [pickupHq, setPickupHq] = useState('');
    const [returnHq, setReturnHq] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTime, setPickupTime] = useState('10:00');
    const [returnDate, setReturnDate] = useState('');
    const [returnTime, setReturnTime] = useState('10:00');
    const [pickupDetails, setPickupDetails] = useState('');
    const [returnDetails, setReturnDetails] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        loadHeadquarters();
    }, []);

    const loadHeadquarters = async () => {
        try {
            const data = await HeadquartersService.getAll();
            setHeadquarters(data);
        } catch (error) {
            console.error('Error cargando sedes:', error);
        }
    };

    const loadHqDetails = async (hqId, setter) => {
        if (!hqId) {
            setter('');
            return;
        }

        const hq = headquarters.find(h => h.id === parseInt(hqId));
        if (!hq) return;

        let html = `<strong>${hq.name || 'Sede sin nombre'}</strong><br>`;

        if (!hq.addressId) {
            html += '<em>Dirección no disponible</em>';
        } else if (token) {
            try {
                const addr = await AddressService.findById(hq.addressId);
                const addressLine = [addr.street, addr.number].filter(Boolean).join(' ').trim();
                if (addressLine) html += addressLine + '<br>';
                
                const locationLine = [addr.cityName, addr.provinceName].filter(Boolean).join(', ').trim();
                if (locationLine) html += locationLine;
                
                if (!addressLine && !locationLine) {
                    html += '<em>Dirección no disponible</em>';
                }
            } catch (e) {
                html += '<em>Error al cargar la dirección</em>';
            }
        } else {
            html += '<em>Inicia sesión como empleado para ver la dirección</em>';
        }

        setter(html);
    };

    const handleSearch = () => {
        onSearch({
            pickupHeadquartersId: pickupHq,
            returnHeadquartersId: returnHq,
            pickupDate,
            pickupTime,
            returnDate,
            returnTime
        });
    };

    return (
        <section style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Lugar de recogida
                </label>
                <select 
                    value={pickupHq}
                    onChange={(e) => {
                        setPickupHq(e.target.value);
                        loadHqDetails(e.target.value, setPickupDetails);
                    }}
                    style={{ padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', background: 'white' }}
                >
                    <option value="">Seleccionar</option>
                    {headquarters.map(hq => (
                        <option key={hq.id} value={hq.id}>{hq.name}</option>
                    ))}
                </select>
            </div>

            <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Lugar de devolución
                </label>
                <select 
                    value={returnHq}
                    onChange={(e) => {
                        setReturnHq(e.target.value);
                        loadHqDetails(e.target.value, setReturnDetails);
                    }}
                    style={{ padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', background: 'white' }}
                >
                    <option value="">Seleccionar</option>
                    {headquarters.map(hq => (
                        <option key={hq.id} value={hq.id}>{hq.name}</option>
                    ))}
                </select>
            </div>

            <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Fecha de recogida
                </label>
                <input 
                    type="date" 
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    style={{ padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}
                />
            </div>

            <div style={{ flex: '0.8 1 120px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Hora
                </label>
                <input 
                    type="time" 
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    style={{ padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}
                />
            </div>

            <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Fecha de devolución
                </label>
                <input 
                    type="date" 
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    style={{ padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}
                />
            </div>

            <div style={{ flex: '0.8 1 120px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Hora
                </label>
                <input 
                    type="time" 
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    style={{ padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}
                />
            </div>

            <div style={{ flex: '0 1 160px' }}>
                <button 
                    onClick={handleSearch}
                    style={{ width: '100%', padding: '14px 24px', marginTop: '22px', background: 'linear-gradient(135deg, #380cd8 0%, #2e04c5 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', cursor: 'pointer' }}
                >
                    BUSCAR
                </button>
            </div>

            {pickupDetails && (
                <div 
                    style={{ flexBasis: '100%', padding: '14px 16px', background: '#f1f5f9', borderRadius: '8px', borderLeft: '4px solid #380cd8', fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}
                    dangerouslySetInnerHTML={{ __html: pickupDetails }}
                />
            )}

            {returnDetails && (
                <div 
                    style={{ flexBasis: '100%', padding: '14px 16px', background: '#f1f5f9', borderRadius: '8px', borderLeft: '4px solid #380cd8', fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}
                    dangerouslySetInnerHTML={{ __html: returnDetails }}
                />
            )}
        </section>
    );
};

export default SearchPanel;