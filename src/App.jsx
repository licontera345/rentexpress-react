import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/public/Home'
import Login from './pages/public/Login'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/search" element={<SearchVehicles />} />

        {/* Private Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-reservations" 
          element={
            <ProtectedRoute>
              <MyReservations />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reservation/:reservationId" 
          element={
            <ProtectedRoute>
              <ReservationDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manage-vehicles" 
          element={
            <ProtectedRoute>
              <ManageVehicles />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-vehicle" 
          element={
            <ProtectedRoute>
              <AddVehicle />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-vehicle/:vehicleId" 
          element={
            <ProtectedRoute>
              <EditVehicle />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter> 
  )
}

export default App;
