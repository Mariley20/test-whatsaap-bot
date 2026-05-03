# Requirements Document

## Introduction

Sistema de agendamiento de citas médicas para la aplicación Maley. Permite a las secretarias registrar pacientes y agendar citas con doctores disponibles. Utiliza Firebase Auth para autenticación y Firestore para almacenar datos de usuarios y citas. El sistema soporta múltiples roles (admin, doctor, paciente, secretaria) con funcionalidades diferenciadas.

## Glossary

- **Auth_Service**: Servicio de autenticación basado en Firebase Authentication
- **Firestore_Service**: Servicio de almacenamiento de datos basado en Cloud Firestore
- **Appointment_Scheduler**: Componente que gestiona la creación y consulta de citas médicas
- **User_Manager**: Componente que gestiona los datos de perfil de usuario
- **Secretary**: Usuario con rol de secretaria que registra pacientes y agenda citas
- **Patient**: Usuario con rol de paciente registrado por la secretaria
- **Doctor**: Usuario con rol de doctor que recibe citas y define horarios de atención
- **Working_Hours**: Horarios de disponibilidad configurados por cada doctor

## Requirements

### Requirement 1: Autenticación de usuarios

**User Story:** Como usuario del sistema, quiero iniciar sesión con mi correo y contraseña, para acceder a las funcionalidades según mi rol.

#### Acceptance Criteria

1. WHEN un usuario proporciona correo y contraseña válidos, THE Auth_Service SHALL autenticar al usuario y redirigirlo a la página principal
2. WHEN un usuario proporciona credenciales inválidas, THE Auth_Service SHALL mostrar un mensaje de error descriptivo sin revelar qué campo es incorrecto
3. WHEN un usuario no autenticado intenta acceder a una página protegida, THE Auth_Service SHALL redirigirlo a la página de login
4. WHEN un usuario autenticado hace clic en cerrar sesión, THE Auth_Service SHALL terminar la sesión y redirigirlo a la página de login

### Requirement 2: Registro de pacientes por secretaria

**User Story:** Como secretaria, quiero registrar nuevos pacientes en el sistema proporcionando sus datos personales, para que puedan tener citas agendadas.

#### Acceptance Criteria

1. WHEN una secretaria completa el formulario de registro de paciente con datos válidos (nombre completo, tipo de documento, número de documento, teléfono, correo, contraseña), THE User_Manager SHALL crear la cuenta en Firebase Auth y almacenar el perfil en Firestore con rol de paciente
2. WHEN una secretaria intenta registrar un paciente con un correo ya existente, THE User_Manager SHALL mostrar un mensaje indicando que el correo ya está en uso
3. WHEN una secretaria envía el formulario con campos obligatorios vacíos, THE User_Manager SHALL prevenir el envío y mostrar indicadores de validación en cada campo faltante
4. WHEN una secretaria ingresa una contraseña con menos de 6 caracteres, THE User_Manager SHALL rechazar el registro e indicar el requisito mínimo de longitud
5. WHILE un usuario tiene rol diferente a secretaria, THE User_Manager SHALL ocultar la opción de registrar pacientes

### Requirement 3: Gestión de perfil de usuario

**User Story:** Como usuario registrado, quiero ver y editar mi perfil, para mantener mis datos actualizados.

#### Acceptance Criteria

1. WHEN un usuario accede a su perfil, THE User_Manager SHALL mostrar todos los datos del usuario almacenados en Firestore
2. WHEN un usuario modifica sus datos de perfil y guarda los cambios, THE User_Manager SHALL actualizar el documento correspondiente en Firestore y confirmar la actualización
3. WHEN un usuario intenta guardar datos de perfil con campos obligatorios vacíos, THE User_Manager SHALL prevenir la actualización y señalar los campos faltantes

### Requirement 4: Agendamiento de citas por secretaria

**User Story:** Como secretaria, quiero agendar citas seleccionando paciente, doctor, fecha y hora, para organizar la atención médica de los pacientes.

