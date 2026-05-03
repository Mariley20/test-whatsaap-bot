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