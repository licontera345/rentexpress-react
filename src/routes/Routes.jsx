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

     
      {/* Private Routes General */}
      <Route path={ROUTES.DASHBOARD} element={<div>Dashboard</div>} />
      <Route path={ROUTES.PROFILE} element={<div>Profile</div>} />

      {/* Private Routes Employees */}
      <Route path={ROUTES.EMPLOYEE_LIST} element={<div>Employee List</div>} />
      <Route path={ROUTES.CLIENT_LIST} element={<div>Client List</div>} />
      <Route path={ROUTES.VEHICLE_LIST} element={<div>Vehicle List</div>} />
      <Route path={ROUTES.RESERVATIONS_LIST} element={<div>Reservations List</div>} />
      <Route path={ROUTES.RENTALS_LIST} element={<div>Rentals List</div>} />

      {/* Private Routes Clients */}
      <Route path={ROUTES.MY_RESERVATIONS} element={<div>My Reservations</div>} />
      <Route path={ROUTES.MY_RENTALS} element={<div>My Rentals</div>} />

      
      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

export default AppRoutes;
