import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES, USER_ROLES } from '../constants/index.js';
import { ProtectedRoute } from '../components/index.js';

import Home from '../pages/public/Home.jsx';
import Login from '../pages/public/Login.jsx';
import Register from '../pages/public/Register.jsx';
import Catalog from '../pages/public/Catalog.jsx';
import PrivacyPolicy from '../pages/public/PrivacyPolicy.jsx';
import TermsOfService from '../pages/public/TermsOfService.jsx';
import Contact from '../pages/public/Contact.jsx';
import ForgotPassword from '../pages/public/ForgotPassword.jsx';
import ResetPassword from '../pages/public/ResetPassword.jsx';
import NotFound from '../pages/public/NotFound.jsx';

import Dashboard from '../pages/private/Dashboard.jsx';
import Profile from '../pages/private/Profile.jsx';
import EmployeeList from '../pages/private/employee/EmployeeList.jsx';
import ClientList from '../pages/private/employee/ClientList.jsx';
import VehicleList from '../pages/private/employee/VehicleList.jsx';
import ReservationsList from '../pages/private/employee/ReservationsList.jsx';
import RentalsList from '../pages/private/employee/RentalsList.jsx';
import PickupVerification from '../pages/private/employee/PickupVerification.jsx';
import MyReservations from '../pages/private/client/MyReservations.jsx';
import MyRentals from '../pages/private/client/MyRentals.jsx';
import ReservationCreate from '../pages/private/client/ReservationCreate.jsx';

export default function AppRoutes() {
  return (
    <Routes>
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

      <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path={ROUTES.PROFILE} element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      <Route path={ROUTES.EMPLOYEE_LIST} element={<ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}><EmployeeList /></ProtectedRoute>} />
      <Route path={ROUTES.CLIENT_LIST} element={<ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}><ClientList /></ProtectedRoute>} />
      <Route path={ROUTES.VEHICLE_LIST} element={<ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}><VehicleList /></ProtectedRoute>} />
      <Route path={ROUTES.RESERVATIONS_LIST} element={<ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}><ReservationsList /></ProtectedRoute>} />
      <Route path={ROUTES.RENTALS_LIST} element={<ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}><RentalsList /></ProtectedRoute>} />
      <Route path={ROUTES.PICKUP_VERIFICATION} element={<ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}><PickupVerification /></ProtectedRoute>} />

      <Route path={ROUTES.MY_RESERVATIONS} element={<ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}><MyReservations /></ProtectedRoute>} />
      <Route path={ROUTES.RESERVATION_CREATE} element={<ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}><ReservationCreate /></ProtectedRoute>} />
      <Route path={ROUTES.MY_RENTALS} element={<ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}><MyRentals /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
    </Routes>
  );
}
