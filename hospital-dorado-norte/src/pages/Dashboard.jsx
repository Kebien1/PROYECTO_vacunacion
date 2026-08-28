import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [data, setData] = useState({ vacunaciones: [], campañas: [], lotes: [], loading: true })

  useEffect(() => {
    async function load() {
      try {
        const [resVac, resCam, resLot] = await Promise.all([
          fetch('http://localhost:5119/api/vacunaciones'),
          fetch('http://localhost:5119/api/campañas'),
          fetch('http://localhost:5119/api/lotes')
        ])
        setData({
          vacunaciones: await resVac.json(),
          campañas: await resCam.json(),
          lotes: await resLot.json(),
          loading: false
        })
      } catch (e) {
        console.error(e)
        setData(d => ({ ...d, loading: false }))
      }
    }
    load()
  }, [])

  if (data.loading) return <div style={{ padding: 20 }}>Cargando dashboard...</div>

  const activa = data.campañas[data.campañas.length - 1] || { nombre: 'Ninguna', fechaInicio: '', fechaFin: '' }
  const meta = 5000 // Meta hardcodeada ya que la DB no soporta meta por campaña actualmente
  const vacunados = data.vacunaciones.length
  const cobertura = meta > 0 ? Math.min(100, Math.round((vacunados / meta) * 100)) : 0
  
  const alertas = data.lotes.filter(l => l.cantidadDisponible < 100 || (new Date(l.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24) < 30)

  const kpis = [
    { valor: meta.toLocaleString(), label: 'Meta (Estimada)' },
    { valor: vacunados.toLocaleString(), label: 'Dosis aplicadas' },
    { valor: cobertura + '%', label: 'Cobertura alcanzada' },
    { valor: alertas.length, label: 'Alertas activas' }
  ]

  const porGrupo = [
    { grupo: 'General', objetivo: meta, vac: vacunados } // DB no soporta grupos poblacionales en vacunaciones
  ]

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
        <h2>Campaña activa: {activa.nombre}</h2>
        <p><b>Inicio:</b> {new Date(activa.fechaInicio).toLocaleDateString()} · <b>Fin:</b> {new Date(activa.fechaFin).toLocaleDateString()}</p>
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
          {alertas.map((a) => {
            const dias = Math.round((new Date(a.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24))
            const tipo = a.cantidadDisponible < 100 ? 'Stock Bajo' : 'Próximo a Vencer'
            return (
              <div key={a.idLote} className="alert" style={{ background: tipo.includes('Vencer') ? '#fef2f2' : '#fffbeb', borderColor: tipo.includes('Vencer') ? '#fecaca' : '#fde68a', color: tipo.includes('Vencer') ? '#b91c1c' : '#92400e' }}>
                <b>LOTE-{a.idLote}</b> ({a.vacuna?.nombre}) — {tipo} · stock: {a.cantidadDisponible} · vence en: {dias} días
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
