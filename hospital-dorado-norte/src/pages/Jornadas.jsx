import { useState, useEffect } from 'react'

export default function Jornadas() {
  const [lista, setLista] = useState([])
  const [campañas, setCampañas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState({ fecha: '', idCampaña: '', implicadosIds: [] })
  const [busqueda, setBusqueda] = useState('')
  const [editandoId, setEditandoId] = useState(null)

  const usuariosFiltrados = usuarios.filter(u => u.nombre.toLowerCase().includes(busqueda.toLowerCase()))

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

      const resUsu = await fetch('http://localhost:5119/api/usuarios')
      if (resUsu.ok) {
        setUsuarios(await resUsu.json())
      }

      if (dataCam.length > 0) {
        setForm({ fecha: new Date().toISOString().split('T')[0], idCampaña: dataCam[0].idCampaña, implicadosIds: [] })
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
          idCampaña: parseInt(form.idCampaña),
          implicadosIds: form.implicadosIds
        })
      })

      if (res.ok) {
        cargarDatos()
        if (campañas.length > 0) {
          setForm({ fecha: new Date().toISOString().split('T')[0], idCampaña: campañas[0].idCampaña, implicadosIds: [] })
        }
      } else {
        const errorData = await res.json()
        alert(errorData.mensaje || 'Error al agregar jornada')
      }
    } catch (error) {
      console.error("Error", error)
    }
  }

  const iniciarEdicion = (jornada) => {
    setEditandoId(jornada.idJornada);
    setForm({
      fecha: jornada.fecha.split('T')[0],
      idCampaña: jornada.idCampaña,
      implicadosIds: jornada.implicados ? jornada.implicados.map(i => i.idUsuario) : []
    });
    setBusqueda('');
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    if (campañas.length > 0) {
      setForm({ fecha: new Date().toISOString().split('T')[0], idCampaña: campañas[0].idCampaña, implicadosIds: [] });
    }
    setBusqueda('');
  };

  const guardarEdicion = async () => {
    if (!form.fecha || !form.idCampaña) return
    
    try {
      const res = await fetch(`http://localhost:5119/api/jornadas/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: form.fecha,
          idCampaña: parseInt(form.idCampaña),
          implicadosIds: form.implicadosIds
        })
      })

      if (res.ok) {
        cancelarEdicion();
        cargarDatos();
      } else {
        if (res.status !== 204) {
           const errorData = await res.json().catch(() => ({}));
           alert(errorData.mensaje || 'Error al editar jornada');
        } else {
           cancelarEdicion();
           cargarDatos();
        }
      }
    } catch (error) {
      console.error("Error", error)
    }
  }

  return (
    <>
      <div className="card">
        <h2>{editandoId ? 'Editar jornada programada' : 'Registrar jornada (RF06)'}</h2>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input className="input" type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
            <select className="input" value={form.idCampaña} onChange={(e) => setForm({ ...form, idCampaña: e.target.value })}>
              {campañas.map((c) => (<option key={c.idCampaña} value={c.idCampaña}>{c.nombre}</option>))}
            </select>
            {editandoId ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn" onClick={guardarEdicion} style={{ flex: 1 }}>Guardar cambios</button>
                <button className="btn" onClick={cancelarEdicion} style={{ flex: 1, backgroundColor: '#94a3b8' }}>Cancelar</button>
              </div>
            ) : (
              <button className="btn" onClick={agregar}>Agregar jornada</button>
            )}
          </div>
          
          <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#f8fafc', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: '600' }}>Personal Implicado</h3>
              <button 
                type="button" 
                style={{ 
                  fontSize: '0.85rem', 
                  padding: '6px 12px', 
                  cursor: 'pointer', 
                  borderRadius: '6px', 
                  border: '1px solid #cbd5e1', 
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  fontWeight: '500',
                  boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
                onClick={() => {
                  if (form.implicadosIds.length === usuarios.length) {
                    setForm({ ...form, implicadosIds: [] })
                  } else {
                    setForm({ ...form, implicadosIds: usuarios.map(u => u.idUsuario) })
                  }
                }}
              >
                {form.implicadosIds.length === usuarios.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </button>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <input 
                type="text" 
                placeholder="Buscar personal..." 
                value={busqueda} 
                onChange={(e) => setBusqueda(e.target.value)} 
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  border: '1px solid #cbd5e1', 
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }} 
              />
            </div>
            
            {form.implicadosIds.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                {form.implicadosIds.map(id => {
                  const u = usuarios.find(x => x.idUsuario === id);
                  if (!u) return null;
                  return (
                    <span key={`pill-${u.idUsuario}`} style={{ 
                      backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '16px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500'
                    }}>
                      {u.nombre}
                      <span 
                        style={{ cursor: 'pointer', fontSize: '1rem', lineHeight: '1' }} 
                        onClick={() => setForm({ ...form, implicadosIds: form.implicadosIds.filter(x => x !== id) })}
                      >
                        ×
                      </span>
                    </span>
                  )
                })}
              </div>
            )}

            <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', paddingRight: '4px' }}>
              {usuariosFiltrados.map(u => (
                <label key={u.idUsuario} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer', 
                  fontSize: '0.85rem',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: form.implicadosIds.includes(u.idUsuario) ? '#38bdf8' : '#e2e8f0',
                  backgroundColor: form.implicadosIds.includes(u.idUsuario) ? '#f0f9ff' : '#ffffff',
                  transition: 'all 0.2s ease',
                  color: form.implicadosIds.includes(u.idUsuario) ? '#0369a1' : '#334155',
                  fontWeight: form.implicadosIds.includes(u.idUsuario) ? '500' : 'normal'
                }}>
                  <input 
                    type="checkbox" 
                    style={{ width: '16px', height: '16px', accentColor: '#0ea5e9', cursor: 'pointer', margin: 0, flexShrink: 0 }}
                    checked={form.implicadosIds.includes(u.idUsuario)}
                    onChange={(e) => {
                      const selected = e.target.checked;
                      if (selected) {
                        setForm({ ...form, implicadosIds: [...form.implicadosIds, u.idUsuario] })
                      } else {
                        setForm({ ...form, implicadosIds: form.implicadosIds.filter(id => id !== u.idUsuario) })
                      }
                    }}
                  />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.nombre}</span>
                </label>
              ))}
              {usuariosFiltrados.length === 0 && <span style={{ color: '#64748b', fontSize: '0.9rem', padding: '1rem', gridColumn: '1 / -1', textAlign: 'center' }}>No hay resultados</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Jornadas programadas</h2>
        <table>
          <thead><tr><th>ID</th><th>Fecha</th><th>Campaña</th><th>Implicados</th><th>Acciones</th></tr></thead>
          <tbody>
            {lista.map((j) => (
              <tr key={j.idJornada} style={editandoId === j.idJornada ? { backgroundColor: '#f0f9ff' } : {}}>
                <td>{j.idJornada}</td>
                <td>{new Date(j.fecha).toLocaleDateString()}</td>
                <td>{j.campaña?.nombre}</td>
                <td>
                  {j.implicados && j.implicados.length > 0 
                    ? j.implicados.map(i => i.nombre).join(', ')
                    : <span style={{ color: '#94a3b8' }}>Ninguno</span>
                  }
                </td>
                <td>
                  <button 
                    onClick={() => iniciarEdicion(j)}
                    style={{
                      padding: '4px 10px', 
                      borderRadius: '4px', 
                      border: '1px solid #0ea5e9', 
                      backgroundColor: editandoId === j.idJornada ? '#0ea5e9' : 'transparent', 
                      color: editandoId === j.idJornada ? '#fff' : '#0ea5e9', 
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {editandoId === j.idJornada ? 'Editando...' : 'Editar'}
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
