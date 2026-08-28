import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await login(usuario.trim(), password)
    if (!res.ok) {
      setError(res.error)
      setLoading(false)
      return
    }
    navigate('/')
  }

  function rellenarFormulario(user, pass) {
    setUsuario(user)
    setPassword(pass)
    setError('')
  }

  return (
    <div className="login-bg">
      <div className="login-wrapper">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-header">
            <div className="login-logo-container">
              <img src="/LOGO.png" alt="Centro de Salud Dorado Norte" className="login-logo-img" />
            </div>
            <h1 className="login-title">Bienvenido</h1>
            <h2 className="login-subtitle">Acceso al Registro de Vacunación</h2>
            <p className="login-desc">Ingrese sus credenciales para acceder</p>
          </div>

          <div className="form-group">
            <label>Correo electrónico o Usuario</label>
            <div className="input-group">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="usuario@ejemplo.com"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-group">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="login-options" style={{ marginBottom: 15 }}>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading && <span className="spinner" />}
            <span>{loading ? 'Ingresando…' : 'Iniciar Sesión'}</span>
            {!loading && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            )}
          </button>

          <div className="login-divider" />
          
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>Acceso Rápido (Roles de Prueba):</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="pill pill-act" 
                style={{ cursor: 'pointer', border: 'none' }}
                onClick={() => rellenarFormulario('admin.sistema', 'admin123')}
              >
                Administrador
              </button>
              <button 
                type="button" 
                className="pill pill-act" 
                style={{ cursor: 'pointer', border: 'none', background: '#0ea5e9', color: '#fff' }}
                onClick={() => rellenarFormulario('encargado', 'encargado123')}
              >
                Encargado
              </button>
              <button 
                type="button" 
                className="pill pill-warning" 
                style={{ cursor: 'pointer', border: 'none' }}
                onClick={() => rellenarFormulario('vacunador', 'vacunador123')}
              >
                Vacunador
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}
