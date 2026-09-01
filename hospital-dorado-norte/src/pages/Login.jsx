import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'

function EcgBackground() {
  const repeats = Array.from({ length: 30 }); // Sufficient repeats for ultra-wide screens

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.25, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`
        @keyframes slide-ecg-1 { from { transform: translateX(0); } to { transform: translateX(-250px); } }
        @keyframes slide-ecg-2 { from { transform: translateX(0); } to { transform: translateX(-250px); } }
        @keyframes slide-pleth { from { transform: translateX(0); } to { transform: translateX(-150px); } }
        @keyframes slide-resp { from { transform: translateX(0); } to { transform: translateX(-300px); } }

        .anim-ecg-1 { animation: slide-ecg-1 1.8s linear infinite; filter: drop-shadow(0 0 4px rgba(14, 116, 144, 0.8)); }
        .anim-ecg-2 { animation: slide-ecg-2 1.85s linear infinite; filter: drop-shadow(0 0 4px rgba(14, 116, 144, 0.8)); }
        .anim-pleth { animation: slide-pleth 1.2s linear infinite; filter: drop-shadow(0 0 4px rgba(14, 165, 233, 0.8)); }
        .anim-resp { animation: slide-resp 4s linear infinite; filter: drop-shadow(0 0 4px rgba(2, 132, 199, 0.8)); }

        @media (prefers-reduced-motion: reduce) {
          .anim-ecg-1, .anim-ecg-2, .anim-pleth, .anim-resp {
            animation: none;
          }
        }
      `}</style>
      <svg width="100%" height="100%">
        <defs>
          {/* Patrón de cuadrícula tipo monitor médico */}
          <pattern id="medical-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0e7490" strokeWidth="0.5" strokeOpacity="0.3" />
          </pattern>
          {/* Formas de ondas realistas */}
          <g id="ecg-1-path">
            {/* Onda P, Complejo QRS, Onda T */}
            <path d="M 0 50 L 120 50 Q 130 35 140 50 L 155 50 L 162 65 L 172 5 L 182 85 L 188 50 L 200 50 Q 215 30 230 50 L 250 50" fill="none" stroke="#0e7490" strokeWidth="2.5" strokeLinejoin="round" />
          </g>
          <g id="ecg-2-path">
            {/* Variación ligera para la segunda derivación */}
            <path d="M 0 50 L 120 50 Q 130 42 140 50 L 155 50 L 162 60 L 172 15 L 182 75 L 188 50 L 200 50 Q 215 35 230 50 L 250 50" fill="none" stroke="#0e7490" strokeWidth="2.5" strokeLinejoin="round" />
          </g>
          <g id="pleth-path">
            {/* Curva SpO2 con muesca dicrótica */}
            <path d="M 0 80 C 10 80, 15 15, 25 15 C 35 15, 45 40, 50 45 C 55 40, 60 40, 65 45 C 80 55, 90 80, 110 80 L 150 80" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinejoin="round" />
          </g>
          <g id="resp-path">
            {/* Curva de respiración (capnografía) */}
            <path d="M 0 70 C 40 70 60 30 100 30 C 160 30 200 70 260 70 L 300 70" fill="none" stroke="#0284c7" strokeWidth="3" strokeLinejoin="round" />
          </g>
        </defs>

        <rect width="100%" height="100%" fill="url(#medical-grid)" />

        {/* Labels y Contenedores Animados */}
        <text x="2%" y="10%" fill="#0e7490" fontSize="12" fontWeight="bold" fontFamily="monospace">ECG1: I   x1</text>
        <svg y="12%" width="100%" height="100" overflow="visible">
          <g className="anim-ecg-1">
            {repeats.map((_, i) => <use key={`ecg1-${i}`} href="#ecg-1-path" x={i * 250} />)}
          </g>
        </svg>

        <text x="2%" y="30%" fill="#0e7490" fontSize="12" fontWeight="bold" fontFamily="monospace">ECG2: II  x1</text>
        <svg y="32%" width="100%" height="100" overflow="visible">
          <g className="anim-ecg-2">
            {repeats.map((_, i) => <use key={`ecg2-${i}`} href="#ecg-2-path" x={i * 250} />)}
          </g>
        </svg>

        <text x="2%" y="53%" fill="#0ea5e9" fontSize="12" fontWeight="bold" fontFamily="monospace">PLETH</text>
        <svg y="55%" width="100%" height="100" overflow="visible">
          <g className="anim-pleth">
            {repeats.map((_, i) => <use key={`pleth-${i}`} href="#pleth-path" x={i * 150} />)}
          </g>
        </svg>

        <text x="2%" y="76%" fill="#0284c7" fontSize="12" fontWeight="bold" fontFamily="monospace">RESP</text>
        <svg y="78%" width="100%" height="100" overflow="visible">
          <g className="anim-resp">
            {repeats.map((_, i) => <use key={`resp-${i}`} href="#resp-path" x={i * 300} />)}
          </g>
        </svg>
      </svg>
    </div>
  )
}

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
    <div className="login-bg" style={{ position: 'relative' }}>
      <EcgBackground />
      <div className="login-wrapper" style={{ position: 'relative', zIndex: 1 }}>
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
