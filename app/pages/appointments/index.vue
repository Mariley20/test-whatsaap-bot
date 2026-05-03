<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { user, userData, isSecretary, isDoctor, isPatient } = useAuth()
const { getAllAppointments, getAppointmentsByDoctor, getAppointmentsByPatient, cancelAppointment } = useAppointments()
const { getDoctors, getPatients } = useUsers()

const cancellingId = ref<string | null>(null)
const cancelError = ref('')

// Load user name lookup lists
const doctors = getDoctors()
const patients = getPatients()

// Build name maps for display
const doctorNameMap = computed(() => {
  const map: Record<string, string> = {}
  for (const d of doctors.value ?? []) {
    map[d.uid] = d.fullName
  }
  return map
})

const patientNameMap = computed(() => {
  const map: Record<string, string> = {}
  for (const p of patients.value ?? []) {
    map[p.uid] = p.fullName
  }
  return map
})

// Fetch appointments based on role
const allAppointments = computed(() => {
  if (isSecretary.value) return getAllAppointments()
  if (isDoctor.value && user.value) return getAppointmentsByDoctor(user.value.uid)
  if (isPatient.value && user.value) return getAppointmentsByPatient(user.value.uid)
  return ref([])
})

// Unwrap the nested ref
const appointments = computed(() => allAppointments.value.value ?? [])

async function handleCancel(appointmentId: string) {
  cancelError.value = ''
  cancellingId.value = appointmentId
  try {
    await cancelAppointment(appointmentId)
  } catch (error: unknown) {
    cancelError.value = (error as Error).message
  } finally {
    cancellingId.value = null
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Citas</h1>
        <p class="mt-1 text-sm text-gray-500">
          <template v-if="isSecretary">Todas las citas del sistema</template>
          <template v-else-if="isDoctor">Sus citas asignadas</template>
          <template v-else-if="isPatient">Sus citas programadas</template>
          <template v-else>Lista de citas</template>
        </p>
      </div>

      <NuxtLink
        v-if="isSecretary"
        to="/appointments/create"
        class="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Agendar cita
      </NuxtLink>
    </div>

    <div v-if="cancelError" class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
      {{ cancelError }}
    </div>

    <div v-if="appointments.length === 0" class="rounded-lg border border-gray-200 bg-white p-8 text-center">
      <p class="text-sm text-gray-500">No hay citas para mostrar</p>
    </div>

    <div v-else class="space-y-3">
      <AppointmentCard
        v-for="appointment in appointments"
        :key="appointment.id"
        :appointment="appointment"
        :doctor-name="doctorNameMap[appointment.doctor_id]"
        :patient-name="patientNameMap[appointment.patient_id]"
        :show-cancel="isSecretary"
        :cancel-loading="cancellingId === appointment.id"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>
