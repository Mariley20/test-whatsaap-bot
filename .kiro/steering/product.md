# Product Overview

**Maley** is a medical appointment scheduling web application built with Nuxt 4 (frontend) and Firebase (backend: Auth, Firestore, Cloud Functions).

## Architecture

- **Frontend** (`front/`): Nuxt 4 SPA with Firebase JS SDK for Auth and Firestore
- **Backend** (`functions/`): Firebase Cloud Functions for server-side logic
- **Database**: Cloud Firestore
- **Auth**: Firebase Authentication (email/password)

## Key Features

- User authentication with Firebase Auth (email/password)
- Role-based access: guest, support, admin, doctor, patient, secretary
- Patient registration by secretary
- Appointment scheduling with doctor availability based on working hours
- Appointment viewing filtered by role
- Appointment cancellation by secretary
- User profile management

## Roles

- **Guest**: Authenticated user without assigned role
- **Support**: Technical support
- **Secretary**: Registers patients, schedules and cancels appointments, views all appointments
- **Doctor**: Views assigned appointments, defines working hours
- **Patient**: Views own appointments
- **Admin**: System administration

## Language

The application UI and validation messages are in Spanish.
