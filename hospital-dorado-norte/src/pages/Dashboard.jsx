import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts'
import { Activity, Users, ShieldAlert, Target, CalendarDays, TrendingUp } from 'lucide-react'

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

  if (data.loading) {
    return (
      <div className="dashboard-loading">
        <Activity className="spinner" size={32} />
        <p>Cargando panel de control...</p>
      </div>
    )
  }

  const activa = data.campañas[data.campañas.length - 1] || { nombre: 'Ninguna', fechaInicio: '', fechaFin: '' }
  const meta = 5000 // Meta hardcodeada ya que la DB no soporta meta por campaña actualmente
  const vacunados = data.vacunaciones.length
  const cobertura = meta > 0 ? Math.min(100, Math.round((vacunados / meta) * 100)) : 0
  
  const alertas = data.lotes.filter(l => l.cantidadDisponible < 100 || (new Date(l.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24) < 30)

  const kpis = [
    { valor: meta.toLocaleString(), label: 'Meta (Estimada)', icon: Target, color: '#0ea5e9' },
    { valor: vacunados.toLocaleString(), label: 'Dosis aplicadas', icon: Users, color: '#10b981' },
    { valor: cobertura + '%', label: 'Cobertura alcanzada', icon: TrendingUp, color: '#8b5cf6' },
    { valor: alertas.length, label: 'Alertas activas', icon: ShieldAlert, color: alertas.length > 0 ? '#ef4444' : '#64748b' }
  ]

  // Generar datos para gráfica de los últimos 7 días
  const today = new Date()
  const last7DaysData = Array.from({length: 7}, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    
    // Contar vacunas en este día
    const count = data.vacunaciones.filter(v => v.fechaAplicacion.startsWith(dateStr)).length
    
    return {
      name: d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
      Vacunas: count
    }
  })
  
  // Datos para gráfico radial de cobertura
  const radialData = [
    { name: 'Faltante', value: 100 - cobertura, fill: '#f1f5f9' },
    { name: 'Cobertura', value: cobertura, fill: '#0ea5e9' }
  ]

  const porGrupo = [
    { grupo: 'General', objetivo: meta, vac: vacunados }
  ]

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '-'
    return new Date(fechaStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="dashboard-container fade-in">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Panel de Control</h1>
          <p className="dashboard-subtitle">Resumen general del estado de vacunación y recursos.</p>
        </div>
        <div className="dashboard-date">
          <CalendarDays size={18} />
          <span>{today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="dashboard-kpis">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <div className="kpi-card" key={k.label}>
              <div className="kpi-icon-wrapper" style={{ backgroundColor: k.color + '15', color: k.color }}>
                <Icon size={24} />
              </div>
              <div className="kpi-info">
                <div className="kpi-value">{k.valor}</div>
                <div className="kpi-label">{k.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Charts Row */}
      <div className="dashboard-charts-row">
        <div className="dash-card area-chart-card">
          <h2 className="card-title">Evolución de Aplicaciones (Últimos 7 días)</h2>
          <div style={{ height: 260, marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7DaysData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVacunas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Area type="monotone" dataKey="Vacunas" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorVacunas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-card radial-chart-card">
          <h2 className="card-title">Campaña Activa</h2>
          <div className="campaign-info">
            <h3>{activa.nombre}</h3>
            <p className="camp-dates">{formatearFecha(activa.fechaInicio)} - {formatearFecha(activa.fechaFin)}</p>
          </div>
          <div style={{ height: 180, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
             <ResponsiveContainer width="100%" height="100%">
               <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" barSize={16} data={radialData} startAngle={90} endAngle={-270}>
                 <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
                 <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="radial-text" style={{ fontSize: '28px', fontWeight: '800', fill: '#0f172a' }}>
                   {cobertura}%
                 </text>
                 <text x="50%" y="65%" textAnchor="middle" className="radial-subtext" style={{ fontSize: '13px', fill: '#64748b' }}>
                   de la meta
                 </text>
               </RadialBarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="dashboard-bottom-row">
        <div className="dash-card">
          <h2 className="card-title">Avance por Grupo Prioritario</h2>
          <div className="groups-container">
            {porGrupo.map((g) => (
              <div key={g.grupo} className="group-progress">
                <div className="group-header">
                  <span className="group-name">{g.grupo}</span>
                  <span className="group-stats">{g.vac.toLocaleString()} / {g.objetivo.toLocaleString()}</span>
                </div>
                <div className="modern-bar-bg">
                  <div className="modern-bar-fill" style={{ width: Math.min(100, (g.vac / g.objetivo) * 100) + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="card-title" style={{ margin: 0 }}>Centro de Alertas</h2>
            {alertas.length > 0 && <span className="alert-badge pulse">{alertas.length} Críticas</span>}
          </div>
          
          <div className="alerts-list">
            {alertas.length === 0 && (
              <div className="alert-empty">
                <ShieldAlert size={36} color="#10b981" />
                <p>El sistema se encuentra estable y sin alertas críticas.</p>
              </div>
            )}
            {alertas.map((a) => {
              const dias = Math.round((new Date(a.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24))
              const isVencer = a.cantidadDisponible >= 100 // si no es stock bajo, es por vencer
              
              return (
                <div key={a.idLote} className={`alert-item ${isVencer ? 'alert-warning' : 'alert-danger'}`}>
                  <div className="alert-icon">
                    <ShieldAlert size={20} />
                  </div>
                  <div className="alert-content">
                    <div className="alert-title">LOTE-{a.idLote} ({a.vacuna?.nombre})</div>
                    <div className="alert-desc">
                      {isVencer ? `Próximo a Vencer en ${dias} días` : `Stock Crítico (${a.cantidadDisponible} dosis restantes)`}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
