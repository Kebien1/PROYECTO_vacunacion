// Auth en el micro-frontend Vue. Lee la cookie compartida por el login React.
const TOKEN_COOKIE = 'dn_token'
const ROL_COOKIE = 'dn_rol'
const NOMBRE_COOKIE = 'dn_nombre'
export const LOGIN_URL = 'http://localhost:4173'

export function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
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

export function logout() {
  ;[TOKEN_COOKIE, ROL_COOKIE, NOMBRE_COOKIE].forEach((c) => {
    document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  })
  window.location.href = LOGIN_URL
}

// Protege el acceso: si no hay sesion, vuelve al login.
export function requiereSesion() {
  if (!getSesion()) window.location.href = LOGIN_URL
}
