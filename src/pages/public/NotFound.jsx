import Button from '../components/common/Button';
import { MESSAGES, ROUTES, BUTTON_VARIANTS } from '../constants';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">🚗</div>
        <h1 className="not-found-title">404 - Página No Encontrada</h1>
        <p className="not-found-description">
          Parece que no encontramos lo que buscas. El vehículo o página que solicitaste no existe.
        </p>
        <div className="not-found-actions">
          <Button 
            variant={BUTTON_VARIANTS.PRIMARY} 
            size="large"
            onClick={() => window.location.href = ROUTES.HOME}
          >
            ← Volver al Inicio
          </Button>
          <Button 
            variant={BUTTON_VARIANTS.SECONDARY} 
            size="large"
            onClick={() => window.location.href = ROUTES.CATALOG}
          >
            🔍 Ver Catálogo
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;