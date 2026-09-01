import { useState, useEffect } from 'react'

export default function Campanas() {
  const [lista, setLista] = useState([])
  const [centros, setCentros] = useState([])
  const [nueva, setNueva] = useState({ nombre: '', fechaInicio: '', fechaFin: '', idCentro: '' })
  const [guardado, setGuardado] = useState(false)
  const [mensajeError, setMensajeError] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const resCam = await fetch('http://localhost:5119/api/campañas')
      setLista(await resCam.json())

      const resCen = await fetch('http://localhost:5119/api/centrossalud')
      const dataCen = await resCen.json()
      setCentros(dataCen)

      if (dataCen.length > 0) {
        setNueva(n => ({ ...n, idCentro: dataCen[0].idCentro }))
      }
    } catch (error) {
      console.error("Error cargando datos", error)
    }
  }

  const crear = async () => {
    setMensajeError('');
    if (!nueva.nombre || !nueva.fechaInicio || !nueva.fechaFin || !nueva.idCentro) {
      setMensajeError('Por favor complete todos los campos');
      return;
    }
    
    const inicio = new Date(nueva.fechaInicio + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    
    if (inicio < hoy) {
      setMensajeError('No se pueden crear campañas con fechas anteriores al día de hoy');
      return;
    }

    if (new Date(nueva.fechaFin + 'T00:00:00') < inicio) {
      setMensajeError('La fecha de fin no puede ser anterior a la fecha de inicio');
      return;
    }
    

    try {
      const res = await fetch('http://localhost:5119/api/campañas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nueva.nombre,
          fechaInicio: nueva.fechaInicio,
          fechaFin: nueva.fechaFin,
          idCentro: parseInt(nueva.idCentro)
        })
      })

      if (res.ok) {
        cargarDatos()
        setGuardado(true)
        setMensajeError('')
        setTimeout(() => setGuardado(false), 2500)
        setNueva({ nombre: '', fechaInicio: '', fechaFin: '', idCentro: centros.length > 0 ? centros[0].idCentro : '' })
      } else {
        const errorData = await res.json()
        setMensajeError(errorData.mensaje || 'Error al guardar campaña')
      }
    } catch (error) {
      console.error("Error", error)
    }
  }

  const hoyStr = new Date().toISOString().split('T')[0];

  return (
    <>
      {mensajeError && (
        <div className="alert login-error" style={{ marginBottom: 14 }}>
          {mensajeError}
          <button onClick={() => setMensajeError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}
      <div className="card">
        <h2>Campañas programadas (RF02)</h2>
        <table>
          <thead><tr><th>ID</th><th>Nombre</th><th>Fecha Inicio</th><th>Fecha Fin</th><th>Centro Salud</th></tr></thead>
          <tbody>
            {lista.map(c => (
              <tr key={c.idCampaña}>
                <td>{c.idCampaña}</td>
                <td>{c.nombre}</td>
                <td>{new Date(c.fechaInicio).toLocaleDateString()}</td>
                <td>{new Date(c.fechaFin).toLocaleDateString()}</td>
                <td>{c.centroSalud?.nombre || `Centro #${c.idCentro}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Registrar / actualizar campaña</h2>
        <div className="row">
          <input className="input" value={nueva.nombre} onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })} placeholder="Nombre de la campaña" />
          <select className="input" value={nueva.idCentro} onChange={(e) => setNueva({ ...nueva, idCentro: e.target.value })}>
            {centros.map(c => <option key={c.idCentro} value={c.idCentro}>{c.nombre}</option>)}
          </select>
        </div>
        <div className="row">
          <input className="input" type="date" value={nueva.fechaInicio} onChange={(e) => setNueva({ ...nueva, fechaInicio: e.target.value })} placeholder="Fecha Inicio" min={hoyStr} />
          <input className="input" type="date" value={nueva.fechaFin} onChange={(e) => setNueva({ ...nueva, fechaFin: e.target.value })} placeholder="Fecha Fin" min={nueva.fechaInicio || hoyStr} />
        </div>
        <button className="btn" onClick={crear}>Guardar campaña</button>
        {guardado && <span style={{ color: '#065f46', marginLeft: 10, fontSize: 13 }}>✓ Campaña registrada</span>}
      </div>
    </>
  )
}
