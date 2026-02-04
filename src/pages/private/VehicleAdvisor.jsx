import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVehicleRecommendations } from '../../api/services/GeminiService';
import VehicleCard from '../../components/vehicle/cards/VehicleCard';
import VehicleDetailModal from '../../components/vehicle/modals/VehicleDetailModal';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/vehicleAdvisor.css';
import { ROUTES } from '../../constants';

const DEFAULT_FORM = {
  destination: '',
  companions: '',
  duration: '',
  peopleCount: '',
  notes: '',
};

function VehicleAdvisor() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [status, setStatus] = useState({ loading: false, error: '', summary: '' });
  const [recommendations, setRecommendations] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const { isAuthenticated } = useAuth();

  // 1. Cargar vehículos desde sessionStorage al montar
  useEffect(() => {
    const storedVehicles = sessionStorage.getItem('ai_advisor_vehicles');
    if (storedVehicles) {
      try {
        const parsed = JSON.parse(storedVehicles);
        if (Array.isArray(parsed)) setVehicles(parsed);
      } catch (err) {
        console.error("Error al cargar vehículos del catálogo", err);
      }
    }
  }, []);

  // 2. Lógica de Emparejamiento (Matching) Optimizada
  const recommendedVehicles = useMemo(() => {
    if (!recommendations.length || !vehicles.length) return [];

    return recommendations.map((rec) => {
      // Intentar encontrar el vehículo por ID o por nombre
      const vehicleMatch = vehicles.find(v => 
        (v.vehicleId?.toString() === rec.id?.toString()) || 
        (v.id?.toString() === rec.id?.toString()) ||
        (`${v.brand} ${v.model}`.toLowerCase().includes(rec.name?.toLowerCase()))
      );

      return vehicleMatch ? {
        id: vehicleMatch.vehicleId ?? vehicleMatch.id,
        vehicle: vehicleMatch,
        reason: rec.reason
      } : null;
    }).filter(item => item !== null); // Eliminar recomendaciones que no se pudieron emparejar
  }, [recommendations, vehicles]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', summary: '' });
    setRecommendations([]);

    try {
      if (vehicles.length === 0) {
        throw new Error('No hay vehículos cargados. Por favor, visita el catálogo primero.');
      }

      const result = await getVehicleRecommendations({
        vehicles,
        tripDetails: form,
      });

      setRecommendations(result.recommendations ?? []);
      setStatus({ 
        loading: false, 
        error: '', 
        summary: result.summary || (result.recommendations?.length ? 'Estas son nuestras sugerencias para tu viaje:' : '') 
      });
    } catch (error) {
      setStatus({ loading: false, error: error.message, summary: '' });
    }
  };

  const handleReserve = useCallback((vehicle) => {
    if (!vehicle) return;
    
    const reservationState = {
      vehicleId: vehicle.vehicleId ?? vehicle.id,
      dailyPrice: vehicle.dailyPrice,
      vehicleSummary: {
        brand: vehicle.brand,
        model: vehicle.model,
        licensePlate: vehicle.licensePlate,
      }
    };

    if (isAuthenticated) {
      navigate(ROUTES.RESERVATION_CREATE, { state: reservationState });
    } else {
      navigate(ROUTES.LOGIN, {
        state: { redirectTo: ROUTES.RESERVATION_CREATE, redirectState: reservationState }
      });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="vehicle-advisor">
      <header className="vehicle-advisor__header">
        <h1>Recomendador de vehículos IA</h1>
        <div className="vehicle-advisor__badge">
          <span>Vehículos en catálogo: <strong>{vehicles.length}</strong></span>
        </div>
      </header>

      <div className="vehicle-advisor__container">
        {/* Formulario */}
        <form className="vehicle-advisor__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>¿A dónde vas?</label>
            <input name="destination" value={form.destination} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label>Pasajeros</label>
            <input type="number" name="peopleCount" value={form.peopleCount} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label>Notas (terreno, equipaje, etc.)</label>
            <textarea name="notes" value={form.notes} onChange={handleFormChange} rows="3" />
          </div>
          <button type="submit" disabled={status.loading || !vehicles.length}>
            {status.loading ? 'Analizando...' : 'Obtener Recomendaciones'}
          </button>
          {status.error && <p className="error-msg">{status.error}</p>}
        </form>

        {/* Resultados */}
        <section className="vehicle-advisor__results">
          {status.summary && <p className="summary-text">{status.summary}</p>}
          
          <div className="recommended-grid">
            {recommendedVehicles.map((item) => (
              <div key={item.id} className="recommendation-item">
                <div className="reason-badge">¿Por qué este?</div>
                <p className="reason-text">{item.reason}</p>
                <VehicleCard
                  vehicle={item.vehicle}
                  onClick={() => setSelectedVehicleId(item.id)}
                  onReserve={() => handleReserve(item.vehicle)}
                />
              </div>
            ))}
          </div>

          {!status.loading && recommendations.length > 0 && recommendedVehicles.length === 0 && (
            <p className="warning-msg">La IA sugirió vehículos, pero no coinciden exactamente con los de tu catálogo actual.</p>
          )}
        </section>
      </div>

      <VehicleDetailModal
        vehicleId={selectedVehicleId}
        onClose={() => setSelectedVehicleId(null)}
        onReserve={() => {
          const v = vehicles.find(veh => (veh.vehicleId ?? veh.id) === selectedVehicleId);
          handleReserve(v);
        }}
      />
    </div>
  );
}

export default VehicleAdvisor;