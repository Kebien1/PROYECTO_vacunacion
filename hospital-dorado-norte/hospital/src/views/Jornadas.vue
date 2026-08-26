<script setup>
import { ref } from 'vue'
import { jornadas } from '../data/mock.js'

const lista = ref([...jornadas])
const form = ref({ fecha: '2026-04-05', horario: '08:00 – 16:00', punto: '', responsable: '' })

function agregar() {
  if (!form.value.punto) return
  lista.value.push({ id: Date.now(), ...form.value })
  form.value = { fecha: '2026-04-05', horario: '08:00 – 16:00', punto: '', responsable: '' }
}
</script>

<template>
  <div class="card">
    <h2>Registrar jornada (RF06)</h2>
    <div class="row">
      <input class="input" type="date" v-model="form.fecha" />
      <input class="input" v-model="form.horario" placeholder="Horario" />
      <input class="input" v-model="form.punto" placeholder="Punto de vacunación" />
      <input class="input" v-model="form.responsable" placeholder="Responsable / brigada" />
    </div>
    <button class="btn" @click="agregar">Agregar jornada</button>
  </div>

  <div class="card">
    <h2>Jornadas programadas</h2>
    <table>
      <thead><tr><th>Fecha</th><th>Horario</th><th>Punto</th><th>Responsable</th></tr></thead>
      <tbody>
        <tr v-for="j in lista" :key="j.id">
          <td>{{ j.fecha }}</td><td>{{ j.horario }}</td><td>{{ j.punto }}</td><td>{{ j.responsable }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
