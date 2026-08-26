<script setup>
import { ref, computed } from 'vue'
import { campanaActiva, poblacionObjetivo, vacunaciones, calcularAlertas } from '../data/mock.js'

const meta = campanaActiva.meta
const vacunados = vacunaciones.length * 400
const cobertura = Math.min(100, Math.round((vacunados / meta) * 100))
const alertas = calcularAlertas()

const kpis = computed(() => [
  { valor: meta.toLocaleString(), label: 'Meta de población objetivo' },
  { valor: vacunados.toLocaleString(), label: 'Personas vacunadas (est.)' },
  { valor: cobertura + '%', label: 'Cobertura alcanzada' },
  { valor: alertas.length, label: 'Alertas activas' }
])

const porGrupo = poblacionObjetivo.map((p) => ({
  ...p,
  vac: Math.round(p.objetivo * (cobertura / 100) * (0.8 + Math.random() * 0.4))
}))
</script>

<template>
  <div class="grid grid-4">
    <div class="kpi" v-for="k in kpis" :key="k.label">
      <div class="valor">{{ k.valor }}</div>
      <div class="label">{{ k.label }}</div>
    </div>
  </div>

  <div class="card">
    <h2>Campaña activa: {{ campanaActiva.nombre }}</h2>
    <p><b>Periodo:</b> {{ campanaActiva.periodo }} · <b>Estado:</b> {{ campanaActiva.estado }} · <b>Vacuna:</b> {{ campanaActiva.vacunaPrincipal }}</p>
    <div class="bar"><span :style="{ width: cobertura + '%' }"></span></div>
    <p style="font-size:13px;color:var(--muted)">Cobertura: {{ cobertura }}% de la meta</p>
  </div>

  <div class="grid grid-2">
    <div class="card">
      <h2>Avance por grupo prioritario</h2>
      <div v-for="g in porGrupo" :key="g.grupo" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:13px">
          <span>{{ g.grupo }}</span><span>{{ g.vac }} / {{ g.objetivo }}</span>
        </div>
        <div class="bar"><span :style="{ width: Math.min(100, (g.vac / g.objetivo) * 100) + '%' }"></span></div>
      </div>
    </div>

    <div class="card">
      <h2>Alertas recientes</h2>
      <div v-if="!alertas.length" class="alert alert-ok">Sin alertas críticas.</div>
      <div v-for="a in alertas" :key="a.codigo" class="alert" :class="a.tipo.includes('Vencimiento') ? 'alert-danger' : 'alert-warn'">
        <b>{{ a.codigo }}</b> ({{ a.vacuna }}) — {{ a.tipo }} · stock: {{ a.cantidad }} · vence: {{ a.vencimiento }}
      </div>
    </div>
  </div>
</template>
