<script setup lang="ts">
import type { IMedicalAppointment } from '#shared/types/medicalAppointmentTypes'

const props = defineProps<{
  appointment: IMedicalAppointment
  doctorName?: string
  patientName?: string
  showCancel?: boolean
  cancelLoading?: boolean
}>()

const emit = defineEmits<{
  cancel: [appointmentId: string]
}>()

const statusLabels: Record<string, string> = {
  scheduled: 'Programada',
  cancelled: 'Cancelada',
  completed: 'Completada',
}

const statusClasses: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
}

const formattedDate = computed(() => {
  const d = props.appointment.date
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between">
      <div class="space-y-1">
        <p class="text-sm font-semibold text-gray-900">
          {{ formattedDate }} — {{ appointment.time }}
        </p>
        <p class="text-sm text-gray-600">
          Tipo: {{ appointment.type }}
        </p>
        <p v-if="doctorName" class="text-sm text-gray-600">
          Doctor: {{ doctorName }}
        </p>
        <p v-if="patientName" class="text-sm text-gray-600">
          Paciente: {{ patientName }}
        </p>
      </div>

      <span
        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
        :class="statusClasses[appointment.status] ?? 'bg-gray-100 text-gray-700'"
      >
        {{ statusLabels[appointment.status] ?? appointment.status }}
      </span>
    </div>

    <div v-if="showCancel && appointment.status === 'scheduled'" class="mt-3 flex justify-end">
      <button
        :disabled="cancelLoading"
        class="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
        @click="emit('cancel', appointment.id)"
      >
        Cancelar cita
      </button>
    </div>
  </div>
</template>
