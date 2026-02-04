import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVehicleRecommendations } from '../../api/services/GeminiService';
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

  const vehiclesCount = useMemo(() => vehicles.length, [vehicles]);

  useEffect(() => {
    const storedVehicles = sessionStorage.getItem('ai_advisor_vehicles');
    if (!storedVehicles) {
      return;
    }

    try {
      const parsed = JSON.parse(storedVehicles);
      if (Array.isArray(parsed)) {
        setVehicles(parsed);
      }
    } catch {
      setVehicles([]);
    }
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', summary: '' });
    setRecommendations([]);

    try {
      if (!vehicles.length) {
        throw new Error('No hay vehículos cargados desde el catálogo.');
      }

      const result = await getVehicleRecommendations({
        vehicles,
        tripDetails: form,
      });

      setRecommendations(result.recommendations ?? []);
      setStatus({ loading: false, error: '', summary: result.summary ?? '' });
    } catch (error) {
      setStatus({ loading: false, error: error.message, summary: '' });
    }
  };

  return (
    <div className="vehicle-advisor">
      <header className="vehicle-advisor__header">
        <div>
          <p className="vehicle-advisor__eyebrow">Asistente IA</p>
          <h1>Recomendador de vehículos</h1>
          <p className="vehicle-advisor__subtitle">
            Analiza tu viaje y recibe 3 recomendaciones basadas en los vehículos del catálogo.
          </p>
        </div>
        <div className="vehicle-advisor__badge">
          <span className="vehicle-advisor__label">Vehículos cargados</span>
          <strong>{vehiclesCount}</strong>
        </div>
      </header>

      <section className="vehicle-advisor__panel">
        <div className="vehicle-advisor__column">
          <h2>Vehículos disponibles</h2>
          <p className="vehicle-advisor__helper">
            El listado se carga automáticamente desde el catálogo para que la IA pueda evaluarlo.
          </p>
          {!vehicles.length ? (
            <div className="vehicle-advisor__empty-card">
              <p>No hay vehículos cargados todavía.</p>
              <button
                type="button"
                className="vehicle-advisor__secondary"
                onClick={() => navigate(ROUTES.CATALOG)}
              >
                Ir al catálogo
              </button>
            </div>
          ) : (
            <div className="vehicle-advisor__list">
              <p>
                Se cargaron <strong>{vehiclesCount}</strong> vehículos desde el catálogo.
              </p>
              <p className="vehicle-advisor__helper">
                Si actualizas los filtros del catálogo, vuelve aquí para ver nuevas recomendaciones.
              </p>
            </div>
          )}
        </div>

        <form className="vehicle-advisor__column" onSubmit={handleSubmit}>
          <h2>Detalles del viaje</h2>
          <label>
            ¿A dónde vas?
            <input
              name="destination"
              value={form.destination}
              onChange={handleFormChange}
              placeholder="Ej: Ruta a la montaña"
              required
            />
          </label>
          <label>
            ¿Con quién viajas?
            <input
              name="companions"
              value={form.companions}
              onChange={handleFormChange}
              placeholder="Ej: Familia, amigos, trabajo"
              required
            />
          </label>
          <label>
            Cantidad de personas
            <input
              name="peopleCount"
              value={form.peopleCount}
              onChange={handleFormChange}
              placeholder="Ej: 4"
              required
            />
          </label>
          <label>
            Tiempo estimado del viaje
            <input
              name="duration"
              value={form.duration}
              onChange={handleFormChange}
              placeholder="Ej: 3 días"
              required
            />
          </label>
          <label>
            Comentarios adicionales
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleFormChange}
              placeholder="Ej: Carretera con pendientes"
              rows={4}
            />
          </label>
          <button type="submit" disabled={status.loading || vehicles.length === 0}>
            {status.loading ? 'Consultando IA...' : 'Obtener recomendaciones'}
          </button>
          {status.error && <p className="vehicle-advisor__error">{status.error}</p>}
        </form>
      </section>

      <section className="vehicle-advisor__results">
        <h2>Resultados</h2>
        {status.summary && <p className="vehicle-advisor__summary">{status.summary}</p>}
        {recommendations.length === 0 && !status.loading ? (
          <p className="vehicle-advisor__empty">Sin recomendaciones todavía.</p>
        ) : (
          <div className="vehicle-advisor__cards">
            {recommendations.map((item, index) => (
              <article key={`${item.id || item.name}-${index}`} className="vehicle-advisor__card">
                <h3>{item.name || item.id || `Recomendación ${index + 1}`}</h3>
                {item.id && <p className="vehicle-advisor__meta">ID: {item.id}</p>}
                <p>{item.reason}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default VehicleAdvisor;
