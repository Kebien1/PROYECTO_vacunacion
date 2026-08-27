import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../auth.jsx'

const menuPrincipal = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    )
  }
]

const menuGestion = [
  {
    to: '/campanas',
    label: 'Campañas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </svg>
    )
  },
  {
    to: '/vacunaciones',
    label: 'Vacunaciones',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 2 4 4" />
        <path d="m17 7 3-3" />
        <path d="M19 9 8.7 19.3c-.4.4-1 .6-1.6.6H3v-4.1c0-.6.2-1.2.6-1.6L14 3.9" />
        <path d="m9 9 6 6" />
      </svg>
    )
  },
  {
    to: '/stock',
    label: 'Vacunas y Stock',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    )
  },
  {
    to: '/jornadas',
    label: 'Jornadas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )
  }
]

const menuAnalisis = [
  {
    to: '/alertas',
    label: 'Alertas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    )
  },
  {
    to: '/cobertura',
    label: 'Cobertura',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    )
  },
  {
    to: '/reportes',
    label: 'Reportes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  }
]

const menuSistema = [
  {
    to: '/usuarios',
    label: 'Usuarios',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }
]

const todosLosItems = [...menuPrincipal, ...menuGestion, ...menuAnalisis, ...menuSistema]

export default function Layout() {
  const { sesion, logout } = useAuth()
  const loc = useLocation()
  const titulo = todosLosItems.find((m) => m.to === loc.pathname)?.label || 'Dorado Norte'

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand-container">
          <div className="brand">
            <img src="/LOGO.png" alt="Logo Dorado Norte" className="sidebar-brand-logo" />
            <div className="brand-text">
              <span className="brand-title">Dorado Norte</span>
              <span className="brand-sub">Salud Pública</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            {menuPrincipal.map((m) => (
              <NavLink key={m.to} to={m.to} end={m.to === '/'} className="nav-item">
                <span className="ico">{m.icon}</span> {m.label}
              </NavLink>
            ))}
          </div>

          <div className="nav-separator" />
          <div className="nav-section-header">GESTIÓN</div>
          <div className="nav-section">
            {menuGestion.map((m) => (
              <NavLink key={m.to} to={m.to} className="nav-item">
                <span className="ico">{m.icon}</span> {m.label}
              </NavLink>
            ))}
          </div>

          <div className="nav-separator" />
          <div className="nav-section-header">ANÁLISIS</div>
          <div className="nav-section">
            {menuAnalisis.map((m) => (
              <NavLink key={m.to} to={m.to} className="nav-item">
                <span className="ico">{m.icon}</span> {m.label}
              </NavLink>
            ))}
          </div>

          <div className="nav-separator" />
          <div className="nav-section-header">SISTEMA</div>
          <div className="nav-section">
            {menuSistema.map((m) => (
              <NavLink key={m.to} to={m.to} className="nav-item">
                <span className="ico">{m.icon}</span> {m.label}
              </NavLink>
            ))}
          </div>
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
