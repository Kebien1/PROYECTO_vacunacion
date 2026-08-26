import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../auth.jsx'

const menu = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/campanas', label: 'Campañas', icon: '📋' },
  { to: '/vacunaciones', label: 'Vacunaciones', icon: '💉' },
  { to: '/stock', label: 'Vacunas y Stock', icon: '📦' },
  { to: '/alertas', label: 'Alertas', icon: '⚠️' },
  { to: '/cobertura', label: 'Cobertura', icon: '🎯' },
  { to: '/reportes', label: 'Reportes', icon: '📈' },
  { to: '/jornadas', label: 'Jornadas', icon: '🗓️' },
  { to: '/usuarios', label: 'Usuarios', icon: '👥' }
]

export default function Layout() {
  const { sesion, logout } = useAuth()
  const loc = useLocation()
  const titulo = menu.find((m) => m.to === loc.pathname)?.label || 'Dorado Norte'

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">🏥 Dorado Norte</div>
        <nav>
          {menu.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.to === '/'} className="nav-item">
              <span className="ico">{m.icon}</span> {m.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="title">{titulo}</div>
          <div className="user">
            <span className="badge">{sesion.rol}</span>
            <span className="name">{sesion.nombre}</span>
            <button className="logout" onClick={logout}>Salir</button>
          </div>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  )
}
