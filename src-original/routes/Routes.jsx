import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Catalog from '../pages/public/Catalog';
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import TermsOfService from '../pages/public/TermsOfService';
import Contact from '../pages/public/Contact';
import ForgotPassword from '../pages/public/ForgotPassword';
import ResetPassword from '../pages/public/ResetPassword';
import NotFound from '../pages/public/NotFound';
import Dashboard from '../pages/private/Dashboard';
import Profile from '../pages/private/Profile';
import EmployeeList from '../pages/private/employee/EmployeeList';
import ClientList from '../pages/private/employee/ClientList';
import VehicleList from '../pages/private/employee/VehicleList';
import ReservationsList from '../pages/private/employee/ReservationsList';
import RentalsList from '../pages/private/employee/RentalsList';
import PickupVerification from '../pages/private/employee/PickupVerification';
import MyReservations from '../pages/private/client/MyReservations';
import MyRentals from '../pages/private/client/MyRentals';
import ReservationCreate from '../pages/private/client/ReservationCreate';
import { ROUTES, USER_ROLES } from '../constants';
import ProtectedRoute from '../components/auth/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.CATALOG} element={<Catalog />} />
      <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
      <Route path={ROUTES.TERMS} element={<TermsOfService />} />
      <Route path={ROUTES.CONTACT} element={<Contact />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />

      {/* Private Routes General */}
      <Route
        path={ROUTES.DASHBOARD}
        element={(
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      />
      <Route
        path={ROUTES.PROFILE}
        element={(
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )}
      />

      {/* Private Routes Employees */}
      <Route
        path={ROUTES.EMPLOYEE_LIST}
        element={(
          <ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}>
            <EmployeeList />
          </ProtectedRoute>
        )}
      />
      <Route
        path={ROUTES.CLIENT_LIST}
        element={(
          <ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}>
            <ClientList />
          </ProtectedRoute>
        )}
      />
      <Route
        path={ROUTES.VEHICLE_LIST}
        element={(
          <ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}>
            <VehicleList />
          </ProtectedRoute>
        )}
      />
      <Route
        path={ROUTES.RESERVATIONS_LIST}
        element={(
          <ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}>
            <ReservationsList />
          </ProtectedRoute>
        )}
      />
      <Route
        path={ROUTES.RENTALS_LIST}
        element={(
          <ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}>
            <RentalsList />
          </ProtectedRoute>
        )}
      />
      <Route
        path={ROUTES.PICKUP_VERIFICATION}
        element={(
          <ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}>
            <PickupVerification />
          </ProtectedRoute>
        )}
      />
      {/* Private Routes Clients */}
      <Route
        path={ROUTES.MY_RESERVATIONS}
        element={(
          <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
            <MyReservations />
          </ProtectedRoute>
        )}
      />
      <Route
        path={ROUTES.RESERVATION_CREATE}
        element={(
          <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
            <ReservationCreate />
          </ProtectedRoute>
        )}
      />
      <Route
        path={ROUTES.MY_RENTALS}
        element={(
          <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
            <MyRentals />
          </ProtectedRoute>
        )}
      />
      {/* Fallback: rutas no definidas muestran 404 */}
      <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
    </Routes>
  );
}

export default AppRoutes;
