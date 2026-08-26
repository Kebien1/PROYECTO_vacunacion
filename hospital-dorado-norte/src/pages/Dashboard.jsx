import { campanaActiva, poblacionObjetivo, vacunaciones, calcularAlertas } from '../data/mock.js'

export default function Dashboard() {
  const meta = campanaActiva.meta
  const vacunados = vacunaciones.length * 400
  const cobertura = Math.min(100, Math.round((vacunados / meta) * 100))
  const alertas = calcularAlertas()

  const kpis = [
    { valor: meta.toLocaleString(), label: 'Meta de población objetivo' },
    { valor: vacunados.toLocaleString(), label: 'Personas vacunadas (est.)' },
    { valor: cobertura + '%', label: 'Cobertura alcanzada' },
    { valor: alertas.length, label: 'Alertas activas' }
  ]

  const porGrupo = poblacionObjetivo.map((p) => ({
    ...p,
    vac: Math.round((p.objetivo * cobertura) / 100)
  }))

  return (
    <>
      <div className="grid grid-4">
        {kpis.map((k) => (
          <div className="kpi" key={k.label}>
            <div className="valor">{k.valor}</div>
            <div className="label">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Campaña activa: {campanaActiva.nombre}</h2>
        <p><b>Periodo:</b> {campanaActiva.periodo} · <b>Estado:</b> {campanaActiva.estado} · <b>Vacuna:</b> {campanaActiva.vacunaPrincipal}</p>
        <div className="bar"><span style={{ width: cobertura + '%' }} /></div>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Cobertura: {cobertura}% de la meta</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>Avance por grupo prioritario</h2>
          {porGrupo.map((g) => (
            <div key={g.grupo} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span>{g.grupo}</span><span>{g.vac} / {g.objetivo}</span>
              </div>
              <div className="bar"><span style={{ width: Math.min(100, (g.vac / g.objetivo) * 100) + '%' }} /></div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2>Alertas recientes</h2>
          {alertas.length === 0 && <div className="alert alert-ok">Sin alertas críticas.</div>}
          {alertas.map((a) => (
            <div key={a.codigo} className="alert" style={{ background: a.tipo.includes('Vencimiento') ? '#fef2f2' : '#fffbeb', borderColor: a.tipo.includes('Vencimiento') ? '#fecaca' : '#fde68a', color: a.tipo.includes('Vencimiento') ? '#b91c1c' : '#92400e' }}>
              <b>{a.codigo}</b> ({a.vacuna}) — {a.tipo} · stock: {a.cantidad} · vence: {a.vencimiento}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
