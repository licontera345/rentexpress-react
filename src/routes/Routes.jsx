import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Catalog from '../pages/public/Catalog';
import SearchVehicles from '../pages/public/SearchVehicles';
import ReactContextGuide from '../pages/public/ReactContextGuide';
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import { ROUTES } from '../constants';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.CATALOG} element={<Catalog />} />
      <Route path={ROUTES.SEARCH_VEHICLES} element={<SearchVehicles />} />
      <Route path={ROUTES.CONTEXT_GUIDE} element={<ReactContextGuide />} />
      <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

export default AppRoutes;
