import { useMemo, useState } from 'react';
import { getVehicleRecommendations } from '../../api/services/GeminiService';
import '../../styles/vehicleAdvisor.css';

const DEFAULT_FORM = {
  destination: '',
  companions: '',
  duration: '',
  peopleCount: '',
  notes: '',
};

const parseVehicles = (raw) => {
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('El JSON debe ser una lista de vehículos.');
  }
  return parsed;
};

function VehicleAdvisor() {
  const [vehiclesJson, setVehiclesJson] = useState('');
  const [vehicles, setVehicles] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [status, setStatus] = useState({ loading: false, error: '', summary: '' });
  const [recommendations, setRecommendations] = useState([]);

  const vehiclesCount = useMemo(() => (vehicles ? vehicles.length : 0), [vehicles]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehiclesSave = () => {
    setStatus({ loading: false, error: '', summary: '' });
    setRecommendations([]);

    try {
      const parsed = parseVehicles(vehiclesJson.trim());
      setVehicles(parsed);
    } catch (error) {
      setStatus({ loading: false, error: error.message, summary: '' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', summary: '' });
    setRecommendations([]);

    try {
      let vehiclesData = vehicles;
      if (!vehiclesData) {
        vehiclesData = parseVehicles(vehiclesJson.trim());
        setVehicles(vehiclesData);
      }

      const result = await getVehicleRecommendations({
        vehicles: vehiclesData,
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
            Envía el JSON de vehículos una sola vez y responde las preguntas para recibir 3 recomendaciones.
          </p>
        </div>
        <div className="vehicle-advisor__badge">
          <span className="vehicle-advisor__label">Vehículos cargados</span>
          <strong>{vehiclesCount}</strong>
        </div>
      </header>

      <section className="vehicle-advisor__panel">
        <div className="vehicle-advisor__column">
          <h2>JSON de vehículos</h2>
          <p className="vehicle-advisor__helper">
            Pega el listado completo en formato JSON (array) para que la IA pueda evaluarlos.
          </p>
          <textarea
            className="vehicle-advisor__textarea"
            value={vehiclesJson}
            onChange={(event) => setVehiclesJson(event.target.value)}
            placeholder='[
  {"id": "SUV-01", "name": "SUV Familiar", "capacity": 5, "type": "SUV"}
]'
            rows={10}
          />
          <button type="button" onClick={handleVehiclesSave} className="vehicle-advisor__secondary">
            Guardar JSON
          </button>
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
          <button type="submit" disabled={status.loading}>
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
