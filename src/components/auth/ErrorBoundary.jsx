import { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/index.js';
import Button from '../ui/Button.jsx';
import { BUTTON_VARIANTS } from '../../constants/index.js';

class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    this.props.navigate?.(ROUTES.HOME);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary-content">
            <h1 className="error-boundary-title">
              {this.props.title ?? 'Algo ha ido mal'}
            </h1>
            <p className="error-boundary-description">
              {this.props.description ?? 'Ha ocurrido un error inesperado.'}
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="error-boundary-details">{this.state.error.message}</pre>
            )}
            <div className="error-boundary-actions">
              <Button variant={BUTTON_VARIANTS.PRIMARY} onClick={this.handleRetry}>
                {this.props.retryLabel ?? 'Reintentar'}
              </Button>
              <Button variant={BUTTON_VARIANTS.SECONDARY} onClick={this.handleGoHome}>
                {this.props.homeLabel ?? 'Ir al inicio'}
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ErrorBoundary({ children, title, description, retryLabel, homeLabel }) {
  const navigate = useNavigate();
  return (
    <ErrorBoundaryClass
      navigate={navigate}
      title={title}
      description={description}
      retryLabel={retryLabel}
      homeLabel={homeLabel}
    >
      {children}
    </ErrorBoundaryClass>
  );
}

export default ErrorBoundary;
