import { useMemo } from 'react'
import { calcularAlertas } from '../data/mock.js'

export default function Alertas() {
  const alertas = useMemo(() => calcularAlertas(), [])

  return (
    <div className="card">
      <h2>Alertas de stock y vencimiento (RF05)</h2>
      {alertas.length === 0 && <div className="alert alert-ok">No hay alertas activas en este momento.</div>}
      {alertas.map((a) => {
        const danger = a.tipo.includes('Vencimiento')
        return (
          <div key={a.codigo} className="alert" style={{ background: danger ? '#fef2f2' : '#fffbeb', borderColor: danger ? '#fecaca' : '#fde68a', color: danger ? '#b91c1c' : '#92400e' }}>
            <b>{a.codigo}</b> — {a.vacuna} — {a.tipo}<br />
            <small>Stock: {a.cantidad} (mín {a.minimo}) · Vence: {a.vencimiento} ({a.dias} días)</small>
          </div>
        )
      })}
    </div>
  )
}
