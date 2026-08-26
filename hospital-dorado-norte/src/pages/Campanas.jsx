import { useState } from 'react'
import { campanaActiva } from '../data/mock.js'

export default function Campanas() {
  const [campana, setCampana] = useState({ ...campanaActiva })
  const [nueva, setNueva] = useState({ nombre: '', periodo: '', meta: '', poblacion: '' })
  const [guardado, setGuardado] = useState(false)

  function crear() {
    setCampana({
      id: Date.now(),
      nombre: nueva.nombre || 'Nueva Campaña',
      periodo: nueva.periodo || 'Por definir',
      meta: Number(nueva.meta) || 0,
      poblacion: nueva.poblacion,
      estado: 'Borrador'
    })
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2500)
  }

  return (
    <>
      <div className="card">
        <h2>Campaña actual (RF02)</h2>
        <table>
          <tbody>
            <tr><th>Nombre</th><td>{campana.nombre}</td></tr>
            <tr><th>Periodo</th><td>{campana.periodo}</td></tr>
            <tr><th>Meta</th><td>{campana.meta.toLocaleString()}</td></tr>
            <tr><th>Estado</th><td><span className="pill pill-act">{campana.estado}</span></td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Registrar / actualizar campaña</h2>
        <div className="row">
          <input className="input" value={nueva.nombre} onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })} placeholder="Nombre de la campaña" />
          <input className="input" value={nueva.periodo} onChange={(e) => setNueva({ ...nueva, periodo: e.target.value })} placeholder="Periodo (ej. Mar-Jun 2026)" />
        </div>
        <div className="row">
          <input className="input" type="number" value={nueva.meta} onChange={(e) => setNueva({ ...nueva, meta: e.target.value })} placeholder="Meta de población" />
          <input className="input" value={nueva.poblacion} onChange={(e) => setNueva({ ...nueva, poblacion: e.target.value })} placeholder="Población objetivo" />
        </div>
        <button className="btn" onClick={crear}>Guardar campaña</button>
        {guardado && <span style={{ color: '#065f46', marginLeft: 10, fontSize: 13 }}>✓ Campaña registrada (mock)</span>}
      </div>
    </>
  )
}
