import React, { useState } from 'react'
import { campanaActiva, lotes, vacunaciones, jornadas, usuarios, calcularAlertas } from '../data/mock.js'
import ExcelJS from 'exceljs'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function Reportes() {
  const [tipoReporte, setTipoReporte] = useState('completo')
  const [tabActiva, setTabActiva] = useState('vacunaciones')

  const meta = campanaActiva.meta
  const totalDosisAplicadas = vacunaciones.length * 400
  const porcentajeCobertura = Math.round((totalDosisAplicadas / meta) * 100)
  const stockDisponibleTotal = lotes.reduce((sum, l) => sum + l.cantidad, 0)
  const alertasLotes = calcularAlertas()

  // Conteo por tipo de vacuna aplicada
  const vacunasSR = vacunaciones.filter(v => v.vacuna === 'SR').length * 400
  const vacunasSRP = vacunaciones.filter(v => v.vacuna === 'SRP').length * 400

  // ==========================================
  // EXPORTACIÓN A EXCEL PROFESIONAL CON EXCELJS
  // ==========================================
  async function exportarExcel() {
    try {
      const workbook = new ExcelJS.Workbook()
      workbook.creator = 'Centro de Salud Dorado Norte'
      workbook.lastModifiedBy = 'Sistema SGCV'
      workbook.created = new Date()

      // Paleta institucional
      const PRIMARY_HEX = '033A60' // Azul marino institucional
      const SECONDARY_HEX = '0284C7' // Azul cielo
      const LIGHT_BG_HEX = 'F8FAFC' // Fondo gris suave
      const BORDER_HEX = 'CBD5E1' // Gris borde
      const WHITE_HEX = 'FFFFFF'
      const DANGER_HEX = 'DC2626'
      const SUCCESS_HEX = '16A34A'

      const headerFill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: PRIMARY_HEX }
      }
      const headerFont = {
        name: 'Segoe UI',
        size: 11,
        bold: true,
        color: { argb: WHITE_HEX }
      }
      const subHeaderFill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: SECONDARY_HEX }
      }
      const standardBorder = {
        top: { style: 'thin', color: { argb: BORDER_HEX } },
        left: { style: 'thin', color: { argb: BORDER_HEX } },
        bottom: { style: 'thin', color: { argb: BORDER_HEX } },
        right: { style: 'thin', color: { argb: BORDER_HEX } }
      }

      // -------------------------------------------------------------
      // HOJA 1: RESUMEN EJECUTIVO Y ESTADÍSTICAS
      // -------------------------------------------------------------
      const wsResumen = workbook.addWorksheet('Resumen Ejecutivo', {
        views: [{ showGridLines: true }]
      })

      wsResumen.columns = [
        { width: 28 },
        { width: 24 },
        { width: 18 },
        { width: 22 }
      ]

      // Banner Superior
      wsResumen.mergeCells('A1:D1')
      const titleCell = wsResumen.getCell('A1')
      titleCell.value = 'CENTRO DE SALUD DORADO NORTE'
      titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: WHITE_HEX } }
      titleCell.fill = headerFill
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
      wsResumen.getRow(1).height = 32

      wsResumen.mergeCells('A2:D2')
      const subTitleCell = wsResumen.getCell('A2')
      subTitleCell.value = 'SISTEMA DE GESTIÓN Y CONTROL DE VACUNACIÓN - INFORME CONSOLIDADO'
      subTitleCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: WHITE_HEX } }
      subTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '022B47' } }
      subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' }
      wsResumen.getRow(2).height = 20

      // Metadatos
      wsResumen.addRow([])
      const rowFecha = wsResumen.addRow(['Fecha de Generación:', new Date().toLocaleDateString('es-ES'), 'Hora:', new Date().toLocaleTimeString()])
      rowFecha.font = { name: 'Segoe UI', size: 10, bold: true }

      const rowCamp = wsResumen.addRow(['Campaña Activa:', campanaActiva.nombre, 'Periodo:', campanaActiva.periodo])
      rowCamp.font = { name: 'Segoe UI', size: 10 }

      const rowEstado = wsResumen.addRow(['Estado de Campaña:', campanaActiva.estado, 'Meta Global:', `${meta.toLocaleString()} personas`])
      rowEstado.font = { name: 'Segoe UI', size: 10 }

      wsResumen.addRow([])

      // Tabla Indicadores Clave
      const rowHeadKPI = wsResumen.addRow(['INDICADOR GENERAL', 'VALOR CONSOLIDADO', 'UNIDAD', 'ESTADO'])
      rowHeadKPI.font = headerFont
      rowHeadKPI.alignment = { horizontal: 'center', vertical: 'middle' }
      rowHeadKPI.eachCell(c => {
        c.fill = headerFill
        c.border = standardBorder
      })
      rowHeadKPI.height = 24

      const kpis = [
        ['Población Meta Establecida', meta, 'Personas', '100% Meta'],
        ['Total Dosis Aplicadas (Estimado)', totalDosisAplicadas, 'Dosis', `${porcentajeCobertura}% Cobertura`],
        ['Cobertura General Alcanzada', `${porcentajeCobertura}%`, 'Porcentaje', porcentajeCobertura >= 80 ? 'Meta Alta' : 'En Progreso'],
        ['Inventario Total en Almacén', stockDisponibleTotal, 'Unidades', stockDisponibleTotal > 1000 ? 'Suficiente' : 'Alerta'],
        ['Total Lotes Activos', lotes.length, 'Lotes', `${alertasLotes.length} con alerta`],
        ['Dosis Aplicadas Vacuna SR', vacunasSR, 'Dosis', 'Monodosis'],
        ['Dosis Aplicadas Vacuna SRP', vacunasSRP, 'Dosis', 'Trivalente']
      ]

      kpis.forEach(item => {
        const r = wsResumen.addRow(item)
        r.font = { name: 'Segoe UI', size: 10 }
        r.eachCell(c => {
          c.border = standardBorder
        })
      })

      // -------------------------------------------------------------
      // HOJA 2: REGISTRO NOMINAL DE VACUNACIONES
      // -------------------------------------------------------------
      const wsVac = workbook.addWorksheet('Registro de Vacunaciones', {
        views: [{ showGridLines: true }]
      })

      wsVac.columns = [
        { width: 8 },
        { width: 26 },
        { width: 16 },
        { width: 20 },
        { width: 14 },
        { width: 12 },
        { width: 18 },
        { width: 16 }
      ]

      wsVac.mergeCells('A1:H1')
      const h1Vac = wsVac.getCell('A1')
      h1Vac.value = 'REGISTRO NOMINAL DETALLADO DE VACUNACIONES APLICADAS'
      h1Vac.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: WHITE_HEX } }
      h1Vac.fill = headerFill
      h1Vac.alignment = { horizontal: 'center', vertical: 'middle' }
      wsVac.getRow(1).height = 28

      const rowHeadVac = wsVac.addRow([
        'N°', 'PACIENTE', 'C.I. / DOCUMENTO', 'GRUPO ETARIO', 'VACUNA', 'DOSIS', 'LOTE ASIGNADO', 'FECHA'
      ])
      rowHeadVac.font = headerFont
      rowHeadVac.alignment = { horizontal: 'center', vertical: 'middle' }
      rowHeadVac.eachCell(c => {
        c.fill = subHeaderFill
        c.border = standardBorder
      })
      rowHeadVac.height = 22

      vacunaciones.forEach((v, index) => {
        const r = wsVac.addRow([
          index + 1,
          v.persona,
          v.ci,
          v.grupo,
          v.vacuna,
          v.dosis,
          v.lote,
          v.fecha
        ])
        r.font = { name: 'Segoe UI', size: 10 }
        r.eachCell((c, colIndex) => {
          c.border = standardBorder
          if (colIndex === 1 || colIndex === 5 || colIndex === 6 || colIndex === 8) {
            c.alignment = { horizontal: 'center' }
          }
        })
      })

      // -------------------------------------------------------------
      // HOJA 3: INVENTARIO DE LOTES Y BIOLÓGICOS
      // -------------------------------------------------------------
      const wsLotes = workbook.addWorksheet('Inventario de Lotes', {
        views: [{ showGridLines: true }]
      })

      wsLotes.columns = [
        { width: 18 },
        { width: 16 },
        { width: 18 },
        { width: 18 },
        { width: 20 },
        { width: 22 }
      ]

      wsLotes.mergeCells('A1:F1')
      const h1Lotes = wsLotes.getCell('A1')
      h1Lotes.value = 'ESTADO DE STOCK, INVENTARIO Y VENCIMIENTO DE LOTES'
      h1Lotes.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: WHITE_HEX } }
      h1Lotes.fill = headerFill
      h1Lotes.alignment = { horizontal: 'center', vertical: 'middle' }
      wsLotes.getRow(1).height = 28

      const rowHeadLotes = wsLotes.addRow([
        'CÓDIGO LOTE', 'VACUNA', 'STOCK ACTUAL', 'STOCK MÍNIMO', 'VENCIMIENTO', 'ESTADO'
      ])
      rowHeadLotes.font = headerFont
      rowHeadLotes.alignment = { horizontal: 'center', vertical: 'middle' }
      rowHeadLotes.eachCell(c => {
        c.fill = subHeaderFill
        c.border = standardBorder
      })
      rowHeadLotes.height = 22

      lotes.forEach(l => {
        const esBajo = l.cantidad < l.minimo
        const r = wsLotes.addRow([
          l.codigo,
          l.vacuna,
          l.cantidad,
          l.minimo,
          l.vencimiento,
          esBajo ? 'CRÍTICO: STOCK BAJO' : 'ÓPTIMO'
        ])
        r.font = { name: 'Segoe UI', size: 10 }
        r.eachCell((c, colIndex) => {
          c.border = standardBorder
          if (colIndex === 1 || colIndex === 2 || colIndex === 5) {
            c.alignment = { horizontal: 'center' }
          }
          if (colIndex === 6) {
            c.alignment = { horizontal: 'center' }
            c.font = { bold: true, color: { argb: esBajo ? DANGER_HEX : SUCCESS_HEX } }
          }
        })
      })

      // -------------------------------------------------------------
      // HOJA 4: JORNADAS Y RESPONSABLES
      // -------------------------------------------------------------
      const wsJornadas = workbook.addWorksheet('Jornadas y Brigadas', {
        views: [{ showGridLines: true }]
      })

      wsJornadas.columns = [
        { width: 14 },
        { width: 18 },
        { width: 28 },
        { width: 26 }
      ]

      wsJornadas.mergeCells('A1:D1')
      const h1Jornadas = wsJornadas.getCell('A1')
      h1Jornadas.value = 'CRONOGRAMA DE JORNADAS DE VACUNACIÓN Y BRIGADAS MÓVILES'
      h1Jornadas.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: WHITE_HEX } }
      h1Jornadas.fill = headerFill
      h1Jornadas.alignment = { horizontal: 'center', vertical: 'middle' }
      wsJornadas.getRow(1).height = 28

      const rowHeadJorn = wsJornadas.addRow([
        'FECHA', 'HORARIO', 'PUNTO / UBICACIÓN', 'RESPONSABLE'
      ])
      rowHeadJorn.font = headerFont
      rowHeadJorn.alignment = { horizontal: 'center', vertical: 'middle' }
      rowHeadJorn.eachCell(c => {
        c.fill = subHeaderFill
        c.border = standardBorder
      })
      rowHeadJorn.height = 22

      jornadas.forEach(j => {
        const r = wsJornadas.addRow([
          j.fecha,
          j.horario,
          j.punto,
          j.responsable
        ])
        r.font = { name: 'Segoe UI', size: 10 }
        r.eachCell((c, colIndex) => {
          c.border = standardBorder
          if (colIndex === 1 || colIndex === 2) {
            c.alignment = { horizontal: 'center' }
          }
        })
      })

      // Generar buffer y descargar
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `Reporte_Consolidado_Dorado_Norte_${new Date().toISOString().split('T')[0]}.xlsx`
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (err) {
      console.error('Error al generar Excel:', err)
      alert('Hubo un inconveniente al generar el archivo Excel. Por favor verifique la consola.')
    }
  }

  // ==========================================
  // EXPORTACIÓN A PDF PROFESIONAL CON JSPDF
  // ==========================================
  function exportarPDF() {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const primaryColor = [3, 58, 96] // #033a60
      const secondaryColor = [2, 132, 199] // #0284c7

      // 1. Encabezado institucional
      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, 210, 22, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.text('CENTRO DE SALUD DORADO NORTE', 14, 10)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.text('Sistema de Gestión y Control de Vacunación (SGCV)', 14, 16)

      const fechaEmision = new Date().toLocaleDateString('es-ES')
      const horaEmision = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      doc.setFontSize(8)
      doc.text(`Emisión: ${fechaEmision} ${horaEmision}`, 150, 16)

      // 2. Título y Ficha de Parámetros
      doc.setTextColor(15, 23, 42)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text('INFORME TÉCNICO Y OPERATIVO DE VACUNACIÓN', 14, 31)

      doc.setDrawColor(203, 213, 225)
      doc.setFillColor(248, 250, 252)
      doc.roundedRect(14, 35, 182, 20, 2, 2, 'FD')

      doc.setFontSize(8.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(51, 65, 85)
      doc.text('Campaña:', 18, 42)
      doc.text('Periodo:', 18, 50)
      doc.text('Meta Poblacional:', 110, 42)
      doc.text('Estado Actual:', 110, 50)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(15, 23, 42)
      doc.text(campanaActiva.nombre, 37, 42)
      doc.text(campanaActiva.periodo, 33, 50)
      doc.text(`${meta.toLocaleString()} habitantes`, 140, 42)
      doc.text(campanaActiva.estado, 134, 50)

      // 3. Tabla: Consolidado de Indicadores Clave
      autoTable(doc, {
        startY: 59,
        head: [['INDICADOR GENERAL', 'VALOR CONSOLIDADO', 'DETALLE / ESTADO']],
        body: [
          ['Meta Poblacional Objetivo', `${meta.toLocaleString()} personas`, '100% de la población estimada'],
          ['Dosis Aplicadas (Estimado)', `${totalDosisAplicadas.toLocaleString()} dosis`, `${porcentajeCobertura}% de cobertura global`],
          ['Vacunas en Almacén (Stock)', `${stockDisponibleTotal.toLocaleString()} unidades`, 'Disponibilidad inmediata'],
          ['Lotes Registrados', `${lotes.length} lotes`, `${alertasLotes.length} con advertencia de stock/vencimiento`],
          ['Distribución por Biológico', `SR: ${vacunasSR.toLocaleString()}  |  SRP: ${vacunasSRP.toLocaleString()}`, 'Dosis totales registradas']
        ],
        theme: 'grid',
        headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
        bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 14, right: 14 }
      })

      // 4. Tabla: Registro Nominal de Vacunaciones
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 7,
        head: [['N°', 'PACIENTE', 'C.I.', 'GRUPO', 'VACUNA', 'DOSIS', 'LOTE', 'FECHA']],
        body: vacunaciones.map((v, i) => [
          i + 1,
          v.persona,
          v.ci,
          v.grupo,
          v.vacuna,
          v.dosis,
          v.lote,
          v.fecha
        ]),
        theme: 'grid',
        headStyles: { fillColor: secondaryColor, textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 14, right: 14 }
      })

      // 5. Tabla: Inventario y Control de Lotes
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 7,
        head: [['CÓDIGO LOTE', 'VACUNA', 'STOCK', 'MÍNIMO', 'VENCIMIENTO', 'ESTADO']],
        body: lotes.map(l => [
          l.codigo,
          l.vacuna,
          l.cantidad.toLocaleString(),
          l.minimo.toLocaleString(),
          l.vencimiento,
          l.cantidad < l.minimo ? 'Stock Bajo' : 'Óptimo'
        ]),
        theme: 'grid',
        headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 14, right: 14 }
      })

      // 6. Tabla: Jornadas y Brigadas de Vacunación
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 7,
        head: [['FECHA', 'HORARIO', 'PUNTO DE ATENCIÓN / BRIGADA', 'RESPONSABLE']],
        body: jornadas.map(j => [
          j.fecha,
          j.horario,
          j.punto,
          j.responsable
        ]),
        theme: 'striped',
        headStyles: { fillColor: secondaryColor, textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
        margin: { left: 14, right: 14 }
      })

      // 7. Pie de página formal y foliado
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(7.5)
        doc.setTextColor(148, 163, 184)
        doc.setDrawColor(226, 232, 240)
        doc.line(14, 284, 196, 284)
        doc.text('Centro de Salud Dorado Norte - Documento Oficial de Uso Interno', 14, 289)
        doc.text(`Página ${i} de ${pageCount}`, 178, 289)
      }

      doc.save(`Reporte_Oficial_Dorado_Norte_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (err) {
      console.error('Error al generar PDF:', err)
      alert('Hubo un inconveniente al generar el documento PDF. Por favor verifique la consola.')
    }
  }

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Módulo de Reportes Operativos e Informes Oficiales (RF08)</h2>
          <span className="text-muted">Generación consolidada de registros de vacunación, inventario de biológicos y brigadas</span>
        </div>
        <div className="btn-group">
          <button className="btn-excel" onClick={exportarExcel}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="8" y1="13" x2="16" y2="13"></line>
              <line x1="8" y1="17" x2="16" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Exportar a Excel (.xlsx)
          </button>
          <button className="btn-pdf" onClick={exportarPDF}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Exportar a PDF
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen Operativo */}
      <div className="grid grid-4" style={{ marginBottom: 18 }}>
        <div className="kpi">
          <div className="valor">{totalDosisAplicadas.toLocaleString()}</div>
          <div className="label">Dosis Aplicadas Totales</div>
        </div>
        <div className="kpi">
          <div className="valor">{stockDisponibleTotal.toLocaleString()}</div>
          <div className="label">Biológicos en Almacén</div>
        </div>
        <div className="kpi">
          <div className="valor">{lotes.length}</div>
          <div className="label">Lotes Registrados</div>
        </div>
        <div className="kpi">
          <div className="valor">{jornadas.length}</div>
          <div className="label">Jornadas Programadas</div>
        </div>
      </div>

      {/* Pestañas de Consulta */}
      <div className="card">
        <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--borde)', paddingBottom: 10, marginBottom: 16 }}>
          <button 
            className={`btn-secondary ${tabActiva === 'vacunaciones' ? 'active-tab' : ''}`}
            style={tabActiva === 'vacunaciones' ? { background: '#033a60', color: '#fff', border: 'none' } : {}}
            onClick={() => setTabActiva('vacunaciones')}
          >
            Registro Nominal ({vacunaciones.length})
          </button>
          <button 
            className={`btn-secondary ${tabActiva === 'lotes' ? 'active-tab' : ''}`}
            style={tabActiva === 'lotes' ? { background: '#033a60', color: '#fff', border: 'none' } : {}}
            onClick={() => setTabActiva('lotes')}
          >
            Inventario de Lotes ({lotes.length})
          </button>
          <button 
            className={`btn-secondary ${tabActiva === 'jornadas' ? 'active-tab' : ''}`}
            style={tabActiva === 'jornadas' ? { background: '#033a60', color: '#fff', border: 'none' } : {}}
            onClick={() => setTabActiva('jornadas')}
          >
            Jornadas y Brigadas ({jornadas.length})
          </button>
          <button 
            className={`btn-secondary ${tabActiva === 'usuarios' ? 'active-tab' : ''}`}
            style={tabActiva === 'usuarios' ? { background: '#033a60', color: '#fff', border: 'none' } : {}}
            onClick={() => setTabActiva('usuarios')}
          >
            Personal y Roles ({usuarios.length})
          </button>
        </div>

        {tabActiva === 'vacunaciones' && (
          <div>
            <div className="section-head" style={{ marginBottom: 12 }}>
              <h3>Registro Nominal de Vacunaciones Realizadas</h3>
              <span className="section-badge">Detalle Nominal</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Paciente</th>
                  <th>C.I. / Documento</th>
                  <th>Grupo Etario</th>
                  <th>Vacuna</th>
                  <th>Dosis</th>
                  <th>Lote</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {vacunaciones.map((v, i) => (
                  <tr key={v.id}>
                    <td>{i + 1}</td>
                    <td><strong>{v.persona}</strong></td>
                    <td>{v.ci}</td>
                    <td>{v.grupo}</td>
                    <td><span className="tag-vacuna">{v.vacuna}</span></td>
                    <td>{v.dosis}</td>
                    <td><span className="font-mono">{v.lote}</span></td>
                    <td>{v.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabActiva === 'lotes' && (
          <div>
            <div className="section-head" style={{ marginBottom: 12 }}>
              <h3>Control de Stock y Estado de Biológicos</h3>
              <span className="section-badge">Inventario General</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Código Lote</th>
                  <th>Vacuna</th>
                  <th>Stock Actual</th>
                  <th>Mínimo Alerta</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {lotes.map((l) => (
                  <tr key={l.id}>
                    <td><strong className="font-mono">{l.codigo}</strong></td>
                    <td><span className="tag-vacuna">{l.vacuna}</span></td>
                    <td>{l.cantidad.toLocaleString()} dosis</td>
                    <td>{l.minimo}</td>
                    <td>{l.vencimiento}</td>
                    <td>
                      {l.cantidad < l.minimo ? (
                        <span className="pill pill-danger">Stock Bajo</span>
                      ) : (
                        <span className="pill pill-act">Óptimo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabActiva === 'jornadas' && (
          <div>
            <div className="section-head" style={{ marginBottom: 12 }}>
              <h3>Cronograma de Jornadas de Vacunación</h3>
              <span className="section-badge">Puntos y Brigadas</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Horario de Atención</th>
                  <th>Punto de Vacunación</th>
                  <th>Responsable a Cargo</th>
                </tr>
              </thead>
              <tbody>
                {jornadas.map((j) => (
                  <tr key={j.id}>
                    <td><strong>{j.fecha}</strong></td>
                    <td>{j.horario}</td>
                    <td>{j.punto}</td>
                    <td>{j.responsable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabActiva === 'usuarios' && (
          <div>
            <div className="section-head" style={{ marginBottom: 12 }}>
              <h3>Registro de Personal y Operadores del Sistema</h3>
              <span className="section-badge">Usuarios</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Nombre y Apellido</th>
                  <th>Usuario</th>
                  <th>Rol Asignado</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.nombre}</strong></td>
                    <td><span className="font-mono">{u.usuario}</span></td>
                    <td><span className="tag-vacuna">{u.rol}</span></td>
                    <td><span className="pill pill-act">{u.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
