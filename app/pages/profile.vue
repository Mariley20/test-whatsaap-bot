<script setup lang="ts">
import { DOCUMENT_TYPES } from '#shared/constants/documentTypes'
import { storeToRefs } from 'pinia'
import { validateProfile } from '#shared/utils/validation'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { updateUser } = useUsers()

const form = reactive({
  fullName: '',
  email: '',
  documentType: '',
  documentNumber: '',
  phoneNumber: '',
})

const fieldErrors = ref<Record<string, string>>({})
const generalError = ref('')
const successMessage = ref('')
const loading = ref(false)
const initialized = ref(false)

const documentTypes = DOCUMENT_TYPES

watch(user, (data) => {
  if (data && !initialized.value) {
    form.fullName = data.fullName || ''
    form.email = data.email || ''
    form.documentType = data.documentType || ''
    form.documentNumber = data.documentNumber || ''
    form.phoneNumber = data.phoneNumber || ''
    initialized.value = true
  }
}, { immediate: true })

async function handleSubmit() {
  generalError.value = ''
  successMessage.value = ''
  fieldErrors.value = {}

  const validation = validateProfile(form)
  if (!validation.valid) {
    fieldErrors.value = validation.errors
    return
  }

  if (!user.value) return

  loading.value = true
  try {
    await updateUser(user.value.uid, {
      fullName: form.fullName,
      documentType: form.documentType,
      documentNumber: form.documentNumber,
      phoneNumber: form.phoneNumber,
    })
    successMessage.value = 'Perfil actualizado exitosamente'
  } catch {
    generalError.value = 'Ocurrió un error al actualizar el perfil'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Mi perfil</h1>
      <p class="mt-1 text-sm text-gray-500">Consulte y actualice sus datos personales</p>
    </div>

    <div v-if="successMessage" class="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700" role="status">
      {{ successMessage }}
    </div>

    <div v-if="generalError" class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
      {{ generalError }}
    </div>

    <div v-if="!user" class="text-sm text-gray-500">Cargando datos del perfil...</div>

    <form v-else class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label for="fullName" class="block text-sm font-medium text-gray-700">Nombre completo</label>
        <input id="fullName" v-model="form.fullName" type="text"
          class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
          :class="fieldErrors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'" />
        <p v-if="fieldErrors.fullName" class="mt-1 text-sm text-red-600">{{ fieldErrors.fullName }}</p>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
        <input id="email" v-model="form.email" type="email" disabled
          class="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 shadow-sm" />
        <p class="mt-1 text-xs text-gray-400">El correo no se puede modificar</p>
        <p v-if="fieldErrors.email" class="mt-1 text-sm text-red-600">{{ fieldErrors.email }}</p>
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

      <div class="flex items-center gap-3 pt-2">
        <button type="submit" :disabled="loading"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <span v-if="loading">Guardando...</span>
          <span v-else>Guardar cambios</span>
        </button>
        <NuxtLink to="/"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Volver
        </NuxtLink>
      </div>
    </form>
  </div>
</template>
