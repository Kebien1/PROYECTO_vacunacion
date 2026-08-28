import { useState, useEffect } from 'react'

export default function Usuarios() {
  const [lista, setLista] = useState([])
  const [roles, setRoles] = useState([])
  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '', idRol: '' })

  useEffect(() => {
    cargarRoles()
    cargarUsuarios()
  }, [])

  const cargarRoles = async () => {
    try {
      const res = await fetch('http://localhost:5119/api/roles')
      const data = await res.json()
      setRoles(data)
      if (data.length > 0) {
        setForm(f => ({ ...f, idRol: data[0].idRol }))
      }
    } catch (error) {
      console.error("Error cargando roles", error)
    }
  }

  const cargarUsuarios = async () => {
    try {
      const res = await fetch('http://localhost:5119/api/usuarios')
      const data = await res.json()
      setLista(data)
    } catch (error) {
      console.error("Error cargando usuarios", error)
    }
  }

  const agregar = async () => {
    if (!form.correo || !form.nombre || !form.contrasena || !form.idRol) return
    
    try {
      const res = await fetch('http://localhost:5119/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          correo: form.correo,
          contraseña: form.contrasena,
          idRol: parseInt(form.idRol)
        })
      })

      if (res.ok) {
        cargarUsuarios()
        setForm({ nombre: '', correo: '', contrasena: '', idRol: roles.length > 0 ? roles[0].idRol : '' })
      } else {
        const errorData = await res.json()
        alert(errorData.mensaje || 'Error al crear usuario')
      }
    } catch (error) {
      console.error("Error al crear usuario", error)
    }
  }

  return (
    <>
      <div className="card">
        <h2>Gestión de usuarios (RF01)</h2>
        <div className="row">
          <input className="input" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} placeholder="Usuario (Correo)" />
          <input className="input" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre completo" />
          <input type="password" className="input" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} placeholder="Contraseña" />
          <select className="input" value={form.idRol} onChange={(e) => setForm({ ...form, idRol: e.target.value })}>
            {roles.map(rol => (
              <option key={rol.idRol} value={rol.idRol}>{rol.nombreRol}</option>
            ))}
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
              <tr key={u.idUsuario}>
                <td>{u.correo}</td><td>{u.nombre}</td><td>{u.rol?.nombreRol || 'Sin rol'}</td>
                <td><span className="pill pill-act">Activo</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
