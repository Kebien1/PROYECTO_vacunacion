import { useState, useEffect } from 'react'

export default function Alertas() {
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlertas() {
      try {
        const res = await fetch('http://localhost:5119/api/lotes')
        const data = await res.json()
        
        const alertasCalculadas = data.filter(l => 
          l.cantidadDisponible < 100 || (new Date(l.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24) < 30
        ).map(l => {
          const dias = Math.round((new Date(l.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24))
          return {
            codigo: `LOTE-${l.idLote}`,
            vacuna: l.vacuna?.nombre || 'Desconocida',
            tipo: l.cantidadDisponible < 100 ? 'Stock Bajo' : 'Próximo a Vencer',
            cantidad: l.cantidadDisponible,
            minimo: 100, // Hardcoded ya que DB no soporta minimo
            vencimiento: new Date(l.fechaVencimiento).toLocaleDateString(),
            dias: dias
          }
        })
        
        setAlertas(alertasCalculadas)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAlertas()
  }, [])

  if (loading) return <div style={{ padding: 20 }}>Cargando alertas...</div>

  return (
    <div className="card">
      <div className="section-head">
        <h2>Alertas de stock y vencimiento (RF05)</h2>
        <span className="section-badge">{alertas.length} alertas detectadas</span>
      </div>

      {alertas.length === 0 ? (
        <div className="alert alert-ok">No hay alertas activas en este momento.</div>
      ) : (
        <table className="tabla-alertas">
          <thead>
            <tr>
              <th>Severidad</th>
              <th>Lote</th>
              <th>Vacuna</th>
              <th>Motivo de Alerta</th>
              <th>Stock / Mínimo</th>
              <th>Vencimiento</th>
              <th>Tiempo</th>
            </tr>
          </thead>
          <tbody>
            {alertas.map((a) => {
              const danger = a.tipo.includes('Vencimiento') || a.dias <= 0
              const vencido = a.dias < 0

              return (
                <tr key={a.codigo}>
                  <td>
                    <span className={`pill ${danger ? 'pill-danger' : 'pill-warning'}`}>
                      {danger ? 'Crítico' : 'Atención'}
                    </span>
                  </td>
                  <td className="font-mono"><b>{a.codigo}</b></td>
                  <td><span className="tag-vacuna">{a.vacuna}</span></td>
                  <td className={danger ? 'text-danger font-semibold' : 'text-warning font-semibold'}>
                    {a.tipo}
                  </td>
                  <td>
                    <b>{a.cantidad}</b> <span className="text-muted">/ mín {a.minimo}</span>
                  </td>
                  <td>{a.vencimiento}</td>
                  <td>
                    <span className={`tag-tiempo ${vencido ? 'tiempo-vencido' : danger ? 'tiempo-urgente' : 'tiempo-normal'}`}>
                      {vencido ? `Vencido hace ${Math.abs(a.dias)}d` : `${a.dias} días`}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
