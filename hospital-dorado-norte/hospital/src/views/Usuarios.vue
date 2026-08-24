<script setup>
import { onMounted, ref } from "vue";
import { api } from "../api.js";

const lista = ref([]);
const roles = ref([]);
const descripciones = {
  "Administrador del Sistema":
    "Control total de usuarios, roles, campañas, vacunas, lotes, reportes e indicadores.",
  "Encargado del Centro de Salud":
    "Gestiona campañas, inventario y reportes del centro de salud.",
  "Responsable de Vacunación / Personal de Salud":
    "Registra vacunaciones, jornadas, puntos e incidencias.",
  "Líder de Brigada Barrial":
    "Coordina brigadas móviles, puntos temporales y avances comunitarios.",
  "Usuario Estándar / Paciente":
    "Consulta campañas, puntos de vacunación e historial personal.",
};
const error = ref("");
const guardando = ref(false);
const form = ref({ usuario: "", nombre: "", password: "", rol: "" });
const editando = ref(null);

async function cargar() {
  try {
    [lista.value, roles.value] = await Promise.all([
      api.get("/usuarios"),
      api.get("/roles"),
    ]);
    if (!form.value.rol && roles.value.length)
      form.value.rol = roles.value[0].idRol;
  } catch (e) {
    error.value = e.message;
  }
}

async function agregar() {
  if (
    !form.value.usuario ||
    !form.value.nombre ||
    !form.value.password ||
    !form.value.rol
  )
    return;
  guardando.value = true;
  error.value = "";
  try {
    const data = {
      nombre: form.value.nombre,
      correo: form.value.usuario,
      contraseña: form.value.password,
      idRol: Number(form.value.rol),
    };
    if (editando.value) await api.put(`/usuarios/${editando.value}`, data);
    else await api.post("/usuarios", data);
    await cargar();
    form.value = {
      usuario: "",
      nombre: "",
      password: "",
      rol: roles.value[0]?.idRol || "",
    };
    editando.value = null;
  } catch (e) {
    error.value = e.message;
  } finally {
    guardando.value = false;
  }
}

function editar(usuario) {
  editando.value = usuario.idUsuario;
  form.value = {
    usuario: usuario.correo,
    nombre: usuario.nombre,
    password: usuario.contraseña,
    rol: usuario.idRol,
  };
}

async function eliminar(usuario) {
  if (!confirm(`¿Eliminar el usuario ${usuario.correo}?`)) return;
  try {
    await api.delete(`/usuarios/${usuario.idUsuario}`);
    await cargar();
  } catch (e) {
    error.value = e.message;
  }
}

onMounted(cargar);
</script>

<template>
  <div class="card">
    <h2>Gestión de usuarios (RF01)</h2>
    <div class="row">
      <input class="input" v-model="form.usuario" placeholder="Usuario" />
      <input
        class="input"
        v-model="form.nombre"
        placeholder="Nombre completo"
      />
      <input
        class="input"
        type="password"
        v-model="form.password"
        placeholder="Contraseña"
      />
      <select class="input" v-model="form.rol">
        <option v-for="rol in roles" :key="rol.idRol" :value="rol.idRol">
          {{ rol.nombreRol }}
        </option>
      </select>
      <button class="btn" :disabled="guardando" @click="agregar">
        {{
          guardando
            ? "Guardando..."
            : editando
              ? "Actualizar usuario"
              : "Crear usuario"
        }}
      </button>
      <button
        v-if="editando"
        class="btn"
        type="button"
        @click="editando = null"
      >
        Cancelar
      </button>
    </div>
    <p v-if="error" class="alert alert-danger">{{ error }}</p>
  </div>

  <div class="card">
    <h2>Roles y responsabilidades</h2>
    <table>
      <thead>
        <tr>
          <th>Rol</th>
          <th>Responsabilidad</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rol in roles" :key="`descripcion-${rol.idRol}`">
          <td>{{ rol.nombreRol }}</td>
          <td>
            {{
              descripciones[rol.nombreRol] || "Rol configurado en el sistema."
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <h2>Usuarios del sistema</h2>
    <table>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Nombre</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in lista" :key="u.idUsuario">
          <td>{{ u.correo }}</td>
          <td>{{ u.nombre }}</td>
          <td>{{ u.rol?.nombreRol || u.idRol }}</td>
          <td><span class="pill pill-act">Activo</span></td>
          <td>
            <button class="btn" @click="editar(u)">Editar</button>
            <button class="btn" @click="eliminar(u)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
