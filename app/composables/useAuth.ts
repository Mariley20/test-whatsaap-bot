import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { initializeApp, deleteApp } from 'firebase/app'
import type { IUser, UserRegistrationData } from '#shared/types/userTypes'
import { USER_ROLE_PATIENT } from '#shared/constants/userRoles'

/**
 * Composable que encapsula la integración con Firebase Auth.
 * Cada método que obtiene/modifica el usuario llama a authStore.setUser()
 * para mantener el estado global sincronizado.
 */
export function useAuth() {
  const auth = useFirebaseAuth()
  const db = useFirestore()
  const authStore = useAuthStore()

  /**
   * Inicia sesión con email y contraseña.
   * Al éxito, obtiene el documento de Firestore y actualiza el store.
   * Si no existe documento en Firestore, usa los datos de Firebase Auth.
   */
  async function login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const userData = await fetchUserDoc(credential.user.uid) ?? mapFirebaseUser(credential.user)
    authStore.setUser(userData)
  }

  /**
   * Cierra la sesión y limpia el estado del store.
   */
  async function logout(): Promise<void> {
    await signOut(auth)
    authStore.setUser(null)
  }

  /**
   * Registra un paciente usando una app secundaria de Firebase
   * para no afectar la sesión actual (secretaria).
   */
  async function registerPatient(data: UserRegistrationData): Promise<string> {
    const secondaryApp = initializeApp(auth.app.options, 'secondaryApp')
    const secondaryAuth = getAuth(secondaryApp)

    try {
      const credential = await createUserWithEmailAndPassword(
        secondaryAuth,
        data.email,
        data.password,
      )
      const uid = credential.user.uid

      await setDoc(doc(db, 'users', uid), {
        uid,
        fullName: data.fullName,
        email: data.email,
        emailVerified: false,
        documentNumber: data.documentNumber,
        documentType: data.documentType,
        phoneNumber: data.phoneNumber,
        photoURL: '',
        role: USER_ROLE_PATIENT,
        acceptedTermsAndConditions: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        workingHours: [],
      })

      await signOut(secondaryAuth)
      await deleteApp(secondaryApp)

      return uid
    } catch (error) {
      await deleteApp(secondaryApp)
      throw error
    }
  }

  /**
   * Espera a que Firebase Auth determine el estado inicial.
   * Si hay usuario autenticado, intenta obtener doc de Firestore.
   * Si no existe en Firestore, retorna IUser básico desde Firebase Auth.
   */
  function waitForAuthState(): Promise<IUser | null> {
    return new Promise<IUser | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        unsubscribe()
        console.log('firebaseUser', firebaseUser)
        if (firebaseUser) {
          const userData = await fetchUserDoc(firebaseUser.uid) ?? mapFirebaseUser(firebaseUser)
          resolve(userData)
        } else {
          resolve(null)
        }
      })
    })
  }

  /**
   * Obtiene el documento de usuario desde Firestore por UID.
   */
  async function fetchUserDoc(uid: string): Promise<IUser | null> {
    const snapshot = await getDoc(doc(db, 'users', uid))
    return snapshot.exists()
      ? ({ ...snapshot.data(), uid: snapshot.id } as IUser)
      : null
  }

  /**
   * Construye un IUser básico desde un Firebase Auth User.
   * Fallback cuando no existe documento en Firestore.
   */
  function mapFirebaseUser(firebaseUser: User): IUser {
    return {
      uid: firebaseUser.uid,
      fullName: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      emailVerified: firebaseUser.emailVerified,
      documentNumber: '',
      documentType: '',
      phoneNumber: firebaseUser.phoneNumber || '',
      photoURL: firebaseUser.photoURL || '',
      role: '',
      acceptedTermsAndConditions: false,
      createdAt: null,
      updatedAt: null,
      workingHours: [],
    }
  }

  return {
    login,
    logout,
    registerPatient,
    waitForAuthState,
  }
}
