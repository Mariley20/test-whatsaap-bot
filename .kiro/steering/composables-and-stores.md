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

## Composables (`front/app/composables/`)

Los composables encapsulan la **lógica de integración con Firebase** u otros servicios. No guardan estado global.

### Responsabilidades

- Llamadas a Firebase Auth: login, logout, registro, `onAuthStateChanged`
- Llamadas a Firestore: CRUD de documentos y colecciones
- Retornar datos y funciones, nunca estado global compartido
- Manejar errores de Firebase y transformarlos en mensajes útiles

### Convenciones

- Nombre con prefijo `use`: `useAuth`, `useFirestore`, `useAppointments`, `useUsers`
- Ubicación: `front/app/composables/`
- Auto-importados por Nuxt (no necesitan import explícito)
- Pueden recibir parámetros (refs, IDs, etc.)
- `useAuth` es la excepción: accede a `authStore.setUser()` para sincronizar estado tras operaciones de Firebase Auth

### Composables actuales

- `useFirebase.ts` — Instancias de Firebase Auth y Firestore, `useCurrentUser()`, `getCurrentUser()`
- `useAuth.ts` — Login, logout, registerPatient, waitForAuthState, mapFirebaseUser
- `useUsers.ts` — CRUD de usuarios en Firestore (getUserById, updateUser, getDoctors, getPatients)
- `useAppointments.ts` — CRUD de citas, slots disponibles

## Stores (`front/app/stores/`)

Los stores (Pinia) guardan el **estado global reactivo** de la aplicación. No llaman a Firebase directamente.

### Responsabilidades

- Mantener estado global: usuario actual, loading, isAuthenticated
- Proveer getters derivados del estado (rol del usuario, permisos, etc.)
- Exponer actions que orquestan composables y actualizan el estado
- Ser la fuente de verdad para los componentes

### Convenciones

- Nombre con sufijo `Store`: `useAuthStore`, `useAppointmentStore`
- Ubicación: `front/app/stores/`
- Usar `defineStore` de Pinia con setup syntax (composition API)
- Los actions del store llaman a composables para ejecutar operaciones y luego actualizan el estado
- Los componentes leen estado del store con `storeToRefs()`, no del composable

### Store actual (authStore)

- State: `user` (IUser | null), `loading` (boolean)
- Getters: `isAuthenticated`, `isSecretary`, `isDoctor`, `isPatient`
- Actions: `setUser(data)`, `fetchUser()` (usado en middlewares)

## Flujo de Autenticación

1. **Login**: Componente llama `useAuth().login()` → Firebase Auth → Firestore doc → `authStore.setUser()`
2. **Middleware**: `authStore.fetchUser()` → `useAuth().waitForAuthState()` → resuelve usuario → `setUser()`
3. **Logout**: Componente llama `useAuth().logout()` → Firebase signOut → `authStore.setUser(null)` → `navigateTo('/login')`
4. Si no existe documento en Firestore, se construye IUser básico desde Firebase Auth (`mapFirebaseUser`)

## Qué NO hacer

- ❌ Guardar estado global en un composable (usar store)
- ❌ Llamar a Firebase directamente desde un componente o página
- ❌ Llamar a Firebase directamente desde un store (usar composable)
- ❌ Duplicar estado entre composable y store
