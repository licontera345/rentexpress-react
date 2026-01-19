import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import Catalog from './pages/public/Catalog'
import SearchVehicles from './pages/public/SearchVehicles'
import Dashboard from './pages/private/Dashboard'
import MyReservations from './pages/private/MyReservations'
import ReservationDetails from './pages/private/ReservationDetails'
import UserProfile from './pages/private/UserProfile'
import ManageVehicles from './pages/private/ManageVehicles'
import AddVehicle from './pages/private/AddVehicle'
import EditVehicle from './pages/private/EditVehicle'
import ProtectedRoute from './components/common/ProtectedRoute'
import { ROUTES, LOGIN_TYPES } from './constants'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.CATALOG} element={<Catalog />} />
        <Route path={ROUTES.SEARCH_VEHICLES} element={<SearchVehicles />} />

        {/* Private Routes */}
        <Route 
          path={ROUTES.DASHBOARD} 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.MY_RESERVATIONS} 
          element={
            <ProtectedRoute>
              <MyReservations />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.RESERVATION_DETAILS} 
          element={
            <ProtectedRoute>
              <ReservationDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.PROFILE} 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.MANAGE_VEHICLES} 
          element={
            <ProtectedRoute requiredRole={LOGIN_TYPES.EMPLOYEE}>
              <ManageVehicles />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.ADD_VEHICLE} 
          element={
            <ProtectedRoute requiredRole={LOGIN_TYPES.EMPLOYEE}>
              <AddVehicle />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.EDIT_VEHICLE} 
          element={
            <ProtectedRoute requiredRole={LOGIN_TYPES.EMPLOYEE}>
              <EditVehicle />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter> 
  )
}

export default App;
