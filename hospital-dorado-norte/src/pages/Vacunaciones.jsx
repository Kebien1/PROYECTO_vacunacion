import { useState, useEffect } from 'react'
import { useAuth } from '../auth.jsx'
import jsPDF from 'jspdf'
import logoUrl from '../../public/LOGO.png'

const formatearNombre = (nombre) => {
  return nombre.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
}

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
    nuevoPaciente: true,
    pacNombre: '', pacCedula: '', pacFechaNac: '', pacSexo: 'M', pacIdGrupo: ''
  })
  const [busquedaCedula, setBusquedaCedula] = useState('')
  const [filtroTabla, setFiltroTabla] = useState('')
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

    const fechaNac = new Date(form.pacFechaNac + 'T00:00:00');
    const hoy = new Date();
    if (fechaNac > hoy) {
      setMensaje({ tipo: 'error', texto: 'La fecha de nacimiento no puede ser en el futuro' })
      return null;
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

    const hoyStr = new Date().toISOString().split('T')[0];
    if (form.fecha !== hoyStr) {
      setMensaje({ tipo: 'error', texto: 'Solo se puede registrar la vacunación con la fecha actual' });
      return;
    }

    // --- VALIDACIONES DE NEGOCIO ---
    const loteOrig = lotes.find(l => l.idLote === parseInt(form.idLote));
    if (loteOrig) {
      if (loteOrig.cantidadDisponible <= 0) {
        setMensaje({ tipo: 'error', texto: 'El lote seleccionado no tiene stock disponible' });
        return;
      }
      
      const hoyCalc = new Date();
      hoyCalc.setHours(0,0,0,0);
      const venc = new Date(loteOrig.fechaVencimiento);
      if (venc < hoyCalc) {
        setMensaje({ tipo: 'error', texto: 'El lote seleccionado ya se encuentra vencido' });
        return;
      }

      // Obtener el nombre de la vacuna
      const vac = vacunas.find(v => v.idVacuna === loteOrig.idVacuna);
      const nombreVac = vac ? vac.nombre.toUpperCase() : '';

      // Calculo de edad para validar vacunas
      let fechaNacString = form.nuevoPaciente ? form.pacFechaNac : (pacienteEncontrado?.fechaNacimiento || null);
      if (!fechaNacString) {
        const pac = pacientes.find(p => p.idPaciente === parseInt(idPacienteFinal));
        if (pac) fechaNacString = pac.fechaNacimiento;
      }

      if (fechaNacString) {
        const nac = new Date(fechaNacString);
        let mesesEdad = (hoyCalc.getFullYear() - nac.getFullYear()) * 12 + hoyCalc.getMonth() - nac.getMonth();
        if (hoyCalc.getDate() < nac.getDate()) mesesEdad--;
        const anosEdad = mesesEdad / 12;

        if (anosEdad > 120) {
          setMensaje({ tipo: 'error', texto: 'Edad del paciente no válida (verifique la fecha de nacimiento)' });
          return;
        }

        // Reglas de vacunas específicas
        if (nombreVac === 'SR' || nombreVac.includes(' SR ') || nombreVac.endsWith(' SR') || nombreVac.startsWith('SR ')) {
           if (anosEdad < 10 || anosEdad >= 15) { // 10 a 14 años (hasta 14.99)
             setMensaje({ tipo: 'error', texto: 'La vacuna SR es solo para adolescentes de 10 a 14 años' });
             return;
           }
        } else if (nombreVac.includes('SRP')) {
           if (anosEdad < 1 || anosEdad >= 10) { // 1 a 9 años (hasta 9.99)
             setMensaje({ tipo: 'error', texto: 'La vacuna SRP es solo para niños de 1 a 9 años' });
             return;
           }
        } else if (nombreVac.includes('INFLUENZA')) {
           if (mesesEdad < 6) {
             setMensaje({ tipo: 'error', texto: 'La vacuna INFLUENZA es para mayores de 6 meses' });
             return;
           }
        }
      }
    }
    // --- FIN VALIDACIONES DE NEGOCIO ---

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
        const nuevaVac = await res.json()
        setMensaje({ tipo: 'ok', texto: '✓ Vacunación registrada correctamente. Generando carnet...' })

        // Obtener la vacunación completa con relaciones para el carnet
        try {
          const resDetalle = await fetch(`http://localhost:5119/api/vacunaciones/${nuevaVac.idVacunacion || nuevaVac.IdVacunacion}`)
          if (resDetalle.ok) {
            const vacCompleta = await resDetalle.json()
            generarCarnetPDF(vacCompleta)
          }
        } catch (e) {
          console.error('No se pudo generar el carnet automáticamente', e)
        }

        setPacienteEncontrado(null)
        setBusquedaCedula('')
        setForm(f => ({
          ...f, idPaciente: '', nuevoPaciente: true,
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

  // ==========================================
  // GENERADOR DE CARNET DE VACUNACIÓN PDF
  // ==========================================
  const generarCarnetPDF = async (vacunacion) => {
    const pac = vacunacion.paciente
    const loteInfo = vacunacion.lote
    const vacunaInfo = loteInfo?.vacuna
    const campanaInfo = vacunacion.campaña || campañas.find(c => c.idCampaña === vacunacion.idCampaña)
    const puntoInfo = vacunacion.puntoVacunacion
    const aplicador = vacunacion.usuarioAplicador
    const fechaApp = new Date(vacunacion.fechaAplicacion)

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' })
    const W = 148 // A5 width
    const H = 210 // A5 height

    // Colors
    const PRIMARY = [3, 58, 96]       // #033A60
    const SECONDARY = [2, 132, 199]   // #0284C7
    const DARK = [15, 23, 42]         // #0F172A
    const MUTED = [100, 116, 139]     // #64748B
    const LIGHT_BG = [248, 250, 252]  // #F8FAFC
    const WHITE = [255, 255, 255]
    const ACCENT = [5, 150, 105]      // #059669
    const GOLD = [180, 140, 50]

    // Unique verification code
    const codigoVerificacion = `VAC-${vacunacion.idVacunacion.toString().padStart(6, '0')}-${fechaApp.getFullYear()}`

    // ── TOP BANNER ──
    doc.setFillColor(...PRIMARY)
    doc.rect(0, 0, W, 32, 'F')

    // Subtle gradient overlay
    doc.setFillColor(2, 43, 71)
    doc.rect(0, 26, W, 6, 'F')

    // Logo image
    try {
      const logoData = await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          const maxSize = 400
          const scale = Math.min(maxSize / img.width, maxSize / img.height)
          const canvas = document.createElement('canvas')
          canvas.width = img.width * scale
          canvas.height = img.height * scale
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          
          // Hacemos el fondo blanco transparente para que los márgenes no tapen el banner
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imgData.data
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) {
              data[i+3] = 0 // Alpha to 0 (transparent)
            }
          }
          ctx.putImageData(imgData, 0, 0)
          
          resolve({ url: canvas.toDataURL('image/png'), ratio: img.width / img.height })
        }
        img.onerror = (err) => { 
          console.error('Error cargando logo:', err)
          reject(new Error('No se pudo cargar la imagen del logo')) 
        }
        img.src = logoUrl
      })
      
      // Fondo blanco redondeado (esto es lo que dará el contraste a las letras oscuras)
      doc.setFillColor(...WHITE)
      doc.roundedRect(4, 2, 28, 28, 3, 3, 'F')
      
      // Dibujamos la imagen MUCHO MÁS GRANDE (38x38) porque la imagen original tiene 
      // mucho margen blanco en blanco. Como el fondo ahora es transparente, 
      // el margen no tapará el banner azul.
      let maxW = 38
      let maxH = 38
      let w = maxW
      let h = maxH
      if (logoData.ratio > 1) {
        h = maxW / logoData.ratio
      } else {
        w = maxH * logoData.ratio
      }
      
      // Centramos la imagen sobre el recuadro blanco (cuyo centro es X:18, Y:16)
      const x = 18 - (w / 2)
      const y = 16 - (h / 2)
      
      doc.addImage(logoData.url, 'PNG', x, y, w, h)
    } catch (e) {
      console.error(e)
      // Fallback: draw a simple placeholder if logo fails
      doc.setFillColor(...WHITE)
      doc.roundedRect(8, 5, 22, 22, 3, 3, 'F')
      doc.setFontSize(7)
      doc.setTextColor(...PRIMARY)
      doc.text('LOGO', 19, 17, { align: 'center' })
    }

    // Institution name
    doc.setTextColor(...WHITE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text('CENTRO DE SALUD', 35, 11)
    doc.setFontSize(15)
    doc.text('DORADO NORTE', 35, 18)

    // Subtitle
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(180, 210, 240)
    doc.text('Salud Pública — Estado Plurinacional de Bolivia', 35, 24)

    // Document title ribbon
    doc.setFillColor(...SECONDARY)
    doc.roundedRect(W / 2 - 42, 29, 84, 9, 2, 2, 'F')
    doc.setTextColor(...WHITE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('CARNET DE VACUNACIÓN', W / 2, 35, { align: 'center' })

    // ── VERIFICATION CODE BAR ──
    doc.setFillColor(...LIGHT_BG)
    doc.roundedRect(8, 41, W - 16, 10, 2, 2, 'F')
    doc.setDrawColor(203, 213, 225)
    doc.setLineWidth(0.3)
    doc.roundedRect(8, 41, W - 16, 10, 2, 2, 'S')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...MUTED)
    doc.text('Código de Verificación:', 12, 47)
    doc.setFont('courier', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...PRIMARY)
    doc.text(codigoVerificacion, 52, 47)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(...MUTED)
    const fechaEmision = new Date()
    doc.text(`Emisión: ${fechaEmision.toLocaleDateString('es-BO')} ${fechaEmision.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, W - 12, 47, { align: 'right' })

    // ── PATIENT DATA SECTION ──
    let y = 56
    doc.setFillColor(...PRIMARY)
    doc.roundedRect(8, y, W - 16, 7, 1.5, 1.5, 'F')
    doc.setTextColor(...WHITE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text('DATOS DEL PACIENTE', 12, y + 5)

    y += 10
    const boxY = y
    doc.setFillColor(...LIGHT_BG)
    doc.roundedRect(8, boxY, W - 16, 32, 2, 2, 'F')
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.3)
    doc.roundedRect(8, boxY, W - 16, 32, 2, 2, 'S')

    const labelStyle = () => { doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...MUTED) }
    const valueStyle = () => { doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...DARK) }

    // Row 1
    labelStyle(); doc.text('Nombre Completo:', 12, y + 5)
    valueStyle(); doc.text(pac?.nombre || '-', 46, y + 5)

    // Row 2
    y += 8
    labelStyle(); doc.text('C.I. / Documento:', 12, y + 5)
    valueStyle(); doc.text(pac?.cedula || '-', 46, y + 5)

    labelStyle(); doc.text('Sexo:', 85, y + 5)
    valueStyle(); doc.text(pac?.sexo === 'M' ? 'Masculino' : pac?.sexo === 'F' ? 'Femenino' : '-', 96, y + 5)

    // Row 3
    y += 8
    labelStyle(); doc.text('Fecha de Nacimiento:', 12, y + 5)
    valueStyle()
    const fechaNacStr = pac?.fechaNacimiento ? new Date(pac.fechaNacimiento).toLocaleDateString('es-BO') : '-'
    doc.text(fechaNacStr, 50, y + 5)

    labelStyle(); doc.text('Edad:', 85, y + 5)
    valueStyle(); doc.text(calcularEdad(pac?.fechaNacimiento), 96, y + 5)

    // Row 4
    y += 8
    labelStyle(); doc.text('Grupo Priorizado:', 12, y + 5)
    valueStyle(); doc.text(pac?.grupoPriorizado?.nombreGrupo || 'General', 46, y + 5)

    // ── VACCINATION DATA SECTION ──
    y = boxY + 36
    doc.setFillColor(...ACCENT)
    doc.roundedRect(8, y, W - 16, 7, 1.5, 1.5, 'F')
    doc.setTextColor(...WHITE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text('DATOS DE LA VACUNACIÓN', 12, y + 5)

    y += 10
    const vacBoxY = y
    doc.setFillColor(240, 253, 244) // green-50
    doc.roundedRect(8, vacBoxY, W - 16, 32, 2, 2, 'F')
    doc.setDrawColor(167, 243, 208)
    doc.setLineWidth(0.3)
    doc.roundedRect(8, vacBoxY, W - 16, 32, 2, 2, 'S')

    // Row 1 - Vacuna
    labelStyle(); doc.text('Vacuna Aplicada:', 12, y + 5)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...ACCENT)
    doc.text(vacunaInfo?.nombre || '-', 46, y + 5)

    // Row 2 - Dosis and Lote
    y += 8
    labelStyle(); doc.text('Dosis:', 12, y + 5)
    valueStyle(); doc.text(vacunacion.dosis || '-', 46, y + 5)

    labelStyle(); doc.text('N° Lote:', 85, y + 5)
    doc.setFont('courier', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...DARK)
    doc.text(`LOTE-${vacunacion.idLote}`, 103, y + 5)

    // Row 3 - Fecha and Campaña
    y += 8
    labelStyle(); doc.text('Fecha de Aplicación:', 12, y + 5)
    valueStyle(); doc.text(fechaApp.toLocaleDateString('es-BO'), 50, y + 5)

    labelStyle(); doc.text('Campaña:', 85, y + 5)
    valueStyle(); doc.text(campanaInfo?.nombre || '-', 103, y + 5)

    // Row 4 - Punto
    y += 8
    labelStyle(); doc.text('Punto de Vacunación:', 12, y + 5)
    valueStyle(); doc.text(puntoInfo?.nombre || 'Centro de Salud Dorado Norte', 50, y + 5)

    // ── APPLICATOR & SIGNATURES ──
    y = vacBoxY + 36
    doc.setFillColor(30, 58, 95)
    doc.roundedRect(8, y, W - 16, 7, 1.5, 1.5, 'F')
    doc.setTextColor(...WHITE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text('PROFESIONAL RESPONSABLE', 12, y + 5)

    y += 10
    labelStyle(); doc.text('Aplicador:', 12, y + 4)
    valueStyle(); doc.text(aplicador?.nombre || sesion?.nombre || '-', 46, y + 4)

    // Signature lines
    y += 14
    doc.setDrawColor(...MUTED)
    doc.setLineWidth(0.4)

    // Left signature
    doc.line(14, y, 62, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(...MUTED)
    doc.text('Firma del Profesional de Salud', 38, y + 4, { align: 'center' })

    // Right signature
    doc.line(82, y, 134, y)
    doc.text('Sello del Centro de Salud', 108, y + 4, { align: 'center' })

    // ── FOOTER NOTES ──
    y += 12
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.3)
    doc.line(8, y, W - 8, y)

    y += 4
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(5.5)
    doc.setTextColor(...MUTED)
    const notas = [
      'Este documento certifica la aplicación de la vacuna indicada al paciente identificado.',
      'Conserve este carnet como comprobante oficial. Preséntelo en su próxima cita de vacunación.',
      'En caso de reacciones adversas, acuda inmediatamente al centro de salud más cercano.',
      `Documento generado electrónicamente por el SGCV — ${codigoVerificacion}`
    ]
    notas.forEach((nota, i) => {
      doc.text(`• ${nota}`, 10, y + (i * 4))
    })

    // Bottom decorative bar
    doc.setFillColor(...PRIMARY)
    doc.rect(0, H - 6, W, 6, 'F')
    doc.setFontSize(5)
    doc.setTextColor(...WHITE)
    doc.text('Centro de Salud Dorado Norte — Salud Pública — Bolivia', W / 2, H - 2, { align: 'center' })

    // Save
    const nombreArchivo = `Carnet_Vacunacion_${(pac?.nombre || 'paciente').replace(/\s+/g, '_')}_${codigoVerificacion}.pdf`
    doc.save(nombreArchivo)
  }

  // Filtrar lotes por vacuna seleccionada (opcional)
  const lotesConVacuna = lotes.map(l => {
    const vac = vacunas.find(v => v.idVacuna === l.idVacuna)
    return { ...l, nombreVacuna: vac ? vac.nombre : `Vacuna ${l.idVacuna}` }
  })

  // Preparar estado de opciones de lotes para la UI (disabled, motivo)
  let edadAnosRender = 0;
  let edadMesesRender = 0;
  let pacienteTieneEdad = false;
  
  let fechaNacRender = form.nuevoPaciente ? form.pacFechaNac : (pacienteEncontrado?.fechaNacimiento || null);
  if (!fechaNacRender && form.idPaciente && !form.nuevoPaciente) {
    const pac = pacientes.find(p => p.idPaciente === parseInt(form.idPaciente));
    if (pac) fechaNacRender = pac.fechaNacimiento;
  }

  if (fechaNacRender) {
    const hoyCalc = new Date();
    const nac = new Date(fechaNacRender);
    edadMesesRender = (hoyCalc.getFullYear() - nac.getFullYear()) * 12 + hoyCalc.getMonth() - nac.getMonth();
    if (hoyCalc.getDate() < nac.getDate()) edadMesesRender--;
    edadAnosRender = edadMesesRender / 12;
    pacienteTieneEdad = true;
  }

  const hoyRender = new Date();
  hoyRender.setHours(0,0,0,0);

  const lotesRender = lotesConVacuna.map(l => {
    let disabled = false;
    let motivo = '';
    
    if (l.cantidadDisponible <= 0) {
      disabled = true;
      motivo = ' Agotado';
    } else {
      const venc = new Date(l.fechaVencimiento);
      if (venc < hoyRender) {
        disabled = true;
        motivo = ' Vencido';
      } else if (pacienteTieneEdad) {
        const nombreVac = l.nombreVacuna.toUpperCase();
        if (nombreVac === 'SR' || nombreVac.includes(' SR ') || nombreVac.endsWith(' SR') || nombreVac.startsWith('SR ')) {
           if (edadAnosRender < 10 || edadAnosRender >= 15) { disabled = true; motivo = ' Edad no válida'; }
        } else if (nombreVac.includes('SRP')) {
           if (edadAnosRender < 1 || edadAnosRender >= 10) { disabled = true; motivo = ' Edad no válida'; }
        } else if (nombreVac.includes('INFLUENZA')) {
           if (edadMesesRender < 6) { disabled = true; motivo = ' Edad no válida'; }
        }
      }
    }
    return { ...l, disabled, motivo };
  });

  const listaFiltrada = lista.filter(v => {
    if (!filtroTabla.trim()) return true;
    const term = filtroTabla.toLowerCase();
    const nombre = v.paciente?.nombre?.toLowerCase() || '';
    const cedula = v.paciente?.cedula || '';
    return nombre.includes(term) || cedula.includes(term);
  });

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
              <input type="checkbox" checked={!form.nuevoPaciente} onChange={e => { setForm(f => ({ ...f, nuevoPaciente: !e.target.checked })); setPacienteEncontrado(null) }} />
              Paciente registrado
            </label>
          </div>

          {!form.nuevoPaciente ? (
            <>
              {!pacienteEncontrado ? (
                <div style={{ position: 'relative' }}>
                  <input 
                    className="input" 
                    placeholder="Buscar paciente por Nombre o C.I..." 
                    value={busquedaCedula}
                    onChange={e => setBusquedaCedula(e.target.value)}
                    autoComplete="off"
                  />
                  {busquedaCedula.trim().length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: 6, maxHeight: 200, overflowY: 'auto', zIndex: 10, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginTop: 4 }}>
                      {pacientes.filter(p => p.nombre.toLowerCase().includes(busquedaCedula.toLowerCase()) || p.cedula.includes(busquedaCedula)).slice(0, 20).map(p => (
                        <div 
                          key={p.idPaciente} 
                          style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: 13, color: '#334155' }}
                          onClick={() => {
                            setPacienteEncontrado(p)
                            setForm(f => ({ ...f, idPaciente: p.idPaciente }))
                            setBusquedaCedula('')
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <strong>{p.nombre}</strong> — C.I.: {p.cedula}
                        </div>
                      ))}
                      {pacientes.filter(p => p.nombre.toLowerCase().includes(busquedaCedula.toLowerCase()) || p.cedula.includes(busquedaCedula)).length === 0 && (
                         <div style={{ padding: '8px 12px', fontSize: 13, color: '#64748b' }}>No se encontraron coincidencias.</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, padding: '10px 12px', background: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                  <div style={{ color: '#065f46' }}>
                    <strong>{pacienteEncontrado.nombre}</strong> — C.I.: {pacienteEncontrado.cedula} — {calcularEdad(pacienteEncontrado.fechaNacimiento)} — {pacienteEncontrado.sexo === 'M' ? 'Masculino' : 'Femenino'}
                    {pacienteEncontrado.grupoPriorizado && <span> — Grupo: {pacienteEncontrado.grupoPriorizado.nombreGrupo}</span>}
                  </div>
                  <button onClick={() => { setPacienteEncontrado(null); setForm(f => ({ ...f, idPaciente: '' })) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#059669', fontWeight: 600, fontSize: 12 }}>
                    Cambiar paciente
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="row">
                <input className="input" placeholder="Nombre completo" value={form.pacNombre} onChange={e => setForm(f => ({ ...f, pacNombre: formatearNombre(e.target.value) }))} />
                <input className="input" placeholder="Cédula / C.I." value={form.pacCedula} onChange={e => setForm(f => ({ ...f, pacCedula: e.target.value.toUpperCase().replace(/[^0-9A-Z-]/g, '') }))} />
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
              <option value="">— Seleccione Lote / Vacuna —</option>
              {lotesRender.map(l => (
                <option key={l.idLote} value={l.idLote} disabled={l.disabled} style={{ color: l.disabled ? '#dc2626' : 'inherit', fontWeight: l.disabled ? 'bold' : 'normal' }}>
                  {l.nombreVacuna} — Lote #{l.idLote} (Disp: {l.cantidadDisponible}) {l.motivo}
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
            <input 
              className="input" 
              type="date" 
              value={form.fecha} 
              onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} 
              min={new Date().toISOString().split('T')[0]} 
              max={new Date().toISOString().split('T')[0]} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>Aplicador: <strong>{sesion?.nombre || '-'}</strong></span>
          <button className="btn" onClick={registrar}>Registrar dosis aplicada</button>
        </div>
      </div>

      <div className="card">
        <div className="section-head" style={{ marginBottom: 15, display: 'flex', flexWrap: 'wrap', gap: 15, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ margin: 0 }}>Vacunaciones registradas</h2>
            <span className="section-badge">{listaFiltrada.length} registros</span>
          </div>
          <input 
            className="input" 
            placeholder="Buscar registro por Nombre o C.I..." 
            value={filtroTabla}
            onChange={e => setFiltroTabla(e.target.value)}
            style={{ maxWidth: 350, margin: 0, padding: '8px 12px' }}
          />
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
            {listaFiltrada.map((v) => (
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
                <td style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button onClick={() => generarCarnetPDF(v)} title="Descargar carnet de vacunación" style={{ background: 'none', border: '1px solid #0284c7', borderRadius: 6, cursor: 'pointer', color: '#0284c7', fontSize: 12, fontWeight: 600, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="11" x2="12" y2="17"/><polyline points="9 14 12 17 15 14"/></svg>
                    Carnet
                  </button>
                  <button onClick={() => eliminar(v.idVacunacion)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 12, fontWeight: 600 }}>
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
