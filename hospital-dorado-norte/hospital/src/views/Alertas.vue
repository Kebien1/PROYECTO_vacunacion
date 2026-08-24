<script setup>
import { onMounted, ref } from "vue";
import { api } from "../api.js";

const alertas = ref([]);
const lotes = ref([]);
const error = ref("");
const editando = ref(null);
const form = ref({ tipo: "Stock bajo", fecha: "", lote: "" });

async function cargar() {
  try {
    [alertas.value, lotes.value] = await Promise.all([
      api.get("/alertas"),
      api.get("/lotes"),
    ]);
    if (!form.value.lote) form.value.lote = lotes.value[0]?.idLote || "";
  } catch (e) {
    error.value = e.message;
  }
}
async function guardar() {
  if (!form.value.tipo || !form.value.fecha || !form.value.lote) {
    error.value = "Complete tipo, fecha y lote.";
    return;
  }
  try {
    const data = {
      tipoAlerta: form.value.tipo,
      fechaGenerada: form.value.fecha,
      idLote: Number(form.value.lote),
    };
    if (editando.value) await api.put(`/alertas/${editando.value}`, data);
    else await api.post("/alertas", data);
    editando.value = null;
    await cargar();
  } catch (e) {
    error.value = e.message;
  }
}
function editar(a) {
  editando.value = a.idAlerta;
  form.value = {
    tipo: a.tipoAlerta,
    fecha: a.fechaGenerada.slice(0, 10),
    lote: a.idLote,
  };
}
async function eliminar(a) {
  if (!confirm("¿Eliminar esta alerta?")) return;
  try {
    await api.delete(`/alertas/${a.idAlerta}`);
    await cargar();
  } catch (e) {
    error.value = e.message;
  }
}
onMounted(cargar);
</script>

<template>
  <div class="card">
    <h2>Alertas de stock y vencimiento (RF05)</h2>
    <div class="row">
      <select class="input" v-model="form.tipo">
        <option>Stock bajo</option>
        <option>Vencimiento próximo</option>
        <option>Incidencia de lote</option></select
      ><input class="input" type="date" v-model="form.fecha" /><select
        class="input"
        v-model="form.lote"
      >
        <option value="" disabled>Seleccione lote</option>
        <option v-for="l in lotes" :key="l.idLote" :value="l.idLote">
          Lote {{ l.idLote }} - {{ l.vacuna?.nombre || l.nombreVacuna }}
        </option></select
      ><button class="btn" @click="guardar">
        {{ editando ? "Actualizar" : "Registrar alerta" }}
      </button>
    </div>
    <p v-if="error" class="alert alert-danger">{{ error }}</p>
    <div v-if="!alertas.length" class="alert alert-ok">
      No hay alertas activas en este momento.
    </div>
    <div
      v-for="a in alertas"
      :key="a.codigo"
      class="alert"
      :class="a.tipo.includes('Vencimiento') ? 'alert-danger' : 'alert-warn'"
    >
      <b>Lote {{ a.idLote }}</b> — {{ a.tipoAlerta }}<br />
      <small>Generada: {{ a.fechaGenerada }}</small>
      <button class="btn" @click="editar(a)">Editar</button>
      <button class="btn" @click="eliminar(a)">Eliminar</button>
    </div>
  </div>
</template>
