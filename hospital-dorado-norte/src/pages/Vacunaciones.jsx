import { useState, useEffect } from 'react'

export default function Vacunaciones() {
  const [lista, setLista] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [campañas, setCampañas] = useState([])
  const [lotes, setLotes] = useState([])
  const [form, setForm] = useState({ idUsuario: '', idCampaña: '', dosis: '1ra', idLote: '', fecha: '' })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const resVac = await fetch('http://localhost:5119/api/vacunaciones')
      setLista(await resVac.json())
      
      const resUsu = await fetch('http://localhost:5119/api/usuarios')
      const dataUsu = await resUsu.json()
      setUsuarios(dataUsu)
      
      const resCam = await fetch('http://localhost:5119/api/campañas')
      const dataCam = await resCam.json()
      setCampañas(dataCam)
      
      const resLot = await fetch('http://localhost:5119/api/lotes')
      const dataLot = await resLot.json()
      setLotes(dataLot)
      
      setForm(f => ({
        ...f,
        idUsuario: dataUsu.length > 0 ? dataUsu[0].idUsuario : '',
        idCampaña: dataCam.length > 0 ? dataCam[0].idCampaña : '',
        idLote: dataLot.length > 0 ? dataLot[0].idLote : '',
        fecha: new Date().toISOString().split('T')[0]
      }))
    } catch (error) {
      console.error("Error cargando datos", error)
    }
  }

  const registrar = async () => {
    if (!form.idUsuario || !form.idCampaña || !form.idLote) return
    
    try {
      const res = await fetch('http://localhost:5119/api/vacunaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fechaAplicacion: form.fecha,
          dosis: form.dosis,
          idUsuario: parseInt(form.idUsuario),
          idCampaña: parseInt(form.idCampaña),
          idLote: parseInt(form.idLote)
        })
      })

      if (res.ok) {
        cargarDatos()
      } else {
        const errorData = await res.json()
        alert(errorData.mensaje || 'Error al registrar')
      }
    } catch (error) {
      console.error("Error", error)
    }
  }

  return (
    <>
      <div className="card">
        <h2>Registrar vacunación (RF03)</h2>
        <div className="row">
          <select className="input" value={form.idUsuario} onChange={(e) => setForm({ ...form, idUsuario: e.target.value })}>
            {usuarios.map(u => <option key={u.idUsuario} value={u.idUsuario}>{u.nombre}</option>)}
          </select>
          <select className="input" value={form.idCampaña} onChange={(e) => setForm({ ...form, idCampaña: e.target.value })}>
            {campañas.map(c => <option key={c.idCampaña} value={c.idCampaña}>{c.nombre}</option>)}
          </select>
        </div>
        <div className="row">
          <input className="input" value={form.dosis} onChange={(e) => setForm({ ...form, dosis: e.target.value })} placeholder="Dosis" />
          <select className="input" value={form.idLote} onChange={(e) => setForm({ ...form, idLote: e.target.value })}>
            {lotes.map(l => <option key={l.idLote} value={l.idLote}>Lote {l.idLote}</option>)}
          </select>
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
              <tr key={v.idVacunacion}>
                <td>{v.usuario?.nombre}</td><td>-</td><td>-</td>
                <td>{v.lote?.vacuna?.nombre}</td><td>{v.dosis}</td><td>{v.idLote}</td><td>{new Date(v.fechaAplicacion).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
