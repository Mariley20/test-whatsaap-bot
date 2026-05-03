import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  getAuth,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { initializeApp, deleteApp } from 'firebase/app'
import type { IUser, UserRegistrationData } from '#shared/types/userTypes'
import {
  USER_ROLE_PATIENT,
  USER_ROLE_SECRETARY,
  USER_ROLE_DOCTOR,
} from '#shared/constants/userRoles'

export const useAuthStore = defineStore('auth', () => {
  const auth = useFirebaseAuth()
  const user = useCurrentUser()
  const db = useFirestore()

  const userData = ref<IUser | null>(null)
  const userDataPending = ref(true)

  let unsubscribeDoc: (() => void) | null = null

  // Watch auth user and bind/unbind Firestore document
  watch(user, (newUser) => {
    // Clean up previous listener
    if (unsubscribeDoc) {
      unsubscribeDoc()
      unsubscribeDoc = null
    }

    if (newUser) {
      const userDocRef = doc(db, 'users', newUser.uid)
      unsubscribeDoc = onSnapshot(userDocRef, (snapshot) => {
        userData.value = snapshot.exists() ? ({ ...snapshot.data(), uid: snapshot.id } as IUser) : null
        userDataPending.value = false
      })
    } else {
      userData.value = null
      userDataPending.value = true
    }
  }, { immediate: true })

  // Getters
  const isSecretary = computed(() => userData.value?.role === USER_ROLE_SECRETARY)
  const isDoctor = computed(() => userData.value?.role === USER_ROLE_DOCTOR)
  const isPatient = computed(() => userData.value?.role === USER_ROLE_PATIENT)

  // Actions
  async function login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout(): Promise<void> {
    await signOut(auth)
    userData.value = null
    userDataPending.value = true
    await navigateTo('/login')
  }

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

  return {
    user,
    userData,
    userDataPending,
    isSecretary,
    isDoctor,
    isPatient,
    login,
    logout,
    registerPatient,
  }
})
