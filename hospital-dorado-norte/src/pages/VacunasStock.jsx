import { useState, useEffect } from 'react'

export default function VacunasStock() {
  const [lista, setLista] = useState([])
  const [vacunas, setVacunas] = useState([])
  const [form, setForm] = useState({ idVacuna: '', cantidadDisponible: '', fechaVencimiento: '2026-12-31' })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const resVac = await fetch('http://localhost:5119/api/vacunas')
      const dataVac = await resVac.json()
      setVacunas(dataVac)

      const resLot = await fetch('http://localhost:5119/api/lotes')
      const dataLot = await resLot.json()
      setLista(dataLot)

      if (dataVac.length > 0) {
        setForm(f => ({ ...f, idVacuna: dataVac[0].idVacuna }))
      }
    } catch (error) {
      console.error("Error cargando lotes y vacunas", error)
    }
  }

  const agregar = async () => {
    if (!form.idVacuna || !form.cantidadDisponible) return
    
    try {
      const res = await fetch('http://localhost:5119/api/lotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idVacuna: parseInt(form.idVacuna),
          cantidadDisponible: parseInt(form.cantidadDisponible),
          fechaVencimiento: form.fechaVencimiento
        })
      })

      if (res.ok) {
        cargarDatos()
        setForm(f => ({ ...f, cantidadDisponible: '' }))
      } else {
        const errorData = await res.json()
        alert(errorData.mensaje || 'Error al agregar lote')
      }
    } catch (error) {
      console.error("Error", error)
    }
  }

  return (
    <>
      <div className="card">
        <h2>Ingresar lote / existencia (RF04)</h2>
        <div className="row">
          <select className="input" value={form.idVacuna} onChange={(e) => setForm({ ...form, idVacuna: e.target.value })}>
            {vacunas.map((v) => (<option key={v.idVacuna} value={v.idVacuna}>{v.nombre}</option>))}
          </select>
          <input className="input" type="number" value={form.cantidadDisponible} onChange={(e) => setForm({ ...form, cantidadDisponible: e.target.value })} placeholder="Cantidad Disponible" />
          <input className="input" type="date" value={form.fechaVencimiento} onChange={(e) => setForm({ ...form, fechaVencimiento: e.target.value })} />
        </div>
        <button className="btn" onClick={agregar}>Registrar lote</button>
      </div>

      <div className="card">
        <h2>Stock de vacunas y lotes</h2>
        <table>
          <thead><tr><th>Vacuna</th><th>Lote (ID)</th><th>Cantidad</th><th>Vencimiento</th><th>Estado</th></tr></thead>
          <tbody>
            {lista.map((l) => (
              <tr key={l.idLote}>
                <td>{l.vacuna?.nombre}</td><td>LOTE-{l.idLote}</td><td>{l.cantidadDisponible}</td><td>{new Date(l.fechaVencimiento).toLocaleDateString()}</td>
                <td>
                  <span className="pill" style={{ background: l.cantidadDisponible < 100 ? '#fef2f2' : '#ecfdf5', color: l.cantidadDisponible < 100 ? '#b91c1c' : '#065f46' }}>
                    {l.cantidadDisponible < 100 ? 'Bajo' : 'OK'}
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
