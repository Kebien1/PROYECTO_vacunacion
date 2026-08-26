<script setup>
import { campanaActiva, vacunaciones, lotes } from '../data/mock.js'

const meta = campanaActiva.meta
const vacunados = vacunaciones.length * 400
const cobertura = Math.round((vacunados / meta) * 100)
const stockTotal = lotes.reduce((s, l) => s + l.cantidad, 0)

function exportar() {
  const lineas = [
    'Reporte Campaña Dorado Norte',
    'Campaña: ' + campanaActiva.nombre,
    'Meta: ' + meta,
    'Vacunados (est): ' + vacunados,
    'Cobertura: ' + cobertura + '%',
    'Stock total: ' + stockTotal
  ]
  const blob = new Blob([lineas.join('\n')], { type: 'text/plain' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'reporte-dorado-norte.txt'
  a.click()
}
</script>

<template>
  <div class="card">
    <h2>Reportes (RF08)</h2>
    <div class="grid grid-2">
      <div class="kpi"><div class="valor">{{ vacunados.toLocaleString() }}</div><div class="label">Dosis aplicadas (est.)</div></div>
      <div class="kpi"><div class="valor">{{ cobertura }}%</div><div class="label">Cobertura</div></div>
      <div class="kpi"><div class="valor">{{ stockTotal.toLocaleString() }}</div><div class="label">Vacunas en stock</div></div>
      <div class="kpi"><div class="valor">{{ lotes.length }}</div><div class="label">Lotes registrados</div></div>
    </div>
    <button class="btn" style="margin-top:14px" @click="exportar">⬇ Exportar reporte (.txt)</button>
  </div>
</template>
