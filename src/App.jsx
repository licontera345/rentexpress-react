import { Routes, Route } from 'react-router-dom'
import PublicLayout from './components/Layout/public/PublicLayout.jsx'
import Home from './pages/public/Home'
import Login from './pages/public/Login'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route
        path="/private"
        element={
          <PrivateRoute>
            <div>Zona privada</div>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
