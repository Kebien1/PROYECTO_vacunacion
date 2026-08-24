<script setup>
import { onMounted, ref } from "vue";
import { api } from "../api.js";

const lista = ref([]);
const campanas = ref([]);
const error = ref("");
const editando = ref(null);
const form = ref({ fecha: "2026-04-05", campana: "" });

async function cargar() {
  try {
    [lista.value, campanas.value] = await Promise.all([
      api.get("/jornadas"),
      api.get("/campañas"),
    ]);
    form.value.campana ||= campanas.value[0]?.idCampaña || "";
  } catch (e) {
    error.value = e.message;
  }
}

async function agregar() {
  if (!form.value.campana) return;
  try {
    const data = {
      fecha: form.value.fecha,
      idCampaña: Number(form.value.campana),
    };
    if (editando.value) await api.put(`/jornadas/${editando.value}`, data);
    else await api.post("/jornadas", data);
    await cargar();
    editando.value = null;
  } catch (e) {
    error.value = e.message;
  }
}

function editar(j) {
  editando.value = j.idJornada;
  form.value = { fecha: j.fecha.slice(0, 10), campana: j.idCampaña };
}
async function eliminar(j) {
  if (!confirm("¿Eliminar esta jornada?")) return;
  try {
    await api.delete(`/jornadas/${j.idJornada}`);
    await cargar();
  } catch (e) {
    error.value = e.message;
  }
}

onMounted(cargar);
</script>

<template>
  <div class="card">
    <h2>Registrar jornada (RF06)</h2>
    <div class="row">
      <input class="input" type="date" v-model="form.fecha" />
      <select class="input" v-model="form.campana">
        <option v-for="c in campanas" :key="c.idCampaña" :value="c.idCampaña">
          {{ c.nombre }}
        </option>
      </select>
    </div>
    <button class="btn" @click="agregar">
      {{ editando ? "Actualizar jornada" : "Agregar jornada" }}
    </button>
    <button v-if="editando" class="btn" @click="editando = null">
      Cancelar
    </button>
    <p v-if="error" class="alert alert-danger">{{ error }}</p>
  </div>

  <div class="card">
    <h2>Jornadas programadas</h2>
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Horario</th>
          <th>Punto</th>
          <th>Responsable</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="j in lista" :key="j.idJornada">
          <td>{{ j.fecha }}</td>
          <td>{{ j.campaña?.nombre || j.idCampaña }}</td>
          <td>-</td>
          <td>
            <button class="btn" @click="editar(j)">Editar</button>
            <button class="btn" @click="eliminar(j)">Eliminar</button>
          </td>
          <td>-</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
