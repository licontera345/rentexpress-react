import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/actions/Button';
import PublicLayout from '../../components/layout/public/PublicLayout';
import { MESSAGES, BUTTON_VARIANTS, ROUTES } from '../../constants';

// Página 404 con accesos rápidos a home y catálogo.
function NotFound() {
  const navigate = useNavigate();
  const handleGoHome = useCallback(() => navigate(ROUTES.HOME), [navigate]);
  const handleGoCatalog = useCallback(() => navigate(ROUTES.CATALOG), [navigate]);

  return (
    <PublicLayout>
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-title">{MESSAGES.NOT_FOUND_TITLE}</h1>
          <div className="not-found-icon" aria-hidden="true">🚗</div>
          <p className="not-found-description">{MESSAGES.NOT_FOUND_DESCRIPTION}</p>
          <div className="not-found-actions">
            <Button variant={BUTTON_VARIANTS.PRIMARY} size="large" onClick={handleGoHome}>
              {MESSAGES.NOT_FOUND_BACK_HOME}
            </Button>
            <Button variant={BUTTON_VARIANTS.SECONDARY} size="large" onClick={handleGoCatalog}>
              {MESSAGES.NOT_FOUND_VIEW_CATALOG}
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default NotFound;
