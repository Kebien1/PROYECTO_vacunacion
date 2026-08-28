import { useState, useEffect } from 'react'

export default function Cobertura() {
  const [vacunados, setVacunados] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5119/api/vacunaciones')
      .then(res => res.json())
      .then(data => {
        setVacunados(data.length)
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ padding: 20 }}>Cargando datos de cobertura...</div>

  const metaTotal = 5000 // Meta global por defecto (DB no almacena metas)
  const cobertura = Math.min(100, Math.round((vacunados / metaTotal) * 100))
  const pendiente = Math.max(0, metaTotal - vacunados)

  const filas = [
    { grupo: 'General', objetivo: metaTotal, vac: vacunados, pct: cobertura, pend: pendiente }
  ]

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
