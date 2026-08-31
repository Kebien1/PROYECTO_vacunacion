import React, { useState, useEffect, Fragment } from 'react'

export default function VacunasStock() {
  const [lista, setLista] = useState([])
  const [vacunas, setVacunas] = useState([])
  const [form, setForm] = useState({ 
    idVacuna: '', 
    codigoLote: '', 
    cantidadDisponible: '', 
    stockMinimo: '', 
    fechaVencimiento: '2026-12-31' 
  })

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
        setForm(f => ({ ...f, codigoLote: '', cantidadDisponible: '', stockMinimo: '' }))
      } else {
        const errorData = await res.json()
        alert(errorData.mensaje || 'Error al agregar lote')
      }
    } catch (error) {
      console.error("Error", error)
    }
  }

  // Agrupar lotes por vacuna
  const lotesAgrupados = Object.values(lista.reduce((acc, l) => {
    const idVac = l.idVacuna;
    if (!acc[idVac]) {
      acc[idVac] = {
        idVacuna: idVac,
        nombre: l.vacuna?.nombre || `Vacuna ${idVac}`,
        lotes: [],
        totalInicial: 0,
        totalUsadas: 0,
        totalDisponible: 0,
        totalMinimo: 0
      };
    }
    acc[idVac].lotes.push(l);
    // Asumiendo valores iniciales (ya que el backend no tiene 'usadas' ni 'minimo')
    acc[idVac].totalDisponible += l.cantidadDisponible;
    acc[idVac].totalInicial += l.cantidadDisponible; 
    return acc;
  }, {}));

  return (
    <>
      <div className="card">
        <h2 style={{ marginBottom: 15, fontSize: 16 }}>Ingresar lote / existencia (RF04)</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 15 }}>
          <select className="input" style={{ flex: '1 1 200px', margin: 0 }} value={form.idVacuna} onChange={(e) => setForm({ ...form, idVacuna: e.target.value })}>
            {vacunas.map((v) => (<option key={v.idVacuna} value={v.idVacuna}>{v.nombre}</option>))}
          </select>
          <input className="input" style={{ flex: '1 1 180px', margin: 0 }} type="text" value={form.codigoLote} onChange={(e) => setForm({ ...form, codigoLote: e.target.value })} placeholder="Código de lote (ej. SR01026)" />
          <input className="input" style={{ flex: '1 1 120px', margin: 0 }} type="number" value={form.cantidadDisponible} onChange={(e) => setForm({ ...form, cantidadDisponible: e.target.value })} placeholder="Cantidad" />
          <input className="input" style={{ flex: '1 1 120px', margin: 0 }} type="number" value={form.stockMinimo} onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })} placeholder="Stock mínimo" />
          <input className="input" style={{ flex: '1 1 150px', margin: 0 }} type="date" value={form.fechaVencimiento} onChange={(e) => setForm({ ...form, fechaVencimiento: e.target.value })} />
        </div>
        <button className="btn" onClick={agregar} style={{ width: 'fit-content' }}>Registrar lote</button>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: 15, fontSize: 16 }}>Stock de vacunas y lotes</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 8px', fontWeight: 600 }}>Vacuna</th>
                <th style={{ padding: '12px 8px', fontWeight: 600 }}>Lote</th>
                <th style={{ padding: '12px 8px', fontWeight: 600 }}>Inicial</th>
                <th style={{ padding: '12px 8px', fontWeight: 600 }}>Usadas</th>
                <th style={{ padding: '12px 8px', fontWeight: 600 }}>Disponible</th>
                <th style={{ padding: '12px 8px', fontWeight: 600 }}>Mínimo</th>
                <th style={{ padding: '12px 8px', fontWeight: 600 }}>Vencimiento</th>
                <th style={{ padding: '12px 8px', fontWeight: 600 }}>Última modificación</th>
                <th style={{ padding: '12px 8px', fontWeight: 600 }}>Estado</th>
                <th style={{ padding: '12px 8px', fontWeight: 600 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lotesAgrupados.map((grupo) => (
                <React.Fragment key={`grupo-${grupo.idVacuna}`}>
                  {grupo.lotes.map((l) => (
                    <tr key={l.idLote} style={{ borderBottom: '1px solid #f1f5f9', color: '#475569' }}>
                      <td style={{ padding: '12px 8px' }}>{grupo.nombre}</td>
                      <td style={{ padding: '12px 8px', fontWeight: 500 }}>LOTE-{l.idLote}</td>
                      <td style={{ padding: '12px 8px' }}>{l.cantidadDisponible}</td>
                      <td style={{ padding: '12px 8px' }}>0</td>
                      <td style={{ padding: '12px 8px' }}>{l.cantidadDisponible}</td>
                      <td style={{ padding: '12px 8px' }}>0</td>
                      <td style={{ padding: '12px 8px' }}>{new Date(l.fechaVencimiento).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 8px' }}>{new Date().toLocaleDateString()}</td>
                      <td style={{ padding: '12px 8px' }}><span style={{ color: '#059669', fontSize: 12, fontWeight: 500 }}>Registrado</span></td>
                      <td style={{ padding: '12px 8px', display: 'flex', gap: 6 }}>
                        <button style={{ background: '#0284c7', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>Editar</button>
                        <button style={{ background: '#0284c7', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: '#f0fdfa', fontWeight: 'bold', color: '#0f766e', borderBottom: '2px solid #99f6e4' }}>
                    <td style={{ padding: '12px 8px' }}>Total {grupo.nombre}</td>
                    <td style={{ padding: '12px 8px' }}></td>
                    <td style={{ padding: '12px 8px' }}>{grupo.totalInicial}</td>
                    <td style={{ padding: '12px 8px' }}>{grupo.totalUsadas}</td>
                    <td style={{ padding: '12px 8px' }}>{grupo.totalDisponible}</td>
                    <td style={{ padding: '12px 8px' }}>{grupo.totalMinimo}</td>
                    <td colSpan="4"></td>
                  </tr>
                </React.Fragment>
              ))}
              {lotesAgrupados.length === 0 && (
                <tr>
                  <td colSpan="10" style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>No hay lotes registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
