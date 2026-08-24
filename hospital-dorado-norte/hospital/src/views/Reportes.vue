<script setup>
import { onMounted, ref } from "vue";
import { api } from "../api.js";

const campana = ref(null);
const vacunados = ref(0);
const stockTotal = ref(0);
const lotesTotal = ref(0);
const error = ref("");
const cobertura = ref(0);

onMounted(async () => {
  try {
    const [campanas, vacunaciones, lotes] = await Promise.all([
      api.get("/campañas"),
      api.get("/vacunaciones"),
      api.get("/lotes"),
    ]);
    campana.value = campanas[0];
    vacunados.value = vacunaciones.length;
    stockTotal.value = lotes.reduce(
      (total, lote) => total + lote.cantidadDisponible,
      0,
    );
    lotesTotal.value = lotes.length;
  } catch (e) {
    error.value = e.message;
  }
});

function exportar() {
  const lineas = [
    "Reporte Campaña Dorado Norte",
    "Campaña: " + (campana.value?.nombre || "Sin campaña"),
    "Vacunados: " + vacunados.value,
    "Cobertura: " + cobertura.value + "%",
    "Stock total: " + stockTotal.value,
  ];
  const blob = new Blob([lineas.join("\n")], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "reporte-dorado-norte.txt";
  a.click();
}
</script>

<template>
  <div class="card">
    <h2>Reportes (RF08)</h2>
    <div class="grid grid-2">
      <div class="kpi">
        <div class="valor">{{ vacunados.toLocaleString() }}</div>
        <div class="label">Dosis aplicadas</div>
      </div>
      <div class="kpi">
        <div class="valor">{{ cobertura }}%</div>
        <div class="label">Cobertura</div>
      </div>
      <div class="kpi">
        <div class="valor">{{ stockTotal.toLocaleString() }}</div>
        <div class="label">Vacunas en stock</div>
      </div>
      <div class="kpi">
        <div class="valor">{{ lotesTotal }}</div>
        <div class="label">Lotes registrados</div>
      </div>
    </div>
    <p v-if="error" class="alert alert-danger">{{ error }}</p>
    <button class="btn" style="margin-top: 14px" @click="exportar">
      ⬇ Exportar reporte (.txt)
    </button>
  </div>
</template>
