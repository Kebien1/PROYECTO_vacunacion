import { useState, useEffect } from 'react'
import { useAuth } from '../auth.jsx'

export default function Vacunaciones() {
  const { sesion } = useAuth()
  const [lista, setLista] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [campañas, setCampañas] = useState([])
  const [vacunas, setVacunas] = useState([])
  const [lotes, setLotes] = useState([])
  const [puntos, setPuntos] = useState([])
  const [grupos, setGrupos] = useState([])
  const [form, setForm] = useState({
    idPaciente: '', idCampaña: '', dosis: '1ra', idLote: '', idPunto: '', fecha: '',
    // Campos para registrar nuevo paciente
    nuevoPaciente: false,
    pacNombre: '', pacCedula: '', pacFechaNac: '', pacSexo: 'M', pacIdGrupo: ''
  })
  const [busquedaCedula, setBusquedaCedula] = useState('')
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null)
  const [mensaje, setMensaje] = useState(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [resVac, resPac, resCam, resVacunas, resLot, resPun, resGru] = await Promise.all([
        fetch('http://localhost:5119/api/vacunaciones'),
        fetch('http://localhost:5119/api/pacientes'),
        fetch('http://localhost:5119/api/campañas'),
        fetch('http://localhost:5119/api/vacunas'),
        fetch('http://localhost:5119/api/lotes'),
        fetch('http://localhost:5119/api/puntosvacunacion'),
        fetch('http://localhost:5119/api/grupospriorizados')
      ])
      setLista(await resVac.json())
      const dataPac = await resPac.json()
      setPacientes(dataPac)
      const dataCam = await resCam.json()
      setCampañas(dataCam)
      setVacunas(await resVacunas.json())
      const dataLot = await resLot.json()
      setLotes(dataLot)
      const dataPun = await resPun.json()
      setPuntos(dataPun)
      setGrupos(await resGru.json())

      setForm(f => ({
        ...f,
        idCampaña: dataCam.length > 0 ? dataCam[0].idCampaña : '',
        idLote: dataLot.length > 0 ? dataLot[0].idLote : '',
        idPunto: dataPun.length > 0 ? dataPun[0].idPunto : '',
        fecha: new Date().toISOString().split('T')[0]
      }))
    } catch (error) {
      console.error("Error cargando datos", error)
    }
  }

  const buscarPaciente = async () => {
    if (!busquedaCedula.trim()) return
    try {
      const res = await fetch(`http://localhost:5119/api/pacientes/buscar/${busquedaCedula.trim()}`)
      if (res.ok) {
        const pac = await res.json()
        setPacienteEncontrado(pac)
        setForm(f => ({ ...f, idPaciente: pac.idPaciente, nuevoPaciente: false }))
        setMensaje({ tipo: 'ok', texto: `Paciente encontrado: ${pac.nombre}` })
      } else {
        setPacienteEncontrado(null)
        setMensaje({ tipo: 'error', texto: 'Paciente no encontrado. Puede registrar uno nuevo.' })
      }
    } catch (error) {
      console.error("Error buscando paciente", error)
    }
  }

  const registrarNuevoPaciente = async () => {
    if (!form.pacNombre || !form.pacCedula || !form.pacFechaNac) {
      setMensaje({ tipo: 'error', texto: 'Complete todos los campos del paciente' })
      return null
    }
    try {
      const res = await fetch('http://localhost:5119/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.pacNombre,
          cedula: form.pacCedula,
          fechaNacimiento: form.pacFechaNac,
          sexo: form.pacSexo,
          idGrupo: form.pacIdGrupo ? parseInt(form.pacIdGrupo) : null
        })
      })
      if (res.ok) {
        const nuevoPac = await res.json()
        setPacienteEncontrado(nuevoPac)
        await cargarDatos()
        return nuevoPac.idPaciente
      } else {
        const err = await res.json()
        setMensaje({ tipo: 'error', texto: err.mensaje || 'Error al registrar paciente' })
        return null
      }
    } catch (error) {
      console.error("Error registrando paciente", error)
      return null
    }
  }

  const registrar = async () => {
    let idPacienteFinal = form.idPaciente

    // Si es nuevo paciente, registrarlo primero
    if (form.nuevoPaciente) {
      const nuevoId = await registrarNuevoPaciente()
      if (!nuevoId) return
      idPacienteFinal = nuevoId
    }

    if (!idPacienteFinal || !form.idCampaña || !form.idLote) {
      setMensaje({ tipo: 'error', texto: 'Seleccione paciente, campaña y lote' })
      return
    }

    try {
      const res = await fetch('http://localhost:5119/api/vacunaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fechaAplicacion: form.fecha,
          dosis: form.dosis,
          idPaciente: parseInt(idPacienteFinal),
          idCampaña: parseInt(form.idCampaña),
          idLote: parseInt(form.idLote),
          idPunto: form.idPunto ? parseInt(form.idPunto) : null,
          idUsuarioAplicador: parseInt(sesion.token)
        })
      })

      if (res.ok) {
        setMensaje({ tipo: 'ok', texto: '✓ Vacunación registrada correctamente' })
        setPacienteEncontrado(null)
        setBusquedaCedula('')
        setForm(f => ({
          ...f, idPaciente: '', nuevoPaciente: false,
          pacNombre: '', pacCedula: '', pacFechaNac: '', pacSexo: 'M', pacIdGrupo: ''
        }))
        cargarDatos()
      } else {
        const errorData = await res.json()
        setMensaje({ tipo: 'error', texto: errorData.mensaje || 'Error al registrar' })
      }
    } catch (error) {
      console.error("Error", error)
    }
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este registro de vacunación?')) return
    try {
      await fetch(`http://localhost:5119/api/vacunaciones/${id}`, { method: 'DELETE' })
      cargarDatos()
    } catch (error) {
      console.error("Error eliminando", error)
    }
  }

  const calcularEdad = (fechaNac) => {
    if (!fechaNac) return '-'
    const hoy = new Date()
    const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const m = hoy.getMonth() - nac.getMonth()
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
    if (edad < 1) {
      const meses = (hoy.getFullYear() - nac.getFullYear()) * 12 + hoy.getMonth() - nac.getMonth()
      return `${meses} meses`
    }
    return `${edad} años`
  }

  // Filtrar lotes por vacuna seleccionada (opcional)
  const lotesConVacuna = lotes.map(l => {
    const vac = vacunas.find(v => v.idVacuna === l.idVacuna)
    return { ...l, nombreVacuna: vac ? vac.nombre : `Vacuna ${l.idVacuna}` }
  })

  return (
    <>
      {mensaje && (
        <div className={`alert ${mensaje.tipo === 'ok' ? 'alert-ok' : 'login-error'}`} style={{ marginBottom: 14 }}>
          {mensaje.texto}
          <button onClick={() => setMensaje(null)} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}

      <div className="card">
        <h2>Registrar vacunación (RF03)</h2>

        {/* Paso 1: Buscar o registrar paciente */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <strong style={{ fontSize: 13, color: '#334155' }}>① Paciente</strong>
            <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.nuevoPaciente} onChange={e => { setForm(f => ({ ...f, nuevoPaciente: e.target.checked })); setPacienteEncontrado(null) }} />
              Nuevo paciente
            </label>
          </div>

          {!form.nuevoPaciente ? (
            <>
              <div className="row">
                <input className="input" placeholder="Buscar por C.I." value={busquedaCedula}
                  onChange={e => setBusquedaCedula(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && buscarPaciente()} />
                <button className="btn" onClick={buscarPaciente} style={{ maxWidth: 120 }}>Buscar</button>
              </div>
              {pacienteEncontrado && (
                <div style={{ fontSize: 13, marginTop: 4, padding: '8px 10px', background: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                  <strong>{pacienteEncontrado.nombre}</strong> — C.I.: {pacienteEncontrado.cedula} — {calcularEdad(pacienteEncontrado.fechaNacimiento)} — {pacienteEncontrado.sexo === 'M' ? 'Masculino' : 'Femenino'}
                  {pacienteEncontrado.grupoPriorizado && <span> — Grupo: {pacienteEncontrado.grupoPriorizado.nombreGrupo}</span>}
                </div>
              )}
              {!pacienteEncontrado && (
                <div style={{ marginTop: 6 }}>
                  <select className="input" value={form.idPaciente} onChange={e => {
                    setForm(f => ({ ...f, idPaciente: e.target.value }))
                    const pac = pacientes.find(p => p.idPaciente === parseInt(e.target.value))
                    if (pac) setPacienteEncontrado(pac)
                  }}>
                    <option value="">— Seleccionar paciente existente —</option>
                    {pacientes.map(p => <option key={p.idPaciente} value={p.idPaciente}>{p.nombre} (C.I.: {p.cedula})</option>)}
                  </select>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="row">
                <input className="input" placeholder="Nombre completo" value={form.pacNombre} onChange={e => setForm(f => ({ ...f, pacNombre: e.target.value }))} />
                <input className="input" placeholder="Cédula / C.I." value={form.pacCedula} onChange={e => setForm(f => ({ ...f, pacCedula: e.target.value }))} />
              </div>
              <div className="row">
                <input className="input" type="date" value={form.pacFechaNac} onChange={e => setForm(f => ({ ...f, pacFechaNac: e.target.value }))} />
                <select className="input" value={form.pacSexo} onChange={e => setForm(f => ({ ...f, pacSexo: e.target.value }))}>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
                <select className="input" value={form.pacIdGrupo} onChange={e => setForm(f => ({ ...f, pacIdGrupo: e.target.value }))}>
                  <option value="">— Grupo priorizado (opcional) —</option>
                  {grupos.map(g => <option key={g.idGrupo} value={g.idGrupo}>{g.nombreGrupo}</option>)}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Paso 2: Datos de la vacunación */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <strong style={{ fontSize: 13, color: '#334155', display: 'block', marginBottom: 10 }}>② Vacunación</strong>
          <div className="row">
            <select className="input" value={form.idCampaña} onChange={e => setForm(f => ({ ...f, idCampaña: e.target.value }))}>
              {campañas.map(c => <option key={c.idCampaña} value={c.idCampaña}>{c.nombre}</option>)}
            </select>
            <select className="input" value={form.idLote} onChange={e => setForm(f => ({ ...f, idLote: e.target.value }))}>
              {lotesConVacuna.map(l => (
                <option key={l.idLote} value={l.idLote}>
                  {l.nombreVacuna} — Lote #{l.idLote} (Disp: {l.cantidadDisponible})
                </option>
              ))}
            </select>
          </div>
          <div className="row">
            <select className="input" value={form.dosis} onChange={e => setForm(f => ({ ...f, dosis: e.target.value }))}>
              <option value="1ra">1ra Dosis</option>
              <option value="2da">2da Dosis</option>
              <option value="Refuerzo">Refuerzo</option>
            </select>
            <select className="input" value={form.idPunto} onChange={e => setForm(f => ({ ...f, idPunto: e.target.value }))}>
              <option value="">— Punto de vacunación (opcional) —</option>
              {puntos.map(p => <option key={p.idPunto} value={p.idPunto}>{p.nombre}</option>)}
            </select>
            <input className="input" type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>Aplicador: <strong>{sesion?.nombre || '-'}</strong></span>
          <button className="btn" onClick={registrar}>Registrar dosis aplicada</button>
        </div>
      </div>

      <div className="card">
        <div className="section-head">
          <h2>Vacunaciones registradas</h2>
          <span className="section-badge">{lista.length} registros</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>C.I.</th>
              <th>Edad</th>
              <th>Grupo</th>
              <th>Vacuna</th>
              <th>Dosis</th>
              <th>Lote</th>
              <th>Punto</th>
              <th>Fecha</th>
              <th>Aplicador</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.map((v) => (
              <tr key={v.idVacunacion}>
                <td><strong>{v.paciente?.nombre || '-'}</strong></td>
                <td className="font-mono">{v.paciente?.cedula || '-'}</td>
                <td>{calcularEdad(v.paciente?.fechaNacimiento)}</td>
                <td>
                  {v.paciente?.grupoPriorizado
                    ? <span className="pill pill-act">{v.paciente.grupoPriorizado.nombreGrupo}</span>
                    : <span style={{ color: '#94a3b8' }}>—</span>
                  }
                </td>
                <td><span className="tag-vacuna">{v.lote?.vacuna?.nombre || '-'}</span></td>
                <td>{v.dosis}</td>
                <td>#{v.idLote}</td>
                <td>{v.puntoVacunacion?.nombre || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                <td>{new Date(v.fechaAplicacion).toLocaleDateString()}</td>
                <td>{v.usuarioAplicador?.nombre || '-'}</td>
                <td>
                  <button onClick={() => eliminar(v.idVacunacion)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 13, fontWeight: 600 }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
