import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "./views/Dashboard.vue";
import Campanas from "./views/Campanas.vue";
import Vacunaciones from "./views/Vacunaciones.vue";
import VacunasStock from "./views/VacunasStock.vue";
import Alertas from "./views/Alertas.vue";
import Cobertura from "./views/Cobertura.vue";
import Reportes from "./views/Reportes.vue";
import Jornadas from "./views/Jornadas.vue";
import Usuarios from "./views/Usuarios.vue";
import { getSesion } from "./auth.js";

const routes = [
  {
    path: "/",
    component: Dashboard,
    meta: { title: "Dashboard", roles: ["all"] },
  },
  {
    path: "/campanas",
    component: Campanas,
    meta: {
      title: "Campañas",
      roles: ["admin", "encargado", "lider", "paciente"],
    },
  },
  {
    path: "/vacunaciones",
    component: Vacunaciones,
    meta: { title: "Vacunaciones", roles: ["admin", "vacunador", "paciente"] },
  },
  {
    path: "/stock",
    component: VacunasStock,
    meta: { title: "Vacunas y Stock", roles: ["admin", "encargado"] },
  },
  {
    path: "/alertas",
    component: Alertas,
    meta: {
      title: "Alertas",
      roles: ["admin", "encargado", "vacunador", "lider"],
    },
  },
  {
    path: "/cobertura",
    component: Cobertura,
    meta: { title: "Cobertura", roles: ["admin", "encargado", "lider"] },
  },
  {
    path: "/reportes",
    component: Reportes,
    meta: { title: "Reportes", roles: ["admin", "encargado"] },
  },
  {
    path: "/jornadas",
    component: Jornadas,
    meta: {
      title: "Jornadas",
      roles: ["admin", "encargado", "vacunador", "lider"],
    },
  },
  {
    path: "/usuarios",
    component: Usuarios,
    meta: { title: "Usuarios", roles: ["admin"] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const session = getSesion();
  if (!session) return true;
  const allowedRoles = to.meta.roles || ["all"];
  if (allowedRoles.includes("all")) return true;
  const role = session.rol || "";
  const roleKey = role.includes("Administrador")
    ? "admin"
    : role.includes("Encargado")
      ? "encargado"
      : role.includes("Responsable")
        ? "vacunador"
        : role.includes("Líder")
          ? "lider"
          : role.includes("Usuario Estándar")
            ? "paciente"
            : "";
  return allowedRoles.includes(roleKey) ? true : "/";
});

export default router;
