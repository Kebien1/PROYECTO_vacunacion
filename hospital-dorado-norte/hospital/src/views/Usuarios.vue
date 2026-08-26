<script setup>
import { ref } from 'vue'
import { usuarios } from '../data/mock.js'

const lista = ref([...usuarios])
const form = ref({ usuario: '', nombre: '', rol: 'Personal de Vacunación', estado: 'Activo' })

function agregar() {
  if (!form.value.usuario || !form.value.nombre) return
  lista.value.push({ id: Date.now(), ...form.value })
  form.value = { usuario: '', nombre: '', rol: 'Personal de Vacunación', estado: 'Activo' }
}
</script>

<template>
  <div class="card">
    <h2>Gestión de usuarios (RF01)</h2>
    <div class="row">
      <input class="input" v-model="form.usuario" placeholder="Usuario" />
      <input class="input" v-model="form.nombre" placeholder="Nombre completo" />
      <select class="input" v-model="form.rol">
        <option>Administrador</option>
        <option>Responsable de Vacunación</option>
        <option>Responsable Administrativo</option>
        <option>Personal de Vacunación</option>
      </select>
      <button class="btn" @click="agregar">Crear usuario</button>
    </div>
  </div>

  <div class="card">
    <h2>Usuarios del sistema</h2>
    <table>
      <thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Estado</th></tr></thead>
      <tbody>
        <tr v-for="u in lista" :key="u.id">
          <td>{{ u.usuario }}</td><td>{{ u.nombre }}</td><td>{{ u.rol }}</td>
          <td><span class="pill pill-act">{{ u.estado }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
