<script setup lang="ts">
import { validateAppointment } from '#shared/utils/validation'
import type { CreateAppointmentData } from '#shared/utils/validation'

const emit = defineEmits<{
  submit: [data: CreateAppointmentData]
}>()

defineProps<{
  loading?: boolean
}>()

const { getDoctors, getPatients } = useUsers()
const { getAvailableSlots } = useAppointments()

const doctors = getDoctors()
const patients = getPatients()

const form = reactive<CreateAppointmentData>({
  patient_id: '',
  doctor_id: '',
  date: '',
  time: '',
  type: '',
  description: '',
})

const fieldErrors = ref<Record<string, string>>({})

const appointmentTypes = [
  { value: 'general', label: 'Consulta general' },
  { value: 'control', label: 'Control' },
  { value: 'urgencia', label: 'Urgencia' },
  { value: 'especialista', label: 'Especialista' },
]

// Available slots computed reactively based on doctor + date selection
const availableSlots = ref<string[]>([])
const loadingSlots = ref(false)

watch(
  () => [form.doctor_id, form.date] as const,
  ([doctorId, date]) => {
    // Reset time when doctor or date changes
    form.time = ''
    availableSlots.value = []

    if (!doctorId || !date) {
      return
    }

    loadingSlots.value = true
    const slots = getAvailableSlots(doctorId, date)

    // Watch the computed returned by getAvailableSlots
    const stop = watch(
      slots,
      (newSlots) => {
        availableSlots.value = newSlots
        loadingSlots.value = false
        stop()
      },
      { immediate: true },
    )
  },
)

// Minimum date is today
const minDate = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

function handleSubmit() {
  fieldErrors.value = {}

  const validation = validateAppointment(form)
  if (!validation.valid) {
    fieldErrors.value = validation.errors
    return
  }

  emit('submit', { ...form })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <!-- Paciente -->
    <div>
      <label for="patient_id" class="block text-sm font-medium text-gray-700">Paciente</label>
      <select
        id="patient_id"
        v-model="form.patient_id"
        class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
        :class="fieldErrors.patient_id ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'"
      >
        <option value="" disabled>Seleccione un paciente</option>
        <option v-for="patient in patients" :key="patient.uid" :value="patient.uid">
          {{ patient.fullName }}
        </option>
      </select>
      <p v-if="fieldErrors.patient_id" class="mt-1 text-sm text-red-600">{{ fieldErrors.patient_id }}</p>
    </div>

    <!-- Doctor -->
    <div>
      <label for="doctor_id" class="block text-sm font-medium text-gray-700">Doctor</label>
      <select
        id="doctor_id"
        v-model="form.doctor_id"
        class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
        :class="fieldErrors.doctor_id ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'"
      >
        <option value="" disabled>Seleccione un doctor</option>
        <option v-for="doctor in doctors" :key="doctor.uid" :value="doctor.uid">
          {{ doctor.fullName }}
        </option>
      </select>
      <p v-if="fieldErrors.doctor_id" class="mt-1 text-sm text-red-600">{{ fieldErrors.doctor_id }}</p>
    </div>

    <!-- Fecha -->
    <div>
      <label for="date" class="block text-sm font-medium text-gray-700">Fecha</label>
      <input
        id="date"
        v-model="form.date"
        type="date"
        :min="minDate"
        class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
        :class="fieldErrors.date ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'"
      />
      <p v-if="fieldErrors.date" class="mt-1 text-sm text-red-600">{{ fieldErrors.date }}</p>
    </div>

    <!-- Hora -->
    <div>
      <label for="time" class="block text-sm font-medium text-gray-700">Hora</label>
      <select
        id="time"
        v-model="form.time"
        :disabled="!form.doctor_id || !form.date || loadingSlots"
        class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-gray-100"
        :class="fieldErrors.time ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'"
      >
        <option value="" disabled>
          <template v-if="loadingSlots">Cargando horarios...</template>
          <template v-else-if="!form.doctor_id || !form.date">Seleccione doctor y fecha primero</template>
          <template v-else-if="availableSlots.length === 0">No hay horarios disponibles</template>
          <template v-else>Seleccione una hora</template>
        </option>
        <option v-for="slot in availableSlots" :key="slot" :value="slot">
          {{ slot }}
        </option>
      </select>
      <p v-if="fieldErrors.time" class="mt-1 text-sm text-red-600">{{ fieldErrors.time }}</p>
      <p v-if="form.doctor_id && form.date && !loadingSlots && availableSlots.length === 0" class="mt-1 text-sm text-yellow-600">
        No hay horarios disponibles para esta fecha
      </p>
    </div>

    <!-- Tipo de cita -->
    <div>
      <label for="type" class="block text-sm font-medium text-gray-700">Tipo de cita</label>
      <select
        id="type"
        v-model="form.type"
        class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
        :class="fieldErrors.type ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'"
      >
        <option value="" disabled>Seleccione un tipo</option>
        <option v-for="at in appointmentTypes" :key="at.value" :value="at.value">
          {{ at.label }}
        </option>
      </select>
      <p v-if="fieldErrors.type" class="mt-1 text-sm text-red-600">{{ fieldErrors.type }}</p>
    </div>

    <!-- Descripción -->
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
      <textarea
        id="description"
        v-model="form.description"
        rows="3"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Motivo de la consulta (opcional)"
      />
    </div>

    <!-- Botones -->
    <div class="flex items-center gap-3 pt-2">
      <button
        type="submit"
        :disabled="loading"
        class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span v-if="loading">Agendando...</span>
        <span v-else>Agendar cita</span>
      </button>
      <NuxtLink
        to="/"
        class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Cancelar
      </NuxtLink>
    </div>
  </form>
</template>
