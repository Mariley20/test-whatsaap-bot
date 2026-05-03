import { defineStore } from 'pinia'
import type { IUser } from '#shared/types/userTypes'
import {
  USER_ROLE_SECRETARY,
  USER_ROLE_DOCTOR,
  USER_ROLE_PATIENT,
} from '#shared/constants/userRoles'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<IUser | null>(null)
  const loading = ref(true)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const isSecretary = computed(() => user.value?.role === USER_ROLE_SECRETARY)
  const isDoctor = computed(() => user.value?.role === USER_ROLE_DOCTOR)
  const isPatient = computed(() => user.value?.role === USER_ROLE_PATIENT)

  /**
   * Actualiza el estado del usuario en el store.
   * Llamado desde useAuth() tras cada operación de Firebase Auth.
   */
  function setUser(data: IUser | null): void {
    user.value = data
    loading.value = false
  }

  /**
   * Espera a que se determine el estado de autenticación.
   * Si ya se resolvió, retorna inmediatamente.
   * Usado en middlewares para decidir redirecciones.
   */
  async function fetchUser(): Promise<IUser | null> {
    const { waitForAuthState } = useAuth()
    const userData = await waitForAuthState()
    console.log('fetch, userData', userData)
    setUser(userData)
    return user.value
  }

  return {
    user,
    loading,
    isAuthenticated,
    isSecretary,
    isDoctor,
    isPatient,
    setUser,
    fetchUser,
  }
})
