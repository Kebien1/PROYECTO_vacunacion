<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getSesion, logout } from './auth.js'

const route = useRoute()
const sesion = getSesion()
const titulo = computed(() => route.meta.title || 'Dorado Norte')

const menu = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/campanas', label: 'Campañas', icon: '📋' },
  { to: '/vacunaciones', label: 'Vacunaciones', icon: '💉' },
  { to: '/stock', label: 'Vacunas y Stock', icon: '📦' },
  { to: '/alertas', label: 'Alertas', icon: '⚠️' },
  { to: '/cobertura', label: 'Cobertura', icon: '🎯' },
  { to: '/reportes', label: 'Reportes', icon: '📈' },
  { to: '/jornadas', label: 'Jornadas', icon: '🗓️' },
  { to: '/usuarios', label: 'Usuarios', icon: '👥' }
]
</script>

<template>
  <div class="layout" v-if="sesion">
    <aside class="sidebar">
      <div class="brand">🏥 Dorado Norte</div>
      <nav>
        <RouterLink v-for="m in menu" :key="m.to" :to="m.to" class="nav-item">
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
