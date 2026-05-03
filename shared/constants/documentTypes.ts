export const DOCUMENT_TYPE_DNI = 'DNI' as const
export const DOCUMENT_TYPE_PASSPORT = 'PASSPORT' as const

export const DOCUMENT_TYPES = [
  { value: DOCUMENT_TYPE_DNI, label: 'DNI' },
  { value: DOCUMENT_TYPE_PASSPORT, label: 'Pasaporte' },
] as const