#### Acceptance Criteria

1. WHEN una secretaria selecciona un doctor, THE Appointment_Scheduler SHALL mostrar únicamente las fechas y horas disponibles según los Working_Hours del doctor seleccionado
2. WHEN una secretaria confirma una cita con paciente, doctor, fecha, hora y tipo válidos, THE Appointment_Scheduler SHALL crear un documento de cita en Firestore con estado "scheduled" y los IDs del paciente y doctor
3. WHEN una secretaria intenta agendar una cita en un horario ya ocupado, THE Appointment_Scheduler SHALL rechazar la solicitud e indicar que el horario no está disponible
4. WHEN una secretaria intenta agendar una cita sin completar todos los campos requeridos (paciente, doctor, fecha, hora, tipo), THE Appointment_Scheduler SHALL prevenir la creación y señalar los campos faltantes
5. WHILE un usuario tiene rol diferente a secretaria, THE Appointment_Scheduler SHALL ocultar la opción de agendar citas

### Requirement 5: Visualización de citas

**User Story:** Como usuario, quiero ver las citas según mi rol, para llevar un control de los compromisos médicos.

#### Acceptance Criteria

1. WHEN una secretaria accede a la lista de citas, THE Appointment_Scheduler SHALL mostrar todas las citas del sistema ordenadas por fecha descendente
2. WHEN un doctor accede a la lista de citas, THE Appointment_Scheduler SHALL mostrar todas las citas asignadas al doctor ordenadas por fecha descendente
3. WHEN un paciente accede a la lista de citas, THE Appointment_Scheduler SHALL mostrar todas las citas del paciente ordenadas por fecha descendente
4. WHEN se muestra una cita en la lista, THE Appointment_Scheduler SHALL presentar la fecha, hora, tipo, estado y nombre del doctor o paciente según corresponda

### Requirement 6: Cancelación de citas

**User Story:** Como secretaria, quiero cancelar una cita agendada, para liberar el horario si el paciente no puede asistir.

#### Acceptance Criteria

1. WHEN una secretaria cancela una cita con estado "scheduled", THE Appointment_Scheduler SHALL actualizar el estado de la cita a "cancelled" en Firestore
2. WHEN una secretaria intenta cancelar una cita que no tiene estado "scheduled", THE Appointment_Scheduler SHALL rechazar la operación e indicar que solo se pueden cancelar citas programadas
3. WHILE un usuario tiene rol diferente a secretaria, THE Appointment_Scheduler SHALL ocultar la opción de cancelar citas

### Requirement 7: Persistencia de datos en Firestore

**User Story:** Como desarrollador, quiero que los datos de usuarios y citas se almacenen en Firestore, para tener persistencia confiable en la nube.

#### Acceptance Criteria

1. THE Firestore_Service SHALL almacenar los documentos de usuario en la colección "users" usando el UID de Firebase Auth como ID del documento
2. THE Firestore_Service SHALL almacenar los documentos de citas en la colección "appointments" con un ID generado automáticamente
3. WHEN se crea o actualiza un documento de cita, THE Firestore_Service SHALL registrar las marcas de tiempo createdAt y updatedAt correspondientes
4. WHEN se serializa una cita para almacenarla en Firestore, THE Firestore_Service SHALL producir un documento que al deserializarse genere un objeto equivalente al original

### Requirement 8: Protección de rutas

**User Story:** Como administrador del sistema, quiero que las rutas estén protegidas según el estado de autenticación y rol, para que solo usuarios autorizados accedan al contenido correspondiente.

#### Acceptance Criteria

1. WHILE un usuario no está autenticado, THE Auth_Service SHALL permitir acceso únicamente a la página de login
2. WHILE un usuario está autenticado, THE Auth_Service SHALL permitir acceso a las páginas protegidas según su rol
3. WHEN un usuario autenticado intenta acceder a la página de login, THE Auth_Service SHALL redirigirlo a la página principal
