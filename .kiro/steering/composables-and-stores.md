# Composables y Stores — Arquitectura

## Regla General

La lógica de integración con servicios externos (Firebase, APIs) va en **composables**. El estado global de la aplicación va en **stores (Pinia)**.

```
Composable (useAuth, useFirestore...)
         ↓
Store (authStore, appointmentStore...)
         ↓
Componentes (UI)
```

## Composables (`app/composables/`)

Los composables encapsulan la **lógica de integración con Firebase** u otros servicios. No guardan estado global.

### Responsabilidades

- Llamadas a Firebase Auth: login, logout, registro, `onAuthStateChanged`
- Llamadas a Firestore: CRUD de documentos y colecciones
- Retornar datos y funciones, nunca estado global compartido
- Manejar errores de Firebase y transformarlos en mensajes útiles

### Convenciones

- Nombre con prefijo `use`: `useAuth`, `useFirestore`, `useAppointments`
- Ubicación: `app/composables/`
- Auto-importados por Nuxt (no necesitan import explícito)
- Pueden recibir parámetros (refs, IDs, etc.)
- NO deben acceder directamente al store — el componente o la página es quien conecta composable ↔ store

### Ejemplo de estructura (useAuth)

```ts
// app/composables/useAuth.ts
export function useAuth() {
  // Integración directa con Firebase Auth
  async function login(email: string, password: string) { /* ... */ }
  async function logout() { /* ... */ }
  function onAuthChange(callback: (user: User | null) => void) { /* ... */ }

  return { login, logout, onAuthChange }
}
```

## Stores (`app/stores/`)

Los stores (Pinia) guardan el **estado global reactivo** de la aplicación. No llaman a Firebase directamente.

### Responsabilidades

- Mantener estado global: usuario actual, loading, isAuthenticated
- Proveer getters derivados del estado (rol del usuario, permisos, etc.)
- Exponer actions que orquestan composables y actualizan el estado
- Ser la fuente de verdad para los componentes

### Convenciones

- Nombre con sufijo `Store`: `useAuthStore`, `useAppointmentStore`
- Ubicación: `app/stores/`
- Usar `defineStore` de Pinia con setup syntax (composition API)
- Los actions del store pueden llamar a composables para ejecutar operaciones y luego actualizar el estado
- Los componentes leen estado del store, no del composable

### Ejemplo de estructura (authStore)

```ts
// app/stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser | null>(null)
  const loading = ref(true)
  const isAuthenticated = computed(() => !!user.value)

  // Actions que orquestan composable + estado
  async function login(email: string, password: string) {
    const { login: firebaseLogin } = useAuth()
    await firebaseLogin(email, password)
    // actualizar estado...
  }

  return { user, loading, isAuthenticated, login }
})
```

## Flujo Completo

1. **Componente** llama a un action del **store** (ej: `authStore.login(email, password)`)
2. **Store** usa el **composable** para ejecutar la operación en Firebase
3. **Composable** ejecuta la llamada a Firebase y retorna el resultado
4. **Store** actualiza su estado reactivo con el resultado
5. **Componente** reacciona al cambio de estado del store (reactividad de Vue)

## Qué NO hacer

- ❌ Guardar estado global en un composable (usar store)
- ❌ Llamar a Firebase directamente desde un componente o página
- ❌ Llamar a Firebase directamente desde un store (usar composable)
- ❌ Que un composable importe y modifique un store
- ❌ Duplicar estado entre composable y store
