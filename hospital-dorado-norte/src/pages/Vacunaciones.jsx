import { useState } from 'react'
import { vacunaciones, vacunas } from '../data/mock.js'

export default function Vacunaciones() {
  const [lista, setLista] = useState([...vacunaciones])
  const [form, setForm] = useState({ persona: '', ci: '', grupo: '5 – 9 años', vacuna: 'SR', dosis: '1ra', lote: 'LOTE-SR-001', fecha: '2026-03-20' })

  function registrar() {
    if (!form.persona || !form.ci) return
    setLista([{ id: Date.now(), ...form }, ...lista])
    setForm({ persona: '', ci: '', grupo: '5 – 9 años', vacuna: 'SR', dosis: '1ra', lote: 'LOTE-SR-001', fecha: '2026-03-20' })
  }

  return (
    <>
      <div className="card">
        <h2>Registrar vacunación (RF03)</h2>
        <div className="row">
          <input className="input" value={form.persona} onChange={(e) => setForm({ ...form, persona: e.target.value })} placeholder="Nombre de la persona" />
          <input className="input" value={form.ci} onChange={(e) => setForm({ ...form, ci: e.target.value })} placeholder="C.I." />
        </div>
        <div className="row">
          <select className="input" value={form.grupo} onChange={(e) => setForm({ ...form, grupo: e.target.value })}>
            <option>6 meses – 4 años</option><option>5 – 9 años</option>
            <option>10 – 14 años</option><option>15 – 19 años</option>
          </select>
          <select className="input" value={form.vacuna} onChange={(e) => setForm({ ...form, vacuna: e.target.value })}>
            {vacunas.map((v) => (<option key={v.id} value={v.tipo}>{v.tipo}</option>))}
          </select>
          <input className="input" value={form.dosis} onChange={(e) => setForm({ ...form, dosis: e.target.value })} placeholder="Dosis" />
          <input className="input" value={form.lote} onChange={(e) => setForm({ ...form, lote: e.target.value })} placeholder="Lote" />
          <input className="input" type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
        </div>
        <button className="btn" onClick={registrar}>Registrar dosis aplicada</button>
      </div>

      <div className="card">
        <h2>Vacunaciones registradas</h2>
        <table>
          <thead><tr><th>Persona</th><th>C.I.</th><th>Grupo</th><th>Vacuna</th><th>Dosis</th><th>Lote</th><th>Fecha</th></tr></thead>
          <tbody>
            {lista.map((v) => (
              <tr key={v.id}>
                <td>{v.persona}</td><td>{v.ci}</td><td>{v.grupo}</td>
                <td>{v.vacuna}</td><td>{v.dosis}</td><td>{v.lote}</td><td>{v.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
