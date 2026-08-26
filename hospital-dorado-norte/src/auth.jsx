import { createContext, useContext, useState } from 'react'

const USUARIOS = [
  { usuario: 'admin', password: 'admin123', rol: 'Administrador', nombre: 'Kevin Nuñez' },
  { usuario: 'vacunador', password: 'vac123', rol: 'Personal de Vacunación', nombre: 'Ricardo Flores' },
  { usuario: 'responsable', password: 'resp123', rol: 'Responsable de Vacunación', nombre: 'Andres Garcia' }
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => {
    const saved = localStorage.getItem('dn_sesion')
    return saved ? JSON.parse(saved) : null
  })

  function login(usuario, password) {
    const found = USUARIOS.find((u) => u.usuario === usuario && u.password === password)
    if (!found) return { ok: false, error: 'Credenciales incorrectas' }
    const user = { usuario: found.usuario, rol: found.rol, nombre: found.nombre }
    localStorage.setItem('dn_sesion', JSON.stringify(user))
    setSesion(user)
    return { ok: true }
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
