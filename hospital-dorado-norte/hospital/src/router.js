import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Campanas from './views/Campanas.vue'
import Vacunaciones from './views/Vacunaciones.vue'
import VacunasStock from './views/VacunasStock.vue'
import Alertas from './views/Alertas.vue'
import Cobertura from './views/Cobertura.vue'
import Reportes from './views/Reportes.vue'
import Jornadas from './views/Jornadas.vue'
import Usuarios from './views/Usuarios.vue'

const routes = [
  { path: '/', component: Dashboard, meta: { title: 'Dashboard' } },
  { path: '/campanas', component: Campanas, meta: { title: 'Campañas' } },
  { path: '/vacunaciones', component: Vacunaciones, meta: { title: 'Vacunaciones' } },
  { path: '/stock', component: VacunasStock, meta: { title: 'Vacunas y Stock' } },
  { path: '/alertas', component: Alertas, meta: { title: 'Alertas' } },
  { path: '/cobertura', component: Cobertura, meta: { title: 'Cobertura' } },
  { path: '/reportes', component: Reportes, meta: { title: 'Reportes' } },
  { path: '/jornadas', component: Jornadas, meta: { title: 'Jornadas' } },
  { path: '/usuarios', component: Usuarios, meta: { title: 'Usuarios' } }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
