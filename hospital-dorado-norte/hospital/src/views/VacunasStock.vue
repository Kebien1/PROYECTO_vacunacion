<script setup>
import { onMounted, ref } from "vue";
import { api } from "../api.js";

const lista = ref([]);
const vacunas = ref([]);
const error = ref("");
const editando = ref(null);
const form = ref({ vacuna: "", cantidad: "", vencimiento: "2026-12-31" });

async function cargar() {
  try {
    [lista.value, vacunas.value] = await Promise.all([
      api.get("/lotes"),
      api.get("/vacunas"),
    ]);
    form.value.vacuna ||= vacunas.value[0]?.idVacuna || "";
  } catch (e) {
    error.value = e.message;
  }
}

async function agregar() {
  if (!form.value.vacuna || !form.value.cantidad) return;
  try {
    const data = {
      nombreVacuna:
        vacunas.value.find((v) => v.idVacuna === Number(form.value.vacuna))
          ?.nombre || "",
      cantidadDisponible: Number(form.value.cantidad),
      fechaVencimiento: form.value.vencimiento,
      idVacuna: Number(form.value.vacuna),
    };
    if (editando.value) await api.put(`/lotes/${editando.value}`, data);
    else await api.post("/lotes", data);
    await cargar();
    form.value.cantidad = "";
    editando.value = null;
  } catch (e) {
    error.value = e.message;
  }
}

function editar(lote) {
  editando.value = lote.idLote;
  form.value = {
    vacuna: lote.idVacuna,
    cantidad: lote.cantidadDisponible,
    vencimiento: lote.fechaVencimiento.slice(0, 10),
  };
}
async function eliminar(lote) {
  if (!confirm(`¿Eliminar el lote ${lote.idLote}?`)) return;
  try {
    await api.delete(`/lotes/${lote.idLote}`);
    await cargar();
  } catch (e) {
    error.value = e.message;
  }
}

onMounted(cargar);
</script>

<template>
  <div class="card">
    <h2>Ingresar lote / existencia (RF04)</h2>
    <div class="row">
      <select class="input" v-model="form.vacuna">
        <option v-for="v in vacunas" :key="v.idVacuna" :value="v.idVacuna">
          {{ v.nombre }}
        </option>
      </select>
      <input
        class="input"
        type="number"
        v-model="form.cantidad"
        placeholder="Cantidad"
      />
      <input class="input" type="date" v-model="form.vencimiento" />
    </div>
    <button class="btn" @click="agregar">
      {{ editando ? "Actualizar lote" : "Registrar lote" }}
    </button>
    <button v-if="editando" class="btn" @click="editando = null">
      Cancelar
    </button>
    <p v-if="error" class="alert alert-danger">{{ error }}</p>
  </div>

  <div class="card">
    <h2>Stock de vacunas y lotes</h2>
    <table>
      <thead>
        <tr>
          <th>Vacuna</th>
          <th>Lote</th>
          <th>Cantidad</th>
          <th>Mínimo</th>
          <th>Vencimiento</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="l in lista" :key="l.idLote">
          <td>{{ l.vacuna?.nombre || l.nombreVacuna }}</td>
          <td>{{ l.idLote }}</td>
          <td>{{ l.cantidadDisponible }}</td>
          <td>-</td>
          <td>{{ l.fechaVencimiento }}</td>
          <td>
            <span class="pill pill-act"> Registrado </span>
          </td>
          <td>
            <button class="btn" @click="editar(l)">Editar</button>
            <button class="btn" @click="eliminar(l)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
