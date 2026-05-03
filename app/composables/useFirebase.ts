import { type Auth, onAuthStateChanged, type User } from 'firebase/auth'
import { type Firestore } from 'firebase/firestore'
import { ref, type Ref } from 'vue'

let _currentUser: Ref<User | null> | null = null
let _listenerInitialized = false

/**
 * Returns the Firebase Auth instance from the plugin.
 */
export function useFirebaseAuth(): Auth {
  const { $auth } = useNuxtApp()
  return $auth as Auth
}

/**
 * Returns the Firestore instance from the plugin.
 */
export function useFirestore(): Firestore {
  const { $firestore } = useNuxtApp()
  return $firestore as Firestore
}

/**
 * Returns a reactive ref of the current Firebase Auth user.
 * Singleton — the auth listener is set up once.
 */
export function useCurrentUser(): Ref<User | null> {
  if (!_currentUser) {
    _currentUser = ref<User | null>(null)
  }

  if (!_listenerInitialized) {
    _listenerInitialized = true
    const auth = useFirebaseAuth()
    onAuthStateChanged(auth, (user) => {
      _currentUser!.value = user
    })
  }

  return _currentUser
}

/**
 * Async function that resolves once the initial auth state is known.
 * Useful in middleware to wait for auth before deciding on redirects.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { $authReady } = useNuxtApp()
  return $authReady as Promise<User | null>
}
