import { campanaActiva, vacunaciones, lotes } from '../data/mock.js'

export default function Reportes() {
  const meta = campanaActiva.meta
  const vacunados = vacunaciones.length * 400
  const cobertura = Math.round((vacunados / meta) * 100)
  const stockTotal = lotes.reduce((s, l) => s + l.cantidad, 0)

  function exportar() {
    const lineas = [
      'Reporte Campaña Dorado Norte',
      'Campaña: ' + campanaActiva.nombre,
      'Meta: ' + meta,
      'Vacunados (est): ' + vacunados,
      'Cobertura: ' + cobertura + '%',
      'Stock total: ' + stockTotal
    ]
    const blob = new Blob([lineas.join('\n')], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'reporte-dorado-norte.txt'
    a.click()
  }

  return (
    <div className="card">
      <h2>Reportes (RF08)</h2>
      <div className="grid grid-2">
        <div className="kpi"><div className="valor">{vacunados.toLocaleString()}</div><div className="label">Dosis aplicadas (est.)</div></div>
        <div className="kpi"><div className="valor">{cobertura}%</div><div className="label">Cobertura</div></div>
        <div className="kpi"><div className="valor">{stockTotal.toLocaleString()}</div><div className="label">Vacunas en stock</div></div>
        <div className="kpi"><div className="valor">{lotes.length}</div><div className="label">Lotes registrados</div></div>
      </div>
      <button className="btn" style={{ marginTop: 14 }} onClick={exportar}>⬇ Exportar reporte (.txt)</button>
    </div>
  )
}
