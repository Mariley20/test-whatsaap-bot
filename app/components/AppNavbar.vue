<script setup lang="ts">
const { userData, isSecretary, logout } = useAuth()

const loading = ref(false)

async function handleLogout() {
  loading.value = true
  try {
    await logout()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <nav class="bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-14 items-center justify-between">
        <div class="flex items-center space-x-6">
          <NuxtLink to="/" class="text-lg font-bold text-gray-900">
            Maley
          </NuxtLink>

          <div class="hidden items-center space-x-4 sm:flex">
            <NuxtLink
              to="/"
              class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              active-class="bg-gray-100 text-gray-900"
            >
              Inicio
            </NuxtLink>

            <NuxtLink
              to="/appointments"
              class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              active-class="bg-gray-100 text-gray-900"
            >
              Citas
            </NuxtLink>

            <NuxtLink
              v-if="isSecretary"
              to="/patients/register"
              class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              active-class="bg-gray-100 text-gray-900"
            >
              Registrar paciente
            </NuxtLink>

            <NuxtLink
              v-if="isSecretary"
              to="/appointments/create"
              class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              active-class="bg-gray-100 text-gray-900"
            >
              Agendar cita
            </NuxtLink>

            <NuxtLink
              to="/profile"
              class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              active-class="bg-gray-100 text-gray-900"
            >
              Perfil
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <span v-if="userData" class="hidden text-sm text-gray-500 sm:inline">
            {{ userData.fullName }}
          </span>
          <button
            :disabled="loading"
            class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
            @click="handleLogout"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
