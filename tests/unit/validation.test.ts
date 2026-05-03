import { describe, it, expect } from 'vitest'
import {
  validateRegistration,
  validateAppointment,
  validateProfile,
} from '#shared/utils/validation'

describe('validateRegistration', () => {
  const validData = {
    fullName: 'Juan Pérez',
    documentType: 'CC',
    documentNumber: '123456789',
    phoneNumber: '3001234567',
    email: 'juan@example.com',
    password: 'secret123',
    confirmPassword: 'secret123',
  }

  it('returns valid for complete valid data', () => {
    const result = validateRegistration(validData)
    expect(result.valid).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })

  it('returns errors for all empty fields', () => {
    const result = validateRegistration({})
    expect(result.valid).toBe(false)
    expect(result.errors.fullName).toBeDefined()
    expect(result.errors.email).toBeDefined()
    expect(result.errors.password).toBeDefined()
    expect(result.errors.documentType).toBeDefined()
    expect(result.errors.documentNumber).toBeDefined()
    expect(result.errors.phoneNumber).toBeDefined()
  })

  it('rejects password shorter than 6 characters', () => {
    const result = validateRegistration({ ...validData, password: '12345' })
    expect(result.valid).toBe(false)
    expect(result.errors.password).toContain('6')
  })

  it('rejects invalid email format', () => {
    const result = validateRegistration({ ...validData, email: 'not-an-email' })
    expect(result.valid).toBe(false)
    expect(result.errors.email).toBeDefined()
  })

  it('treats whitespace-only fields as empty', () => {
    const result = validateRegistration({ ...validData, fullName: '   ' })
    expect(result.valid).toBe(false)
    expect(result.errors.fullName).toBeDefined()
  })
})

describe('validateAppointment', () => {
  const validData = {
    date: '2025-08-01',
    time: '09:00',
    doctor_id: 'doc123',
    patient_id: 'pat456',
    type: 'general',
    description: 'Consulta general',
  }

  it('returns valid for complete valid data', () => {
    const result = validateAppointment(validData)
    expect(result.valid).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })

  it('returns errors for all empty fields', () => {
    const result = validateAppointment({})
    expect(result.valid).toBe(false)
    expect(result.errors.date).toBeDefined()
    expect(result.errors.time).toBeDefined()
    expect(result.errors.doctor_id).toBeDefined()
    expect(result.errors.patient_id).toBeDefined()
    expect(result.errors.type).toBeDefined()
  })
})

describe('validateProfile', () => {
  const validData = {
    fullName: 'Juan Pérez',
    email: 'juan@example.com',
    documentType: 'CC',
    documentNumber: '123456789',
    phoneNumber: '3001234567',
  }

  it('returns valid for complete valid data', () => {
    const result = validateProfile(validData)
    expect(result.valid).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })

  it('returns errors for all empty fields', () => {
    const result = validateProfile({})
    expect(result.valid).toBe(false)
    expect(result.errors.fullName).toBeDefined()
    expect(result.errors.email).toBeDefined()
    expect(result.errors.documentType).toBeDefined()
    expect(result.errors.documentNumber).toBeDefined()
    expect(result.errors.phoneNumber).toBeDefined()
  })

  it('rejects invalid email format', () => {
    const result = validateProfile({ ...validData, email: 'bad-email' })
    expect(result.valid).toBe(false)
    expect(result.errors.email).toBeDefined()
  })
})
