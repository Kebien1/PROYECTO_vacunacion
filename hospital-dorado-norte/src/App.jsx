import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth.jsx'
import Login from './pages/Login.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Campanas from './pages/Campanas.jsx'
import Vacunaciones from './pages/Vacunaciones.jsx'
import VacunasStock from './pages/VacunasStock.jsx'
import Alertas from './pages/Alertas.jsx'
import Cobertura from './pages/Cobertura.jsx'
import Reportes from './pages/Reportes.jsx'
import Jornadas from './pages/Jornadas.jsx'
import Usuarios from './pages/Usuarios.jsx'

function RequireAuth({ children }) {
  const { sesion } = useAuth()
  return sesion ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { sesion } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={sesion ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/campanas" element={<Campanas />} />
        <Route path="/vacunaciones" element={<Vacunaciones />} />
        <Route path="/stock" element={<VacunasStock />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/cobertura" element={<Cobertura />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/jornadas" element={<Jornadas />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Route>
      <Route path="*" element={<Navigate to={sesion ? '/' : '/login'} replace />} />
    </Routes>
  )
}
