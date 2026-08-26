<script setup>
import { ref } from 'vue'
import { lotes, vacunas } from '../data/mock.js'

const lista = ref([...lotes])
const form = ref({ vacuna: 'SR', codigo: '', cantidad: '', vencimiento: '2026-12-31', minimo: 200 })

function agregar() {
  if (!form.value.codigo || !form.value.cantidad) return
  lista.value.unshift({ id: Date.now(), vacuna: form.value.vacuna, codigo: form.value.codigo, cantidad: Number(form.value.cantidad), vencimiento: form.value.vencimiento, minimo: Number(form.value.minimo) })
  form.value = { vacuna: 'SR', codigo: '', cantidad: '', vencimiento: '2026-12-31', minimo: 200 }
}
</script>

<template>
  <div class="card">
    <h2>Ingresar lote / existencia (RF04)</h2>
    <div class="row">
      <select class="input" v-model="form.vacuna"><option v-for="v in vacunas" :key="v.id" :value="v.tipo">{{ v.tipo }}</option></select>
      <input class="input" v-model="form.codigo" placeholder="Código de lote" />
      <input class="input" type="number" v-model="form.cantidad" placeholder="Cantidad" />
      <input class="input" type="date" v-model="form.vencimiento" />
      <input class="input" type="number" v-model="form.minimo" placeholder="Stock mínimo" />
    </div>
    <button class="btn" @click="agregar">Registrar lote</button>
  </div>

  <div class="card">
    <h2>Stock de vacunas y lotes</h2>
    <table>
      <thead><tr><th>Vacuna</th><th>Lote</th><th>Cantidad</th><th>Mínimo</th><th>Vencimiento</th><th>Estado</th></tr></thead>
      <tbody>
        <tr v-for="l in lista" :key="l.id">
          <td>{{ l.vacuna }}</td><td>{{ l.codigo }}</td><td>{{ l.cantidad }}</td><td>{{ l.minimo }}</td><td>{{ l.vencimiento }}</td>
          <td>
            <span class="pill" :class="l.cantidad < l.minimo ? 'pill-low' : 'pill-act'">
              {{ l.cantidad < l.minimo ? 'Bajo' : 'OK' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
