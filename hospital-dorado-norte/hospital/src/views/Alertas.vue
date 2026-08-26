<script setup>
import { computed } from 'vue'
import { calcularAlertas } from '../data/mock.js'

const alertas = computed(() => calcularAlertas())
</script>

<template>
  <div class="card">
    <h2>Alertas de stock y vencimiento (RF05)</h2>
    <div v-if="!alertas.length" class="alert alert-ok">No hay alertas activas en este momento.</div>
    <div v-for="a in alertas" :key="a.codigo" class="alert" :class="a.tipo.includes('Vencimiento') ? 'alert-danger' : 'alert-warn'">
      <b>{{ a.codigo }}</b> — {{ a.vacuna }} — {{ a.tipo }}<br />
      <small>Stock: {{ a.cantidad }} (mín {{ a.minimo }}) · Vence: {{ a.vencimiento }} ({{ a.dias }} días)</small>
    </div>
  </div>
</template>
