import { useState, useEffect } from 'react'
import { Activity, Target, Users, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react'
import { ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell, Tooltip } from 'recharts'

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

  if (loading) {
    return (
      <div className="dashboard-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <Activity className="spinner" size={40} color="#0ea5e9" />
        <p style={{ color: '#64748b', fontWeight: 500, fontSize: '1.1rem' }}>Cargando datos de cobertura y población...</p>
      </div>
    )
  }

  const metaTotal = 5000 // Meta global por defecto
  const cobertura = Math.min(100, Math.round((vacunados / metaTotal) * 100))
  const pendiente = Math.max(0, metaTotal - vacunados)

  const kpis = [
    { valor: metaTotal.toLocaleString(), label: 'Meta Global', icon: Target, color: '#3b82f6' },
    { valor: vacunados.toLocaleString(), label: 'Dosis Aplicadas', icon: ShieldCheck, color: '#10b981' },
    { valor: pendiente.toLocaleString(), label: 'Población Pendiente', icon: AlertCircle, color: '#f59e0b' },
    { valor: cobertura + '%', label: 'Cobertura Actual', icon: TrendingUp, color: '#8b5cf6' }
  ]

  // Datos para gráfico radial de cobertura
  const radialData = [
    { name: 'Faltante', value: 100 - cobertura, fill: '#f1f5f9' },
    { name: 'Cobertura', value: cobertura, fill: '#0ea5e9' }
  ]

  const pieData = [
    { name: 'Vacunados', value: vacunados },
    { name: 'Pendientes', value: pendiente }
  ]
  const COLORS = ['#10b981', '#e2e8f0']

  return (
    <div className="dashboard-container fade-in">
      {/* Header */}
      <div className="dashboard-header" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)' }}>
        <div>
          <h1 className="dashboard-title">Análisis de Cobertura</h1>
          <p className="dashboard-subtitle">Visualización estratégica del alcance de inmunización de la población.</p>
        </div>
        <div className="dashboard-date" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
          <Activity size={18} />
          <span>Datos en tiempo real</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="dashboard-kpis">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <div className="kpi-card" key={k.label} style={{ padding: '24px' }}>
              <div className="kpi-icon-wrapper" style={{ backgroundColor: k.color + '15', color: k.color, width: 56, height: 56, borderRadius: 16 }}>
                <Icon size={28} />
              </div>
              <div className="kpi-info" style={{ marginLeft: 6 }}>
                <div className="kpi-value" style={{ fontSize: '2rem' }}>{k.valor}</div>
                <div className="kpi-label">{k.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="dashboard-charts-row">
        {/* Gráfico Radial */}
        <div className="dash-card radial-chart-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
          <h2 className="card-title" style={{ width: '100%', textAlign: 'left', marginBottom: 20 }}>Tasa de Cobertura Global</h2>
          <div style={{ height: 280, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <ResponsiveContainer width="100%" height="100%">
               <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={24} data={radialData} startAngle={90} endAngle={-270}>
                 <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={12} />
                 <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '42px', fontWeight: '800', fill: '#0f172a' }}>
                   {cobertura}%
                 </text>
                 <text x="50%" y="62%" textAnchor="middle" style={{ fontSize: '15px', fill: '#64748b', fontWeight: 500 }}>
                   del objetivo
                 </text>
               </RadialBarChart>
             </ResponsiveContainer>
          </div>
          <div style={{ marginTop: 24, padding: '16px 24px', background: '#f8fafc', borderRadius: 16, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
             <div>
                <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Estado del Objetivo</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>Progreso hacia la meta de {metaTotal.toLocaleString()}</div>
             </div>
             <div style={{ padding: '8px 16px', background: cobertura >= 80 ? '#ecfdf5' : cobertura >= 50 ? '#fffbeb' : '#fef2f2', color: cobertura >= 80 ? '#059669' : cobertura >= 50 ? '#d97706' : '#dc2626', borderRadius: 99, fontWeight: 700, fontSize: '0.9rem' }}>
                {cobertura >= 80 ? 'Óptimo' : cobertura >= 50 ? 'En Proceso' : 'Bajo'}
             </div>
          </div>
        </div>

        {/* Desglose y Distribución */}
        <div className="dash-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="card-title">Distribución Poblacional</h2>
          
          <div style={{ height: 200, width: '100%', marginTop: 20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0 30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
               <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#10b981' }}></div>
               <span style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500 }}>Vacunados</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
               <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#e2e8f0' }}></div>
               <span style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500 }}>Pendientes</span>
            </div>
          </div>

          <div className="groups-container" style={{ marginTop: 'auto', background: '#f8fafc', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
             <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#334155' }}>Desglose por Grupo</h3>
             <div className="group-progress">
               <div className="group-header">
                 <span className="group-name" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><Users size={18} color="#0ea5e9"/> Población General</span>
                 <span className="group-stats" style={{ fontWeight: 600 }}>{vacunados.toLocaleString()} / {metaTotal.toLocaleString()}</span>
               </div>
               <div className="modern-bar-bg" style={{ height: 10 }}>
                 <div className="modern-bar-fill" style={{ width: Math.min(100, (vacunados / metaTotal) * 100) + '%', background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' }} />
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
