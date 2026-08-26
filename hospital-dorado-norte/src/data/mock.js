// Datos de prueba (mock). Sin base de datos por ahora.
// Estructura alineada con el Diagrama de Clases del documento.

export const campanaActiva = {
  id: 1,
  nombre: 'Campaña Sarampión – Rubéola 2026',
  periodo: 'Marzo – Junio 2026',
  meta: 5200,
  vacunaPrincipal: 'SR / SRP',
  estado: 'Activa'
}

export const poblacionObjetivo = [
  { grupo: '6 meses – 4 años', objetivo: 1800 },
  { grupo: '5 – 9 años', objetivo: 1700 },
  { grupo: '10 – 14 años', objetivo: 1100 },
  { grupo: '15 – 19 años', objetivo: 600 }
]

export const vacunas = [
  { id: 1, nombre: 'SR (Sarampión – Rubéola)', tipo: 'SR' },
  { id: 2, nombre: 'SRP (Sarampión – Rubéola – Parotiditis)', tipo: 'SRP' }
]

export const lotes = [
  { id: 1, vacuna: 'SR', codigo: 'LOTE-SR-001', cantidad: 1200, vencimiento: '2026-08-15', minimo: 300 },
  { id: 2, vacuna: 'SRP', codigo: 'LOTE-SRP-007', cantidad: 80, vencimiento: '2026-09-30', minimo: 200 },
  { id: 3, vacuna: 'SR', codigo: 'LOTE-SR-005', cantidad: 2500, vencimiento: '2025-12-01', minimo: 300 }
]

export const vacunaciones = [
  { id: 1, persona: 'Ana López', ci: '9876543', grupo: '5 – 9 años', vacuna: 'SR', dosis: '1ra', lote: 'LOTE-SR-001', fecha: '2026-03-12' },
  { id: 2, persona: 'Luis Mamani', ci: '8765432', grupo: '10 – 14 años', vacuna: 'SRP', dosis: '1ra', lote: 'LOTE-SRP-007', fecha: '2026-03-13' },
  { id: 3, persona: 'Sofía Rojas', ci: '7654321', grupo: '6 meses – 4 años', vacuna: 'SR', dosis: '1ra', lote: 'LOTE-SR-001', fecha: '2026-03-14' },
  { id: 4, persona: 'Diego Vargas', ci: '6543210', grupo: '15 – 19 años', vacuna: 'SR', dosis: '1ra', lote: 'LOTE-SR-001', fecha: '2026-03-15' },
  { id: 5, persona: 'María Quispe', ci: '5432109', grupo: '5 – 9 años', vacuna: 'SRP', dosis: '1ra', lote: 'LOTE-SRP-007', fecha: '2026-03-16' }
]

export const jornadas = [
  { id: 1, fecha: '2026-03-12', horario: '08:00 – 16:00', punto: 'UCSF Dorado Norte', responsable: 'Enf. M. Suarez' },
  { id: 2, fecha: '2026-03-20', horario: '09:00 – 14:00', punto: 'Unidad Educativa Central', responsable: 'Enf. J. Paredes' },
  { id: 3, fecha: '2026-03-28', horario: '08:00 – 17:00', punto: 'Plaza Dorado', responsable: 'Brigada Móvil' }
]

export const usuarios = [
  { id: 1, usuario: 'admin', nombre: 'Kevin Nuñez', rol: 'Administrador', estado: 'Activo' },
  { id: 2, usuario: 'vacunador', nombre: 'Ricardo Flores', rol: 'Personal de Vacunación', estado: 'Activo' },
  { id: 3, usuario: 'responsable', nombre: 'Andres Garcia', rol: 'Responsable de Vacunación', estado: 'Activo' }
]

export function calcularAlertas() {
  const hoy = new Date('2026-03-20')
  return lotes
    .map((l) => {
      const vence = new Date(l.vencimiento)
      const dias = Math.floor((vence - hoy) / 86400000)
      let tipo = null
      if (l.cantidad < l.minimo) tipo = 'Stock bajo'
      if (dias <= 60) tipo = tipo ? 'Stock bajo / Vencimiento' : 'Vencimiento próximo'
      return { ...l, dias, tipo }
    })
    .filter((l) => l.tipo)
}
