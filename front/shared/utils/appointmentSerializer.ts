import { Timestamp } from 'firebase/firestore'
import type { IMedicalAppointment } from '#shared/types/medicalAppointmentTypes'

/**
 * Firestore-compatible representation of an appointment.
 * Date fields are stored as Firestore Timestamps.
 */
export interface SerializedAppointment {
  id: string
  date: Timestamp
  time: string
  doctor_id: string
  patient_id: string
  status: string
  type: string
  description: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

/**
 * Converts an IMedicalAppointment (with JS Date objects) into a
 * Firestore-compatible document (with Timestamp objects).
 */
export function serializeAppointment(appointment: IMedicalAppointment): SerializedAppointment {
  return {
    id: appointment.id,
    date: Timestamp.fromDate(appointment.date),
    time: appointment.time,
    doctor_id: appointment.doctor_id,
    patient_id: appointment.patient_id,
    status: appointment.status,
    type: appointment.type,
    description: appointment.description,
    createdAt: Timestamp.fromDate(appointment.createdAt),
    updatedAt: Timestamp.fromDate(appointment.updatedAt),
  }
}

/**
 * Converts a Firestore document (with Timestamp objects) back into
 * an IMedicalAppointment (with JS Date objects).
 */
export function deserializeAppointment(doc: SerializedAppointment): IMedicalAppointment {
  return {
    id: doc.id,
    date: doc.date.toDate(),
    time: doc.time,
    doctor_id: doc.doctor_id,
    patient_id: doc.patient_id,
    status: doc.status,
    type: doc.type,
    description: doc.description,
    createdAt: doc.createdAt.toDate(),
    updatedAt: doc.updatedAt.toDate(),
  }
}
