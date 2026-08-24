<script setup>
import { onMounted, ref } from "vue";
import { api } from "../api.js";

const lista = ref([]);
const usuarios = ref([]);
const campanas = ref([]);
const lotes = ref([]);
const error = ref("");
const editando = ref(null);
const form = ref({
  usuario: "",
  campana: "",
  lote: "",
  dosis: "1ra",
  fecha: "2026-03-20",
});

async function cargar() {
  try {
    [lista.value, usuarios.value, campanas.value, lotes.value] =
      await Promise.all([
        api.get("/vacunaciones"),
        api.get("/usuarios"),
        api.get("/campañas"),
        api.get("/lotes"),
      ]);
    form.value.usuario ||= usuarios.value[0]?.idUsuario || "";
    form.value.campana ||= campanas.value[0]?.idCampaña || "";
    form.value.lote ||= lotes.value[0]?.idLote || "";
  } catch (e) {
    error.value = e.message;
  }
}

async function registrar() {
  if (!form.value.usuario || !form.value.campana || !form.value.lote) return;
  try {
    const data = {
      fechaAplicacion: form.value.fecha,
      dosis: form.value.dosis,
      idUsuario: Number(form.value.usuario),
      idCampaña: Number(form.value.campana),
      idLote: Number(form.value.lote),
    };
    if (editando.value) await api.put(`/vacunaciones/${editando.value}`, data);
    else await api.post("/vacunaciones", data);
    await cargar();
    editando.value = null;
  } catch (e) {
    error.value = e.message;
  }
}

function editar(v) {
  editando.value = v.idVacunacion;
  form.value = {
    usuario: v.idUsuario,
    campana: v.idCampaña,
    lote: v.idLote,
    dosis: v.dosis,
    fecha: v.fechaAplicacion.slice(0, 10),
  };
}
async function eliminar(v) {
  if (!confirm("¿Eliminar esta vacunación?")) return;
  try {
    await api.delete(`/vacunaciones/${v.idVacunacion}`);
    await cargar();
  } catch (e) {
    error.value = e.message;
  }
}

onMounted(cargar);
</script>

<template>
  <div class="card">
    <h2>Registrar vacunación (RF03)</h2>
    <div class="row">
      <select class="input" v-model="form.usuario">
        <option v-for="u in usuarios" :key="u.idUsuario" :value="u.idUsuario">
          {{ u.nombre }}
        </option>
      </select>
      <select class="input" v-model="form.campana">
        <option v-for="c in campanas" :key="c.idCampaña" :value="c.idCampaña">
          {{ c.nombre }}
        </option>
      </select>
    </div>
    <div class="row">
      <input class="input" v-model="form.dosis" placeholder="Dosis" />
      <select class="input" v-model="form.lote">
        <option v-for="l in lotes" :key="l.idLote" :value="l.idLote">
          Lote {{ l.idLote }}
        </option>
      </select>
      <input class="input" type="date" v-model="form.fecha" />
    </div>
    <button class="btn" @click="registrar">
      {{ editando ? "Actualizar vacunación" : "Registrar dosis aplicada" }}
    </button>
    <button v-if="editando" class="btn" @click="editando = null">
      Cancelar
    </button>
    <p v-if="error" class="alert alert-danger">{{ error }}</p>
  </div>

  <div class="card">
    <h2>Vacunaciones registradas</h2>
    <table>
      <thead>
        <tr>
          <th>Persona</th>
          <th>C.I.</th>
          <th>Grupo</th>
          <th>Vacuna</th>
          <th>Dosis</th>
          <th>Lote</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in lista" :key="v.idVacunacion">
          <td>{{ v.usuario?.nombre || v.idUsuario }}</td>
          <td>-</td>
          <td>-</td>
          <td>{{ v.lote?.vacuna?.nombre || v.idLote }}</td>
          <td>{{ v.dosis }}</td>
          <td>{{ v.idLote }}</td>
          <td>{{ v.fechaAplicacion }}</td>
          <td>
            <button class="btn" @click="editar(v)">Editar</button>
            <button class="btn" @click="eliminar(v)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
