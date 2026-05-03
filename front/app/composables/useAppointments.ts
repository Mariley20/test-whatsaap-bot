import { computed, ref, onUnmounted } from 'vue'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore'
import type { IMedicalAppointment } from '#shared/types/medicalAppointmentTypes'
import type { IUser } from '#shared/types/userTypes'
import { generateTimeSlots, filterAvailableSlots } from '#shared/utils/slots'

export interface CreateAppointmentData {
  date: string
  time: string
  doctor_id: string
  patient_id: string
  type: string
  description: string
}

export function useAppointments() {
  const db = useFirestore()
  const appointmentsCol = collection(db, 'appointments')

  async function createAppointment(data: CreateAppointmentData): Promise<string> {
    const available = await isSlotAvailable(data.doctor_id, data.date, data.time)
    if (!available) {
      throw new Error('Este horario no está disponible')
    }

    const dateParts = data.date.split('-').map(Number)
    const year = dateParts[0] ?? 0
    const month = dateParts[1] ?? 1
    const day = dateParts[2] ?? 1

    const docRef = await addDoc(appointmentsCol, {
      date: Timestamp.fromDate(new Date(year, month - 1, day)),
      time: data.time,
      doctor_id: data.doctor_id,
      patient_id: data.patient_id,
      status: 'scheduled',
      type: data.type,
      description: data.description,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return docRef.id
  }

  async function cancelAppointment(appointmentId: string): Promise<void> {
    const appointmentRef = doc(db, 'appointments', appointmentId)
    const snapshot = await getDoc(appointmentRef)

    if (!snapshot.exists()) {
      throw new Error('La cita no existe')
    }

    const appointmentData = snapshot.data()
    if (appointmentData.status !== 'scheduled') {
      throw new Error('Solo se pueden cancelar citas programadas')
    }

    await updateDoc(appointmentRef, {
      status: 'cancelled',
      updatedAt: serverTimestamp(),
    })
  }

  function getAppointmentsByPatient(patientId: string) {
    const data = ref<IMedicalAppointment[]>([])
    const q = query(
      appointmentsCol,
      where('patient_id', '==', patientId),
      orderBy('date', 'desc'),
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      data.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as IMedicalAppointment))
    })
    onUnmounted(unsubscribe)
    return data
  }

  function getAppointmentsByDoctor(doctorId: string) {
    const data = ref<IMedicalAppointment[]>([])
    const q = query(
      appointmentsCol,
      where('doctor_id', '==', doctorId),
      orderBy('date', 'desc'),
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      data.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as IMedicalAppointment))
    })
    onUnmounted(unsubscribe)
    return data
  }

  function getAllAppointments() {
    const data = ref<IMedicalAppointment[]>([])
    const q = query(appointmentsCol, orderBy('date', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      data.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as IMedicalAppointment))
    })
    onUnmounted(unsubscribe)
    return data
  }

  function getAvailableSlots(doctorId: string, date: string) {
    const existingAppointments = ref<IMedicalAppointment[]>([])
    const doctorData = ref<IUser | null>(null)

    if (doctorId) {
      // Watch doctor document
      const doctorRef = doc(db, 'users', doctorId)
      const unsubDoc = onSnapshot(doctorRef, (snap) => {
        doctorData.value = snap.exists() ? (snap.data() as IUser) : null
      })
      onUnmounted(unsubDoc)

      // Watch appointments for this doctor on this date
      const dateParts = date.split('-').map(Number)
      const year = dateParts[0] ?? 0
      const month = dateParts[1] ?? 1
      const day = dateParts[2] ?? 1
      const dateStart = Timestamp.fromDate(new Date(year, month - 1, day, 0, 0, 0))
      const dateEnd = Timestamp.fromDate(new Date(year, month - 1, day, 23, 59, 59))

      const appointmentsQuery = query(
        appointmentsCol,
        where('doctor_id', '==', doctorId),
        where('date', '>=', dateStart),
        where('date', '<=', dateEnd),
      )
      const unsubAppts = onSnapshot(appointmentsQuery, (snapshot) => {
        existingAppointments.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as IMedicalAppointment))
      })
      onUnmounted(unsubAppts)
    }

    return computed(() => {
      if (!doctorData.value || !doctorData.value.workingHours) {
        return []
      }
      const allSlots = generateTimeSlots(doctorData.value.workingHours, date)
      return filterAvailableSlots(allSlots, existingAppointments.value)
    })
  }

  async function isSlotAvailable(doctorId: string, date: string, time: string): Promise<boolean> {
    const dateParts = date.split('-').map(Number)
    const year = dateParts[0] ?? 0
    const month = dateParts[1] ?? 1
    const day = dateParts[2] ?? 1
    const dateStart = Timestamp.fromDate(new Date(year, month - 1, day, 0, 0, 0))
    const dateEnd = Timestamp.fromDate(new Date(year, month - 1, day, 23, 59, 59))

    const q = query(
      appointmentsCol,
      where('doctor_id', '==', doctorId),
      where('date', '>=', dateStart),
      where('date', '<=', dateEnd),
      where('time', '==', time),
      where('status', '==', 'scheduled'),
    )

    const snapshot = await getDocs(q)
    return snapshot.empty
  }

  return {
    createAppointment,
    cancelAppointment,
    getAppointmentsByPatient,
    getAppointmentsByDoctor,
    getAllAppointments,
    getAvailableSlots,
    isSlotAvailable,
  }
}
