<script setup>
import { computed } from 'vue'
import { poblacionObjetivo, vacunaciones } from '../data/mock.js'

const metaTotal = poblacionObjetivo.reduce((s, p) => s + p.objetivo, 0)
const vacunados = vacunaciones.length * 400
const cobertura = Math.min(100, Math.round((vacunados / metaTotal) * 100))
const pendiente = Math.max(0, metaTotal - vacunados)

const filas = poblacionObjetivo.map((p) => {
  const vac = Math.min(p.objetivo, Math.round((vacunados * p.objetivo) / metaTotal))
  return { ...p, vac, pct: Math.round((vac / p.objetivo) * 100), pend: p.objetivo - vac }
})
</script>

<template>
  <div class="card">
    <h2>Cobertura y población pendiente (RF07)</h2>
    <div class="grid grid-3" style="margin-bottom:14px">
      <div class="kpi"><div class="valor">{{ metaTotal.toLocaleString() }}</div><div class="label">Meta total</div></div>
      <div class="kpi"><div class="valor">{{ vacunados.toLocaleString() }}</div><div class="label">Vacunados (est.)</div></div>
      <div class="kpi"><div class="valor">{{ pendiente.toLocaleString() }}</div><div class="label">Población pendiente</div></div>
    </div>
    <div class="bar"><span :style="{ width: cobertura + '%' }"></span></div>
    <p style="font-size:13px;color:var(--muted)">Cobertura global: {{ cobertura }}%</p>
  </div>

  <div class="card">
    <h2>Desglose por grupo</h2>
    <table>
      <thead><tr><th>Grupo</th><th>Objetivo</th><th>Vacunados</th><th>%</th><th>Pendiente</th><th></th></tr></thead>
      <tbody>
        <tr v-for="f in filas" :key="f.grupo">
          <td>{{ f.grupo }}</td><td>{{ f.objetivo }}</td><td>{{ f.vac }}</td><td>{{ f.pct }}%</td>
          <td>{{ f.pend }}</td>
          <td style="width:160px"><div class="bar"><span :style="{ width: f.pct + '%' }"></span></div></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
