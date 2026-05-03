import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

export function useAuth() {
  const store = useAuthStore()
  const { user, userData, userDataPending, isSecretary, isDoctor, isPatient } = storeToRefs(store)

  return {
    user,
    userData,
    userDataPending,
    isSecretary,
    isDoctor,
    isPatient,
    login: store.login,
    logout: store.logout,
    registerPatient: store.registerPatient,
  }
}
