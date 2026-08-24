<script setup>
import { computed, onMounted, ref } from "vue";
import { api } from "../api.js";

const campanaActiva = ref({
  nombre: "Sin campañas registradas",
  fechaInicio: "-",
  fechaFin: "-",
});
const vacunaciones = ref([]);
const alertas = ref([]);
const error = ref("");
const cobertura = ref(0);

const kpis = computed(() => [
  { valor: "0", label: "Meta de población objetivo" },
  {
    valor: vacunaciones.value.length.toLocaleString(),
    label: "Personas vacunadas",
  },
  { valor: cobertura.value + "%", label: "Cobertura alcanzada" },
  { valor: alertas.value.length, label: "Alertas activas" },
]);

const porGrupo = computed(() => []);

onMounted(async () => {
  try {
    const [campanas, vacunacionesActuales, lotes] = await Promise.all([
      api.get("/campañas"),
      api.get("/vacunaciones"),
      api.get("/lotes"),
    ]);
    campanaActiva.value = campanas[0] || campanaActiva.value;
    vacunaciones.value = vacunacionesActuales;
    alertas.value = lotes.filter(
      (lote) =>
        new Date(lote.fechaVencimiento) <= new Date(Date.now() + 60 * 86400000),
    );
  } catch (e) {
    error.value = e.message;
  }
});
</script>

<template>
  <div class="grid grid-4">
    <div class="kpi" v-for="k in kpis" :key="k.label">
      <div class="valor">{{ k.valor }}</div>
      <div class="label">{{ k.label }}</div>
    </div>
  </div>
  <p v-if="error" class="alert alert-danger">{{ error }}</p>

  <div class="card">
    <h2>Campaña activa: {{ campanaActiva.nombre }}</h2>
    <p>
      <b>Inicio:</b> {{ campanaActiva.fechaInicio }} · <b>Fin:</b>
      {{ campanaActiva.fechaFin }}
    </p>
    <div class="bar"><span :style="{ width: cobertura + '%' }"></span></div>
    <p style="font-size: 13px; color: var(--muted)">
      Cobertura: {{ cobertura }}% de la meta
    </p>
  </div>

  <div class="grid grid-2">
    <div class="card">
      <h2>Avance por grupo prioritario</h2>
      <div v-for="g in porGrupo" :key="g.grupo" style="margin-bottom: 12px">
        <div
          style="display: flex; justify-content: space-between; font-size: 13px"
        >
          <span>{{ g.grupo }}</span
          ><span>{{ g.vac }} / {{ g.objetivo }}</span>
        </div>
        <div class="bar">
          <span
            :style="{ width: Math.min(100, (g.vac / g.objetivo) * 100) + '%' }"
          ></span>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Alertas recientes</h2>
      <div v-if="!alertas.length" class="alert alert-ok">
        Sin alertas críticas.
      </div>
      <div
        v-for="a in alertas"
        :key="a.codigo"
        class="alert"
        :class="a.tipo.includes('Vencimiento') ? 'alert-danger' : 'alert-warn'"
      >
        <b>Lote {{ a.idLote }}</b> ({{ a.nombreVacuna }}) — revisar vencimiento
        · stock: {{ a.cantidadDisponible }} · vence: {{ a.fechaVencimiento }}
      </div>
    </div>
  </div>
</template>
