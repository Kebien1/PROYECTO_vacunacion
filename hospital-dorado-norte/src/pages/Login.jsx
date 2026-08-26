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
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">🏥</div>
        <h1>Centro de Salud Dorado Norte</h1>
        <p className="login-sub">Sistema de Apoyo a la Toma de Decisiones · Campaña SR / SRP</p>

        <label>Usuario</label>
        <input value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="admin" autoFocus />

        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

        {error && <div className="login-error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading && <span className="spinner" />}
          {loading ? 'Ingresando…' : 'Iniciar sesión'}
        </button>

        <div className="login-hint">Prueba: <b>admin</b> / <b>admin123</b></div>
      </form>
    </div>
  )
}
