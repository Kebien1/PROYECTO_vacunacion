import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => {
    const saved = localStorage.getItem('dn_sesion')
    return saved ? JSON.parse(saved) : null
  })

  async function login(usuario, password) {
    try {
      const res = await fetch('http://localhost:5119/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Usuario: usuario, Password: password })
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        return { ok: false, error: errorData.mensaje || 'Error al iniciar sesión' }
      }

      const user = await res.json()
      localStorage.setItem('dn_sesion', JSON.stringify(user))
      setSesion(user)
      return { ok: true }
    } catch (error) {
      console.error("Login error", error)
      return { ok: false, error: 'No se pudo conectar con el servidor' }
    }
  }

  function logout() {
    localStorage.removeItem('dn_sesion')
    setSesion(null)
  }

  return (
    <AuthContext.Provider value={{ sesion, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
