<script setup>
import { onMounted, ref } from "vue";
import { api } from "../api.js";

const lista = ref([]);
const centros = ref([]);
const error = ref("");
const editando = ref(null);
const form = ref({ nombre: "", fechaInicio: "", fechaFin: "", idCentro: "" });

async function cargar() {
  try {
    [lista.value, centros.value] = await Promise.all([
      api.get("/campañas"),
      api.get("/centrossalud"),
    ]);
    if (!form.value.idCentro)
      form.value.idCentro = centros.value[0]?.idCentro || "";
  } catch (e) {
    error.value = e.message;
  }
}
function limpiar() {
  form.value = {
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
    idCentro: centros.value[0]?.idCentro || "",
  };
  editando.value = null;
}
function editar(item) {
  editando.value = item.idCampaña;
  form.value = {
    nombre: item.nombre,
    fechaInicio: item.fechaInicio.slice(0, 10),
    fechaFin: item.fechaFin.slice(0, 10),
    idCentro: item.idCentro,
  };
}
async function guardar() {
  if (
    !form.value.nombre ||
    !form.value.fechaInicio ||
    !form.value.fechaFin ||
    !form.value.idCentro
  ) {
    error.value = "Complete nombre, fechas y centro de salud.";
    return;
  }
  try {
    const data = {
      nombre: form.value.nombre,
      fechaInicio: form.value.fechaInicio,
      fechaFin: form.value.fechaFin,
      idCentro: Number(form.value.idCentro),
    };
    if (editando.value) await api.put(`/campañas/${editando.value}`, data);
    else await api.post("/campañas", data);
    limpiar();
    await cargar();
  } catch (e) {
    error.value = e.message;
  }
}
async function eliminar(item) {
  if (!confirm(`¿Eliminar ${item.nombre}?`)) return;
  try {
    await api.delete(`/campañas/${item.idCampaña}`);
    await cargar();
  } catch (e) {
    error.value = e.message;
  }
}
onMounted(cargar);
</script>

<template>
  <div class="card">
    <h2>{{ editando ? "Editar campaña" : "Registrar campaña" }}</h2>
    <div class="row">
      <input
        class="input"
        v-model="form.nombre"
        placeholder="Nombre de la campaña"
      />
      <input
        class="input"
        type="date"
        v-model="form.fechaInicio"
        title="Fecha de inicio"
      />
      <input
        class="input"
        type="date"
        v-model="form.fechaFin"
        title="Fecha de finalización"
      />
      <select class="input" v-model="form.idCentro">
        <option value="" disabled>Centro de salud</option>
        <option v-for="c in centros" :key="c.idCentro" :value="c.idCentro">
          {{ c.nombre }}
        </option>
      </select>
      <button class="btn" @click="guardar">
        {{ editando ? "Actualizar" : "Guardar" }}
      </button>
      <button v-if="editando" class="btn" @click="limpiar">Cancelar</button>
    </div>
    <p class="hint">
      Complete nombre, fechas y centro de salud. Las fechas definen la duración
      de la campaña.
    </p>
    <p v-if="error" class="alert alert-danger">{{ error }}</p>
  </div>
  <div class="card">
    <h2>Campañas registradas</h2>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Inicio</th>
          <th>Fin</th>
          <th>Centro</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in lista" :key="item.idCampaña">
          <td>{{ item.nombre }}</td>
          <td>{{ item.fechaInicio.slice(0, 10) }}</td>
          <td>{{ item.fechaFin.slice(0, 10) }}</td>
          <td>{{ item.idCentro }}</td>
          <td>
            <button class="btn" @click="editar(item)">Editar</button>
            <button class="btn" @click="eliminar(item)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
