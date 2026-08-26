<script setup>
import { ref } from 'vue'
import { vacunaciones, vacunas } from '../data/mock.js'

const lista = ref([...vacunaciones])
const form = ref({ persona: '', ci: '', grupo: '5 – 9 años', vacuna: 'SR', dosis: '1ra', lote: 'LOTE-SR-001', fecha: '2026-03-20' })

function registrar() {
  if (!form.value.persona || !form.value.ci) return
  lista.value.unshift({ id: Date.now(), ...form.value })
  form.value = { persona: '', ci: '', grupo: '5 – 9 años', vacuna: 'SR', dosis: '1ra', lote: 'LOTE-SR-001', fecha: '2026-03-20' }
}
</script>

<template>
  <div class="card">
    <h2>Registrar vacunación (RF03)</h2>
    <div class="row">
      <input class="input" v-model="form.persona" placeholder="Nombre de la persona" />
      <input class="input" v-model="form.ci" placeholder="C.I." />
    </div>
    <div class="row">
      <select class="input" v-model="form.grupo">
        <option>6 meses – 4 años</option><option>5 – 9 años</option>
        <option>10 – 14 años</option><option>15 – 19 años</option>
      </select>
      <select class="input" v-model="form.vacuna">
        <option v-for="v in vacunas" :key="v.id" :value="v.tipo">{{ v.tipo }}</option>
      </select>
      <input class="input" v-model="form.dosis" placeholder="Dosis" />
      <input class="input" v-model="form.lote" placeholder="Lote" />
      <input class="input" type="date" v-model="form.fecha" />
    </div>
    <button class="btn" @click="registrar">Registrar dosis aplicada</button>
  </div>

  <div class="card">
    <h2>Vacunaciones registradas</h2>
    <table>
      <thead><tr><th>Persona</th><th>C.I.</th><th>Grupo</th><th>Vacuna</th><th>Dosis</th><th>Lote</th><th>Fecha</th></tr></thead>
      <tbody>
        <tr v-for="v in lista" :key="v.id">
          <td>{{ v.persona }}</td><td>{{ v.ci }}</td><td>{{ v.grupo }}</td>
          <td>{{ v.vacuna }}</td><td>{{ v.dosis }}</td><td>{{ v.lote }}</td><td>{{ v.fecha }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
