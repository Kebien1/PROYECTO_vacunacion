import { poblacionObjetivo, vacunaciones } from '../data/mock.js'

export default function Cobertura() {
  const metaTotal = poblacionObjetivo.reduce((s, p) => s + p.objetivo, 0)
  const vacunados = vacunaciones.length * 400
  const cobertura = Math.min(100, Math.round((vacunados / metaTotal) * 100))
  const pendiente = Math.max(0, metaTotal - vacunados)

  const filas = poblacionObjetivo.map((p) => {
    const vac = Math.min(p.objetivo, Math.round((vacunados * p.objetivo) / metaTotal))
    return { ...p, vac, pct: Math.round((vac / p.objetivo) * 100), pend: p.objetivo - vac }
  })

  return (
    <>
      <div className="card">
        <h2>Cobertura y población pendiente (RF07)</h2>
        <div className="grid grid-3" style={{ marginBottom: 14 }}>
          <div className="kpi"><div className="valor">{metaTotal.toLocaleString()}</div><div className="label">Meta total</div></div>
          <div className="kpi"><div className="valor">{vacunados.toLocaleString()}</div><div className="label">Vacunados (est.)</div></div>
          <div className="kpi"><div className="valor">{pendiente.toLocaleString()}</div><div className="label">Población pendiente</div></div>
        </div>
        <div className="bar"><span style={{ width: cobertura + '%' }} /></div>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Cobertura global: {cobertura}%</p>
      </div>

      <div className="card">
        <h2>Desglose por grupo</h2>
        <table>
          <thead><tr><th>Grupo</th><th>Objetivo</th><th>Vacunados</th><th>%</th><th>Pendiente</th><th></th></tr></thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.grupo}>
                <td>{f.grupo}</td><td>{f.objetivo}</td><td>{f.vac}</td><td>{f.pct}%</td>
                <td>{f.pend}</td>
                <td style={{ width: 160 }}><div className="bar"><span style={{ width: f.pct + '%' }} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
