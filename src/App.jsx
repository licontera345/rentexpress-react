import { BrowserRouter} from 'react-router-dom';
import useLocale from './hooks/core/useLocale';
import AppContent from './components/auth/AppContent';

function App() {
   useLocale();
  return (
     <BrowserRouter basename="/">
       <AppContent />
     </BrowserRouter>
  );
}

export default App;
