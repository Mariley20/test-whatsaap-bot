export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()
  await authStore.fetchUser()
console.log('midleware auth',authStore.user)
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
