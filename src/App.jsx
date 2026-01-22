import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/Routes';
import useLocale from './hooks/useLocale';

function App() {
  useLocale();

  return (
    <BrowserRouter basename="/rentexpress-react">
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
