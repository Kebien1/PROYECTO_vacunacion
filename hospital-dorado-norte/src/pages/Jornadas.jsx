import { useState } from 'react'
import { jornadas } from '../data/mock.js'

export default function Jornadas() {
  const [lista, setLista] = useState([...jornadas])
  const [form, setForm] = useState({ fecha: '2026-04-05', horario: '08:00 – 16:00', punto: '', responsable: '' })

  function agregar() {
    if (!form.punto) return
    setLista([...lista, { id: Date.now(), ...form }])
    setForm({ fecha: '2026-04-05', horario: '08:00 – 16:00', punto: '', responsable: '' })
  }

  return (
    <>
      <div className="card">
        <h2>Registrar jornada (RF06)</h2>
        <div className="row">
          <input className="input" type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
          <input className="input" value={form.horario} onChange={(e) => setForm({ ...form, horario: e.target.value })} placeholder="Horario" />
          <input className="input" value={form.punto} onChange={(e) => setForm({ ...form, punto: e.target.value })} placeholder="Punto de vacunación" />
          <input className="input" value={form.responsable} onChange={(e) => setForm({ ...form, responsable: e.target.value })} placeholder="Responsable / brigada" />
        </div>
        <button className="btn" onClick={agregar}>Agregar jornada</button>
      </div>

      <div className="card">
        <h2>Jornadas programadas</h2>
        <table>
          <thead><tr><th>Fecha</th><th>Horario</th><th>Punto</th><th>Responsable</th></tr></thead>
          <tbody>
            {lista.map((j) => (
              <tr key={j.id}>
                <td>{j.fecha}</td><td>{j.horario}</td><td>{j.punto}</td><td>{j.responsable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
