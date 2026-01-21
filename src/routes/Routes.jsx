import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Catalog from '../pages/public/Catalog';
import SearchVehicles from '../pages/public/SearchVehicles';
import ReactContextGuide from '../pages/public/ReactContextGuide';
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import Dashboard from '../pages/private/Dashboard';
import Profile from '../pages/private/Profile';
import EmployeeList from '../pages/private/employee/EmployeeList';
import ClientList from '../pages/private/employee/ClientList';
import VehicleList from '../pages/private/employee/VehicleList';
import ReservationsList from '../pages/private/employee/ReservationsList';
import RentalsList from '../pages/private/employee/RentalsList';
import MyReservations from '../pages/private/client/MyReservations';
import MyRentals from '../pages/private/client/MyRentals';
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
      <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      <Route path={ROUTES.PROFILE} element={<Profile />} />

      {/* Private Routes Employees */}
      <Route path={ROUTES.EMPLOYEE_LIST} element={<EmployeeList />} />
      <Route path={ROUTES.CLIENT_LIST} element={<ClientList />} />
      <Route path={ROUTES.VEHICLE_LIST} element={<VehicleList />} />
      <Route path={ROUTES.RESERVATIONS_LIST} element={<ReservationsList />} />
      <Route path={ROUTES.RENTALS_LIST} element={<RentalsList />} />

      {/* Private Routes Clients */}
      <Route path={ROUTES.MY_RESERVATIONS} element={<MyReservations />} />
      <Route path={ROUTES.MY_RENTALS} element={<MyRentals />} />

      
      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

export default AppRoutes;
