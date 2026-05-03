<script setup lang="ts">
import { validateRegistration } from '#shared/utils/validation'
import type { UserRegistrationData } from '#shared/types/userTypes'

definePageMeta({
  middleware: 'auth',
})

const { isSecretary, registerPatient } = useAuth()

const form = reactive<UserRegistrationData>({
  fullName: '',
  documentType: '',
  documentNumber: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const fieldErrors = ref<Record<string, string>>({})
const generalError = ref('')
const successMessage = ref('')
const loading = ref(false)

const documentTypes = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'PP', label: 'Pasaporte' },
]

function resetForm() {
  form.fullName = ''
  form.documentType = ''
  form.documentNumber = ''
  form.phoneNumber = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  fieldErrors.value = {}
  generalError.value = ''
}

async function handleSubmit() {
  generalError.value = ''
  successMessage.value = ''
  fieldErrors.value = {}

  const validation = validateRegistration(form)
  if (!validation.valid) {
    fieldErrors.value = validation.errors
    return
  }

  if (form.password !== form.confirmPassword) {
    fieldErrors.value = { confirmPassword: 'Las contraseñas no coinciden' }
    return
  }

  loading.value = true
  try {
    await registerPatient(form)
    successMessage.value = 'Paciente registrado exitosamente'
    resetForm()
  } catch (error: unknown) {
    const firebaseError = error as { code?: string }
    if (firebaseError.code === 'auth/email-already-in-use') {
      fieldErrors.value = { email: 'Este correo ya está en uso' }
    } else {
      generalError.value = 'Ocurrió un error al registrar el paciente'
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
        <h1 class="text-2xl font-bold text-gray-900">Registrar paciente</h1>
        <p class="mt-1 text-sm text-gray-500">Complete los datos del nuevo paciente</p>
      </div>

      <div v-if="successMessage" class="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700" role="status">
        {{ successMessage }}
      </div>

      <div v-if="generalError" class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
        {{ generalError }}
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label for="fullName" class="block text-sm font-medium text-gray-700">Nombre completo</label>
          <input id="fullName" v-model="form.fullName" type="text"
            class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
            :class="fieldErrors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'" />
          <p v-if="fieldErrors.fullName" class="mt-1 text-sm text-red-600">{{ fieldErrors.fullName }}</p>
        </div>

        <div>
          <label for="documentType" class="block text-sm font-medium text-gray-700">Tipo de documento</label>
          <select id="documentType" v-model="form.documentType"
            class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
            :class="fieldErrors.documentType ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'">
            <option value="" disabled>Seleccione un tipo</option>
            <option v-for="dt in documentTypes" :key="dt.value" :value="dt.value">{{ dt.label }}</option>
          </select>
          <p v-if="fieldErrors.documentType" class="mt-1 text-sm text-red-600">{{ fieldErrors.documentType }}</p>
        </div>

        <div>
          <label for="documentNumber" class="block text-sm font-medium text-gray-700">Número de documento</label>
          <input id="documentNumber" v-model="form.documentNumber" type="text"
            class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
            :class="fieldErrors.documentNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'" />
          <p v-if="fieldErrors.documentNumber" class="mt-1 text-sm text-red-600">{{ fieldErrors.documentNumber }}</p>
        </div>

        <div>
          <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Teléfono</label>
          <input id="phoneNumber" v-model="form.phoneNumber" type="tel"
            class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
            :class="fieldErrors.phoneNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'" />
          <p v-if="fieldErrors.phoneNumber" class="mt-1 text-sm text-red-600">{{ fieldErrors.phoneNumber }}</p>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input id="email" v-model="form.email" type="email" autocomplete="email" placeholder="correo@ejemplo.com"
            class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
            :class="fieldErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'" />
          <p v-if="fieldErrors.email" class="mt-1 text-sm text-red-600">{{ fieldErrors.email }}</p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input id="password" v-model="form.password" type="password" autocomplete="new-password" placeholder="Mínimo 6 caracteres"
            class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
            :class="fieldErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'" />
          <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-600">{{ fieldErrors.password }}</p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
          <input id="confirmPassword" v-model="form.confirmPassword" type="password" autocomplete="new-password" placeholder="Repita la contraseña"
            class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
            :class="fieldErrors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'" />
          <p v-if="fieldErrors.confirmPassword" class="mt-1 text-sm text-red-600">{{ fieldErrors.confirmPassword }}</p>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button type="submit" :disabled="loading"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <span v-if="loading">Registrando...</span>
            <span v-else>Registrar paciente</span>
          </button>
          <NuxtLink to="/"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Cancelar
          </NuxtLink>
        </div>
      </form>
    </template>
  </div>
</template>
