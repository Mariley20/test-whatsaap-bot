# Product Overview

**Maley** is a medical appointment scheduling web application built with Nuxt 4 and Firebase. It allows secretaries to register patients and schedule appointments with doctors, while doctors and patients can view their respective appointments.

## Current State

The project has core business logic implemented (validation, time slot generation, appointment serialization) and is progressing through UI and composable implementation.

## Key Features

- User authentication with Firebase Auth (email/password)
- Role-based access: admin, doctor, patient, secretary
- Patient registration by secretary
- Appointment scheduling with doctor availability based on working hours
- Appointment viewing filtered by role
- Appointment cancellation by secretary
- User profile management

## Roles

- **Secretary**: Registers patients, schedules and cancels appointments, views all appointments
- **Doctor**: Views assigned appointments, defines working hours
- **Patient**: Views own appointments
- **Admin**: System administration

## Language

The application UI and validation messages are in Spanish.
