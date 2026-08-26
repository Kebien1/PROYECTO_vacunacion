<script setup>
import { ref } from 'vue'
import { campanaActiva } from '../data/mock.js'

const campana = ref({ ...campanaActiva })
const nueva = ref({ nombre: '', periodo: '', meta: '', poblacion: '' })
const guardado = ref(false)

function crear() {
  campana.value = {
    id: Date.now(),
    nombre: nueva.value.nombre || 'Nueva Campaña',
    periodo: nueva.value.periodo || 'Por definir',
    meta: Number(nueva.value.meta) || 0,
    poblacion: nueva.value.poblacion,
    estado: 'Borrador'
  }
  guardado.value = true
  setTimeout(() => (guardado.value = false), 2500)
}
</script>

<template>
  <div class="card">
    <h2>Campaña actual (RF02)</h2>
    <table>
      <tbody>
        <tr><th>Nombre</th><td>{{ campana.nombre }}</td></tr>
        <tr><th>Periodo</th><td>{{ campana.periodo }}</td></tr>
        <tr><th>Meta</th><td>{{ campana.meta.toLocaleString() }}</td></tr>
        <tr><th>Estado</th><td><span class="pill pill-act">{{ campana.estado }}</span></td></tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <h2>Registrar / actualizar campaña</h2>
    <div class="row">
      <input class="input" v-model="nueva.nombre" placeholder="Nombre de la campaña" />
      <input class="input" v-model="nueva.periodo" placeholder="Periodo (ej. Mar-Jun 2026)" />
    </div>
    <div class="row">
      <input class="input" type="number" v-model="nueva.meta" placeholder="Meta de población" />
      <input class="input" v-model="nueva.poblacion" placeholder="Población objetivo" />
    </div>
    <button class="btn" @click="crear">Guardar campaña</button>
    <span v-if="guardado" style="color:#065f46;margin-left:10px;font-size:13px">✓ Campaña registrada (mock)</span>
  </div>
</template>
