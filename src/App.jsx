import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/Routes';
import useLocale from './hooks/useLocale';

// Componente App que define la interfaz y organiza la lógica de esta vista.

function App() {
  useLocale();

  return (
    <BrowserRouter basename="/">
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
