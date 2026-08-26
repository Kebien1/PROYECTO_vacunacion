// Auth mock: sin base de datos. Credenciales de prueba hardcodeadas.
// Nota: las cookies se comparten entre puertos del mismo dominio (localhost),
// por eso el micro-frontend Vue puede leer la sesion iniciada aqui.

export const USUARIOS_PRUEBA = [
  { usuario: 'admin', password: 'admin123', rol: 'Administrador', nombre: 'Kevin Nuñez' },
  { usuario: 'vacunador', password: 'vac123', rol: 'Personal de Vacunación', nombre: 'Ricardo Flores' },
  { usuario: 'responsable', password: 'resp123', rol: 'Responsable de Vacunación', nombre: 'Andres Garcia' }
]

const TOKEN_COOKIE = 'dn_token'
const ROL_COOKIE = 'dn_rol'
const NOMBRE_COOKIE = 'dn_nombre'

export function setCookie(name, value, days = 1) {
  const exp = new Date(Date.now() + days * 86400000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax`
}

export function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

export function clearCookies() {
  ;[TOKEN_COOKIE, ROL_COOKIE, NOMBRE_COOKIE].forEach((c) => {
    document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  })
}

export function login(usuario, password) {
  const found = USUARIOS_PRUEBA.find(
    (u) => u.usuario === usuario && u.password === password
  )
  if (!found) return { ok: false, error: 'Credenciales incorrectas' }
  setCookie(TOKEN_COOKIE, found.usuario)
  setCookie(ROL_COOKIE, found.rol)
  setCookie(NOMBRE_COOKIE, found.nombre)
  return { ok: true, user: found }
}

export function getSesion() {
  const token = getCookie(TOKEN_COOKIE)
  if (!token) return null
  return {
    usuario: token,
    rol: getCookie(ROL_COOKIE),
    nombre: getCookie(NOMBRE_COOKIE)
  }
}

export const HOSPITAL_URL = 'http://localhost:5174'
