import { useState } from 'react'
import { usuarios } from '../data/mock.js'

export default function Usuarios() {
  const [lista, setLista] = useState([...usuarios])
  const [form, setForm] = useState({ usuario: '', nombre: '', rol: 'Personal de Vacunación', estado: 'Activo' })

  function agregar() {
    if (!form.usuario || !form.nombre) return
    setLista([...lista, { id: Date.now(), ...form }])
    setForm({ usuario: '', nombre: '', rol: 'Personal de Vacunación', estado: 'Activo' })
  }

  return (
    <>
      <div className="card">
        <h2>Gestión de usuarios (RF01)</h2>
        <div className="row">
          <input className="input" value={form.usuario} onChange={(e) => setForm({ ...form, usuario: e.target.value })} placeholder="Usuario" />
          <input className="input" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre completo" />
          <select className="input" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
            <option>Administrador</option>
            <option>Responsable de Vacunación</option>
            <option>Responsable Administrativo</option>
            <option>Personal de Vacunación</option>
          </select>
          <button className="btn" onClick={agregar}>Crear usuario</button>
        </div>
      </div>

      <div className="card">
        <h2>Usuarios del sistema</h2>
        <table>
          <thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Estado</th></tr></thead>
          <tbody>
            {lista.map((u) => (
              <tr key={u.id}>
                <td>{u.usuario}</td><td>{u.nombre}</td><td>{u.rol}</td>
                <td><span className="pill pill-act">{u.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
