import { ref, computed, watchEffect, onUnmounted } from 'vue'
import {
  collection,
  doc,
  updateDoc,
  serverTimestamp,
  where,
  query,
  onSnapshot,
} from 'firebase/firestore'
import type { IUser } from '#shared/types/userTypes'
import { USER_ROLE_DOCTOR, USER_ROLE_PATIENT } from '#shared/constants/userRoles'

export function useUsers() {
  const db = useFirestore()

  /**
   * Returns a reactive reference to a single user document by UID.
   */
  function getUserById(uid: string) {
    const data = ref<IUser | null>(null)
    if (uid) {
      const userRef = doc(db, 'users', uid)
      const unsubscribe = onSnapshot(userRef, (snapshot) => {
        data.value = snapshot.exists() ? ({ ...snapshot.data(), uid: snapshot.id } as IUser) : null
      })
      onUnmounted(unsubscribe)
    }
    return data
  }

  /**
   * Updates a user document in Firestore with the provided partial data.
   */
  async function updateUser(uid: string, data: Partial<IUser>): Promise<void> {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  }

  /**
   * Returns a reactive list of all users with the doctor role.
   */
  function getDoctors() {
    const data = ref<IUser[]>([])
    const q = query(collection(db, 'users'), where('role', '==', USER_ROLE_DOCTOR))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      data.value = snapshot.docs.map((d) => ({ ...d.data(), uid: d.id } as IUser))
    })
    onUnmounted(unsubscribe)
    return data
  }

  /**
   * Returns a reactive list of all users with the patient role.
   */
  function getPatients() {
    const data = ref<IUser[]>([])
    const q = query(collection(db, 'users'), where('role', '==', USER_ROLE_PATIENT))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      data.value = snapshot.docs.map((d) => ({ ...d.data(), uid: d.id } as IUser))
    })
    onUnmounted(unsubscribe)
    return data
  }

  return {
    getUserById,
    updateUser,
    getDoctors,
    getPatients,
  }
}
