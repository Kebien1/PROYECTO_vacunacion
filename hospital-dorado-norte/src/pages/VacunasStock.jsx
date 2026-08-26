import { useState } from 'react'
import { lotes, vacunas } from '../data/mock.js'

export default function VacunasStock() {
  const [lista, setLista] = useState([...lotes])
  const [form, setForm] = useState({ vacuna: 'SR', codigo: '', cantidad: '', vencimiento: '2026-12-31', minimo: 200 })

  function agregar() {
    if (!form.codigo || !form.cantidad) return
    setLista([{ id: Date.now(), vacuna: form.vacuna, codigo: form.codigo, cantidad: Number(form.cantidad), vencimiento: form.vencimiento, minimo: Number(form.minimo) }, ...lista])
    setForm({ vacuna: 'SR', codigo: '', cantidad: '', vencimiento: '2026-12-31', minimo: 200 })
  }

  return (
    <>
      <div className="card">
        <h2>Ingresar lote / existencia (RF04)</h2>
        <div className="row">
          <select className="input" value={form.vacuna} onChange={(e) => setForm({ ...form, vacuna: e.target.value })}>
            {vacunas.map((v) => (<option key={v.id} value={v.tipo}>{v.tipo}</option>))}
          </select>
          <input className="input" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} placeholder="Código de lote" />
          <input className="input" type="number" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} placeholder="Cantidad" />
          <input className="input" type="date" value={form.vencimiento} onChange={(e) => setForm({ ...form, vencimiento: e.target.value })} />
          <input className="input" type="number" value={form.minimo} onChange={(e) => setForm({ ...form, minimo: e.target.value })} placeholder="Stock mínimo" />
        </div>
        <button className="btn" onClick={agregar}>Registrar lote</button>
      </div>

      <div className="card">
        <h2>Stock de vacunas y lotes</h2>
        <table>
          <thead><tr><th>Vacuna</th><th>Lote</th><th>Cantidad</th><th>Mínimo</th><th>Vencimiento</th><th>Estado</th></tr></thead>
          <tbody>
            {lista.map((l) => (
              <tr key={l.id}>
                <td>{l.vacuna}</td><td>{l.codigo}</td><td>{l.cantidad}</td><td>{l.minimo}</td><td>{l.vencimiento}</td>
                <td>
                  <span className="pill" style={{ background: l.cantidad < l.minimo ? '#fef2f2' : '#ecfdf5', color: l.cantidad < l.minimo ? '#b91c1c' : '#065f46' }}>
                    {l.cantidad < l.minimo ? 'Bajo' : 'OK'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
