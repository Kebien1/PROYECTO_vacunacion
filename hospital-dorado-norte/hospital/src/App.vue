<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { getSesion, logout } from "./auth.js";

const route = useRoute();
const sesion = getSesion();
const titulo = computed(() => route.meta.title || "Dorado Norte");
const rol = sesion?.rol || "";

const menu = [
  { to: "/", label: "Dashboard", icon: "📊", roles: ["all"] },
  {
    to: "/campanas",
    label: "Campañas",
    icon: "📋",
    roles: ["admin", "encargado", "lider", "paciente"],
  },
  {
    to: "/vacunaciones",
    label: "Vacunaciones",
    icon: "💉",
    roles: ["admin", "vacunador", "paciente"],
  },
  {
    to: "/stock",
    label: "Vacunas y Stock",
    icon: "📦",
    roles: ["admin", "encargado"],
  },
  {
    to: "/alertas",
    label: "Alertas",
    icon: "⚠️",
    roles: ["admin", "encargado", "vacunador", "lider"],
  },
  {
    to: "/cobertura",
    label: "Cobertura",
    icon: "🎯",
    roles: ["admin", "encargado", "lider"],
  },
  {
    to: "/reportes",
    label: "Reportes",
    icon: "📈",
    roles: ["admin", "encargado"],
  },
  {
    to: "/jornadas",
    label: "Jornadas",
    icon: "🗓️",
    roles: ["admin", "encargado", "vacunador", "lider"],
  },
  { to: "/usuarios", label: "Usuarios", icon: "👥", roles: ["admin"] },
];

function puedeVer(item) {
  if (item.roles.includes("all")) return true;
  if (rol.includes("Administrador")) return item.roles.includes("admin");
  if (rol.includes("Encargado")) return item.roles.includes("encargado");
  if (rol.includes("Responsable")) return item.roles.includes("vacunador");
  if (rol.includes("Líder")) return item.roles.includes("lider");
  if (rol.includes("Usuario Estándar")) return item.roles.includes("paciente");
  return false;
}
</script>

<template>
  <div class="layout" v-if="sesion">
    <aside class="sidebar">
      <div class="brand">🏥 Dorado Norte</div>
      <nav>
        <RouterLink
          v-for="m in menu.filter(puedeVer)"
          :key="m.to"
          :to="m.to"
          class="nav-item"
        >
          <span class="ico">{{ m.icon }}</span> {{ m.label }}
        </RouterLink>
      </nav>
    </aside>

    <div class="main">
      <header class="topbar">
        <div class="title">{{ titulo }}</div>
        <div class="user">
          <span class="badge">{{ sesion.rol }}</span>
          <span class="name">{{ sesion.nombre }}</span>
          <button class="logout" @click="logout">Salir</button>
        </div>
      </header>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
