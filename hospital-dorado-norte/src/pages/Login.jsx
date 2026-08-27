import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [recuerdame, setRecuerdame] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = login(usuario.trim(), password)
    if (!res.ok) {
      setError(res.error)
      setLoading(false)
      return
    }
    navigate('/')
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

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={recuerdame}
                onChange={(e) => setRecuerdame(e.target.checked)}
              />
              <span>Recuérdame</span>
            </label>
            <a href="#olvide" onClick={(e) => e.preventDefault()} className="forgot-password">
              Olvidé mi contraseña
            </a>
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

          <div className="login-footer">
            <div className="footer-label">¿No tienes cuenta?</div>
            <div className="footer-links">
              <a href="#registro" onClick={(e) => e.preventDefault()} className="footer-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                Registrarse
              </a>
              <span className="dot">•</span>
              <a href="#ayuda" onClick={(e) => e.preventDefault()} className="footer-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Ayuda
              </a>
            </div>
            <div className="login-demo-credentials">
              Acceso demo: <b>admin</b> / <b>admin123</b>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
