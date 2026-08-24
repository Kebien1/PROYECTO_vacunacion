const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5119/api";

const TOKEN_COOKIE = "dn_token";
const ROL_COOKIE = "dn_rol";
const NOMBRE_COOKIE = "dn_nombre";

export function setCookie(name, value, days = 1) {
  const exp = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax`;
}

export function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function clearCookies() {
  [TOKEN_COOKIE, ROL_COOKIE, NOMBRE_COOKIE].forEach((c) => {
    document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

export async function login(usuario, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    });
    if (!response.ok) return { ok: false, error: "Credenciales incorrectas" };
    const found = await response.json();
    setCookie(TOKEN_COOKIE, found.token);
    setCookie(ROL_COOKIE, found.rol);
    setCookie(NOMBRE_COOKIE, found.nombre);
    return { ok: true, user: found };
  } catch {
    return { ok: false, error: "No se pudo conectar con el backend" };
  }
}

export function getSesion() {
  const token = getCookie(TOKEN_COOKIE);
  if (!token) return null;
  return {
    usuario: token,
    rol: getCookie(ROL_COOKIE),
    nombre: getCookie(NOMBRE_COOKIE),
  };
}

export const HOSPITAL_URL = "http://localhost:5174";
