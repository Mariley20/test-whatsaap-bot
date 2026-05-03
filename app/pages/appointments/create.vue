<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { CreateAppointmentData } from '#shared/utils/validation'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const { isSecretary } = storeToRefs(authStore)
const { createAppointment } = useAppointments()

const loading = ref(false)
const generalError = ref('')
const successMessage = ref('')

async function handleSubmit(data: CreateAppointmentData) {
  generalError.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    await createAppointment(data)
    successMessage.value = 'Cita agendada exitosamente'
  } catch (error: unknown) {
    const err = error as Error
    if (err.message === 'Este horario no está disponible') {
      generalError.value = 'Este horario no está disponible. Por favor seleccione otro.'
    } else {
      generalError.value = 'Ocurrió un error al agendar la cita'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
    <div v-if="!isSecretary" class="rounded-md bg-yellow-50 p-4 text-sm text-yellow-700" role="alert">
      No tiene permisos para acceder a esta página.
    </div>

    <template v-else>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Agendar cita</h1>
        <p class="mt-1 text-sm text-gray-500">Complete los datos para agendar una nueva cita</p>
      </div>

      <div v-if="successMessage" class="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700" role="status">
        {{ successMessage }}
      </div>

      <div v-if="generalError" class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
        {{ generalError }}
      </div>

      <AppointmentForm :loading="loading" @submit="handleSubmit" />
    </template>
  </div>
</template>
