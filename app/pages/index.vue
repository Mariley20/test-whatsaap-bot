<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { userData, isSecretary, isDoctor, isPatient } = useAuth()
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">
        Bienvenido{{ userData?.fullName ? `, ${userData.fullName}` : '' }}
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Panel principal de Maley
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        to="/appointments"
        class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <h2 class="text-base font-semibold text-gray-900">Citas</h2>
        <p class="mt-1 text-sm text-gray-500">
          <template v-if="isSecretary">Ver todas las citas del sistema</template>
          <template v-else-if="isDoctor">Ver sus citas asignadas</template>
          <template v-else-if="isPatient">Ver sus citas programadas</template>
          <template v-else>Ver citas</template>
        </p>
      </NuxtLink>

      <NuxtLink
        v-if="isSecretary"
        to="/appointments/create"
        class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <h2 class="text-base font-semibold text-gray-900">Agendar cita</h2>
        <p class="mt-1 text-sm text-gray-500">
          Crear una nueva cita para un paciente
        </p>
      </NuxtLink>

      <NuxtLink
        v-if="isSecretary"
        to="/patients/register"
        class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <h2 class="text-base font-semibold text-gray-900">Registrar paciente</h2>
        <p class="mt-1 text-sm text-gray-500">
          Registrar un nuevo paciente en el sistema
        </p>
      </NuxtLink>

      <NuxtLink
        to="/profile"
        class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <h2 class="text-base font-semibold text-gray-900">Perfil</h2>
        <p class="mt-1 text-sm text-gray-500">
          Ver y editar sus datos personales
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
