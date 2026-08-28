import { useState, useEffect } from 'react'

export default function Jornadas() {
  const [lista, setLista] = useState([])
  const [campañas, setCampañas] = useState([])
  const [form, setForm] = useState({ fecha: '', idCampaña: '' })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const resJor = await fetch('http://localhost:5119/api/jornadas')
      setLista(await resJor.json())
      
      const resCam = await fetch('http://localhost:5119/api/campañas')
      const dataCam = await resCam.json()
      setCampañas(dataCam)

      if (dataCam.length > 0) {
        setForm({ fecha: new Date().toISOString().split('T')[0], idCampaña: dataCam[0].idCampaña })
      }
    } catch (error) {
      console.error("Error cargando jornadas", error)
    }
  }

  const agregar = async () => {
    if (!form.fecha || !form.idCampaña) return
    
    try {
      const res = await fetch('http://localhost:5119/api/jornadas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: form.fecha,
          idCampaña: parseInt(form.idCampaña)
        })
      })

      if (res.ok) {
        cargarDatos()
      } else {
        const errorData = await res.json()
        alert(errorData.mensaje || 'Error al agregar jornada')
      }
    } catch (error) {
      console.error("Error", error)
    }
  }

  return (
    <>
      <div className="card">
        <h2>Registrar jornada (RF06)</h2>
        <div className="row">
          <input className="input" type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
          <select className="input" value={form.idCampaña} onChange={(e) => setForm({ ...form, idCampaña: e.target.value })}>
            {campañas.map((c) => (<option key={c.idCampaña} value={c.idCampaña}>{c.nombre}</option>))}
          </select>
        </div>
        <button className="btn" onClick={agregar}>Agregar jornada</button>
      </div>

      <div className="card">
        <h2>Jornadas programadas</h2>
        <table>
          <thead><tr><th>ID</th><th>Fecha</th><th>Campaña</th></tr></thead>
          <tbody>
            {lista.map((j) => (
              <tr key={j.idJornada}>
                <td>{j.idJornada}</td>
                <td>{new Date(j.fecha).toLocaleDateString()}</td>
                <td>{j.campaña?.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
