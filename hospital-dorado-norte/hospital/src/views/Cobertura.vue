<script setup>
import { onMounted, ref } from "vue";
import { api } from "../api.js";

const vacunados = ref(0);
const metaTotal = ref(0);
const error = ref("");
const cobertura = ref(0);
const pendiente = ref(0);
const filas = ref([]);

onMounted(async () => {
  try {
    const [vacunaciones, poblaciones] = await Promise.all([
      api.get("/vacunaciones"),
      api.get("/poblacionobjetivo"),
    ]);
    vacunados.value = vacunaciones.length;
    filas.value = poblaciones.map((poblacion) => ({
      grupo: poblacion.descripcion,
      objetivo: 0,
      vac: 0,
      pct: 0,
      pend: 0,
    }));
    metaTotal.value = filas.value.reduce(
      (total, fila) => total + fila.objetivo,
      0,
    );
    cobertura.value = metaTotal.value
      ? Math.min(100, Math.round((vacunados.value / metaTotal.value) * 100))
      : 0;
    pendiente.value = Math.max(0, metaTotal.value - vacunados.value);
  } catch (e) {
    error.value = e.message;
  }
});
</script>

<template>
  <div class="card">
    <h2>Cobertura y población pendiente (RF07)</h2>
    <p v-if="error" class="alert alert-danger">{{ error }}</p>
    <div class="grid grid-3" style="margin-bottom: 14px">
      <div class="kpi">
        <div class="valor">{{ metaTotal.toLocaleString() }}</div>
        <div class="label">Meta total</div>
      </div>
      <div class="kpi">
        <div class="valor">{{ vacunados.toLocaleString() }}</div>
        <div class="label">Vacunados (est.)</div>
      </div>
      <div class="kpi">
        <div class="valor">{{ pendiente.toLocaleString() }}</div>
        <div class="label">Población pendiente</div>
      </div>
    </div>
    <div class="bar"><span :style="{ width: cobertura + '%' }"></span></div>
    <p style="font-size: 13px; color: var(--muted)">
      Cobertura global: {{ cobertura }}%
    </p>
  </div>

  <div class="card">
    <h2>Desglose por grupo</h2>
    <table>
      <thead>
        <tr>
          <th>Grupo</th>
          <th>Objetivo</th>
          <th>Vacunados</th>
          <th>%</th>
          <th>Pendiente</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in filas" :key="f.grupo">
          <td>{{ f.grupo }}</td>
          <td>{{ f.objetivo }}</td>
          <td>{{ f.vac }}</td>
          <td>{{ f.pct }}%</td>
          <td>{{ f.pend }}</td>
          <td style="width: 160px">
            <div class="bar"><span :style="{ width: f.pct + '%' }"></span></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
