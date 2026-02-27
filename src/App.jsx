import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/index.js';
import AppRoutes from './routes/Routes.jsx';

function App() {
  return (
    <BrowserRouter basename="/">
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
