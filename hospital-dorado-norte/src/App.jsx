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

function RequireAuth({ children, allowedRoles }) {
  const { sesion } = useAuth()
  if (!sesion) return <Navigate to="/login" replace />

  if (allowedRoles) {
    const rol = (sesion.rol || '').toLowerCase()
    const isAdmin = rol.includes('administrador')
    const isEncargado = rol.includes('encargado')
    const isVacunador = rol.includes('responsable') || rol.includes('personal') || rol.includes('brigada')

    let hasAccess = false
    if (allowedRoles.includes('admin') && isAdmin) hasAccess = true
    if (allowedRoles.includes('encargado') && isEncargado) hasAccess = true
    if (allowedRoles.includes('vacunador') && isVacunador) hasAccess = true

    if (!hasAccess && !isAdmin) return <Navigate to="/" replace />
  }

  return children
}

export default function App() {
  const { sesion } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={sesion ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/" element={<Dashboard />} />
        
        {/* Gestión */}
        <Route path="/campanas" element={<RequireAuth allowedRoles={['admin', 'encargado']}><Campanas /></RequireAuth>} />
        <Route path="/vacunaciones" element={<RequireAuth allowedRoles={['admin', 'encargado', 'vacunador']}><Vacunaciones /></RequireAuth>} />
        <Route path="/stock" element={<RequireAuth allowedRoles={['admin', 'encargado', 'vacunador']}><VacunasStock /></RequireAuth>} />
        <Route path="/jornadas" element={<RequireAuth allowedRoles={['admin', 'encargado', 'vacunador']}><Jornadas /></RequireAuth>} />
        
        {/* Análisis */}
        <Route path="/alertas" element={<RequireAuth allowedRoles={['admin', 'encargado']}><Alertas /></RequireAuth>} />
        <Route path="/cobertura" element={<RequireAuth allowedRoles={['admin', 'encargado']}><Cobertura /></RequireAuth>} />
        <Route path="/reportes" element={<RequireAuth allowedRoles={['admin', 'encargado']}><Reportes /></RequireAuth>} />
        
        {/* Sistema */}
        <Route path="/usuarios" element={<RequireAuth allowedRoles={['admin']}><Usuarios /></RequireAuth>} />
      </Route>
      <Route path="*" element={<Navigate to={sesion ? '/' : '/login'} replace />} />
    </Routes>
  )
}
