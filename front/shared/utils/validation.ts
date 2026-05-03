import type { UserRegistrationData } from '#shared/types/userTypes'

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export interface CreateAppointmentData {
  date: string
  time: string
  doctor_id: string
  patient_id: string
  type: string
  description: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  return false
}

export function validateRegistration(data: Partial<UserRegistrationData>): ValidationResult {
  const errors: Record<string, string> = {}

  if (isEmpty(data.fullName)) {
    errors.fullName = 'El nombre completo es obligatorio'
  }

  if (isEmpty(data.documentType)) {
    errors.documentType = 'El tipo de documento es obligatorio'
  }

  if (isEmpty(data.documentNumber)) {
    errors.documentNumber = 'El número de documento es obligatorio'
  }

  if (isEmpty(data.phoneNumber)) {
    errors.phoneNumber = 'El teléfono es obligatorio'
  }

  if (isEmpty(data.email)) {
    errors.email = 'El correo es obligatorio'
  } else if (!EMAIL_REGEX.test(data.email!)) {
    errors.email = 'El formato del correo no es válido'
  }

  if (isEmpty(data.password)) {
    errors.password = 'La contraseña es obligatoria'
  } else if (data.password!.length < MIN_PASSWORD_LENGTH) {
    errors.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateAppointment(data: Partial<CreateAppointmentData>): ValidationResult {
  const errors: Record<string, string> = {}

  if (isEmpty(data.date)) {
    errors.date = 'La fecha es obligatoria'
  }

  if (isEmpty(data.time)) {
    errors.time = 'La hora es obligatoria'
  }

  if (isEmpty(data.doctor_id)) {
    errors.doctor_id = 'El doctor es obligatorio'
  }

  if (isEmpty(data.patient_id)) {
    errors.patient_id = 'El paciente es obligatorio'
  }

  if (isEmpty(data.type)) {
    errors.type = 'El tipo de cita es obligatorio'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateProfile(data: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {}

  if (isEmpty(data.fullName)) {
    errors.fullName = 'El nombre completo es obligatorio'
  }

  if (isEmpty(data.email)) {
    errors.email = 'El correo es obligatorio'
  } else if (typeof data.email === 'string' && !EMAIL_REGEX.test(data.email)) {
    errors.email = 'El formato del correo no es válido'
  }

  if (isEmpty(data.documentType)) {
    errors.documentType = 'El tipo de documento es obligatorio'
  }

  if (isEmpty(data.documentNumber)) {
    errors.documentNumber = 'El número de documento es obligatorio'
  }

  if (isEmpty(data.phoneNumber)) {
    errors.phoneNumber = 'El teléfono es obligatorio'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}
