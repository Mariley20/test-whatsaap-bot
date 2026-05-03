# Implementation Plan: Appointment Scheduling

## Overview

Implementación incremental del sistema de agendamiento de citas médicas con Firebase Auth y Firestore usando nuxt-vuefire. Cada tarea construye sobre la anterior, empezando por la configuración base y terminando con la integración completa.

## Tasks

- [x] 1. Configurar Firebase y estructura base del proyecto
  - Instalar dependencias: `firebase`, `nuxt-vuefire`, `vitest`, `fast-check`
  - Configurar `nuxt-vuefire` en `nuxt.config.ts` con auth habilitado
  - Crear `shared/constants/userRoles.ts` con las constantes de roles
  - Crear `app/layouts/default.vue` con layout base
  - Actualizar `app/app.vue` para usar `NuxtLayout` y `NuxtPage`
  - _Requirements: 7.1, 7.2_

- [x] 2. Implementar módulo de validación
  - [x] 2.1 Crear `shared/utils/validation.ts` con funciones `validateRegistration`, `validateAppointment`, `validateProfile`
    - Validar campos obligatorios vacíos, contraseña mínima 6 caracteres, formato de email
    - Retornar `ValidationResult` con `valid` y `errors` por campo
    - _Requirements: 2.3, 2.4, 3.3, 4.4_
  - [ ]* 2.2 Escribir property test para validación
    - **Property 1: Validation rejects missing required fields**
    - **Validates: Requirements 2.3, 2.4, 3.3, 4.4**

- [-] 3. Implementar lógica de disponibilidad de horarios
  - [x] 3.1 Crear `shared/utils/slots.ts` con funciones `generateTimeSlots` y `filterAvailableSlots`
    - `generateTimeSlots`: genera slots de 30 min dentro de working hours del doctor para un día
    - `filterAvailableSlots`: excluye slots ya ocupados por citas existentes
    - _Requirements: 4.1, 4.3_
  - [ ]* 3.2 Escribir property test para slots dentro de working hours
    - **Property 2: Generated time slots fall within doctor working hours**
    - **Validates: Requirements 4.1**
  - [ ]* 3.3 Escribir property test para exclusión de slots ocupados
    - **Property 3: Occupied slots are excluded from available slots**
    - **Validates: Requirements 4.3**

- [x] 4. Implementar serialización de citas
  - [x] 4.1 Crear `shared/utils/appointmentSerializer.ts` con funciones `serializeAppointment` y `deserializeAppointment`
    - Convertir Date a Firestore Timestamp y viceversa
    - Manejar todos los campos de `IMedicalAppointment`
    - _Requirements: 7.3, 7.4_
  - [ ]* 4.2 Escribir property test para round-trip de serialización
    - **Property 6: Appointment serialization round-trip**
    - **Validates: Requirements 7.3, 7.4**

- [x] 5. Checkpoint - Validar lógica de negocio
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implementar composable de autenticación y middleware
  - [x] 6.1 Crear `app/composables/useAuth.ts`
    - Usar `useCurrentUser` y `useFirebaseAuth` de vuefire
    - Implementar `login`, `logout`, `registerPatient`
    - Exponer computed `isSecretary`, `isDoctor`, `isPatient` basados en datos de Firestore
    - _Requirements: 1.1, 1.2, 1.4, 2.1, 2.2_
  - [x] 6.2 Crear `app/middleware/auth.ts` usando `getCurrentUser` de vuefire
    - Redirigir a `/login` si no hay usuario autenticado
    - _Requirements: 1.3, 8.1_
  - [x] 6.3 Crear `app/middleware/guest.ts`
    - Redirigir a `/` si el usuario ya está autenticado
    - _Requirements: 8.3_
  - [ ]* 6.4 Escribir property test para protección de rutas
    - **Property 7: Unauthenticated users are redirected from protected routes**
    - **Validates: Requirements 1.3, 8.1**

- [x] 7. Implementar composables de datos
  - [x] 7.1 Crear `app/composables/useUsers.ts`
    - Usar `useCollection` y `useDocument` de vuefire para queries reactivas
    - Implementar `getUserById`, `updateUser`, `getDoctors`, `getPatients`
    - _Requirements: 3.1, 3.2, 4.1_
  - [x] 7.2 Crear `app/composables/useAppointments.ts`
    - Implementar `createAppointment`, `cancelAppointment` con validación de estado
    - Implementar queries por paciente, doctor y todas las citas con ordenamiento por fecha desc
    - Implementar `getAvailableSlots` usando lógica de `shared/utils/slots.ts`
    - _Requirements: 4.2, 4.3, 5.1, 5.2, 5.3, 6.1, 6.2_
  - [ ]* 7.3 Escribir property test para ordenamiento de citas
    - **Property 4: Appointment lists are ordered by date descending**
    - **Validates: Requirements 5.1, 5.2, 5.3**
  - [ ]* 7.4 Escribir property test para cancelación de citas
    - **Property 5: Only scheduled appointments can be cancelled**
    - **Validates: Requirements 6.2**

- [x] 8. Checkpoint - Validar composables
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implementar página de login
  - Crear `app/pages/login.vue` con formulario de email/password
  - Usar `useAuth` para login
  - Aplicar middleware `guest`
  - Mostrar errores de autenticación sin revelar campo incorrecto
  - Estilizar con Tailwind CSS
  - _Requirements: 1.1, 1.2, 8.3_

- [x] 10. Implementar página de dashboard y navegación
  - Crear `app/pages/index.vue` como dashboard principal con middleware `auth`
  - Crear `app/components/AppNavbar.vue` con navegación según rol
  - Actualizar `app/layouts/default.vue` para incluir navbar
  - Mostrar/ocultar opciones de menú según rol (registrar paciente, crear cita solo para secretaria)
  - _Requirements: 2.5, 4.5, 6.3, 8.2_

- [x] 11. Implementar registro de pacientes
  - Crear `app/pages/patients/register.vue` con formulario completo
  - Usar `useAuth.registerPatient` y `validateRegistration`
  - Mostrar errores de validación por campo
  - Restringir acceso a secretaria (verificar rol en la página)
  - Estilizar con Tailwind CSS
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 12. Implementar agendamiento de citas
  - [x] 12.1 Crear `app/components/AppointmentForm.vue`
    - Selector de paciente, doctor, fecha, hora y tipo
    - Mostrar solo horarios disponibles al seleccionar doctor y fecha
    - Validación de campos requeridos
    - _Requirements: 4.1, 4.4_
  - [x] 12.2 Crear `app/pages/appointments/create.vue`
    - Usar `AppointmentForm` y `useAppointments.createAppointment`
    - Restringir acceso a secretaria
    - Manejar error de horario ocupado
    - _Requirements: 4.2, 4.3, 4.5_

- [x] 13. Implementar lista de citas
  - Crear `app/components/AppointmentCard.vue` con fecha, hora, tipo, estado y nombre
  - Crear `app/pages/appointments/index.vue`
  - Filtrar citas según rol: secretaria ve todas, doctor ve las suyas, paciente ve las suyas
  - Botón de cancelar visible solo para secretaria en citas con estado "scheduled"
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3_

- [x] 14. Implementar página de perfil
  - Crear `app/pages/profile.vue` con formulario editable
  - Usar `useUsers.updateUser` y `validateProfile`
  - Mostrar errores de validación por campo
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 15. Final checkpoint - Validación completa
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Se usa `nuxt-vuefire` para composables auto-importados de Firebase
