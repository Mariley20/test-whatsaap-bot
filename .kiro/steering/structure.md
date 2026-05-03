# Project Structure

## Monorepo Organization

```
maley/
├── front/                              # Nuxt 4 frontend application
│   ├── .nuxt/                          # Auto-generated Nuxt files (do not edit)
│   ├── app/                            # Application source code
│   │   ├── app.vue                     # Root component with NuxtLayout + NuxtPage
│   │   ├── layouts/
│   │   │   └── default.vue             # Default layout
│   │   ├── pages/                      # File-based routing
│   │   ├── components/                 # Auto-imported Vue components
│   │   ├── composables/                # Auto-imported composition functions
│   │   ├── middleware/                 # Route middleware (auth, guest)
│   │   ├── plugins/                    # Nuxt plugins (01.firebase.client.ts, 02.auth.client.ts)
│   │   └── stores/                     # Pinia stores
│   ├── shared/                         # Shared code between client and server
│   │   ├── constants/
│   │   │   ├── userRoles.ts            # Role constants (guest, support, admin, doctor, patient, secretary)
│   │   │   └── documentTypes.ts        # Document type constants (DNI, passport)
│   │   ├── types/
│   │   │   ├── userTypes.ts            # IUser, IWorkingHours, UserRegistrationData
│   │   │   └── medicalAppointmentTypes.ts  # IMedicalAppointment
│   │   └── utils/
│   │       ├── validation.ts           # Form validation (registration, appointment, profile)
│   │       ├── slots.ts                # Time slot generation and availability filtering
│   │       └── appointmentSerializer.ts # Firestore Timestamp serialization/deserialization
│   ├── tests/
│   │   └── unit/                       # Unit tests
│   ├── public/                         # Static assets
│   ├── nuxt.config.ts                  # Nuxt configuration
│   ├── vitest.config.ts                # Vitest config with #shared alias
│   ├── tsconfig.json                   # TypeScript configuration
│   └── package.json                    # Frontend dependencies and scripts
├── functions/                          # Firebase Cloud Functions (backend)
│   ├── src/
│   │   └── index.ts                    # Cloud Functions entry point
│   ├── package.json                    # Functions dependencies and scripts
│   ├── tsconfig.json                   # TypeScript configuration
│   └── .eslintrc.js                    # ESLint configuration
├── firebase.json                       # Firebase project configuration
├── firestore.rules                     # Firestore security rules
├── firestore.indexes.json              # Firestore indexes
├── .firebaserc                         # Firebase project aliases
└── .gitignore                          # Root gitignore
```

## Key Conventions

- **front/shared/** contains types, utils, and constants shared across the frontend. Use `#shared/` alias for imports.
- **front/app/** follows Nuxt directory conventions (pages, components, composables, middleware, layouts, plugins, stores).
- **front/tests/** mirrors the source structure. Unit tests use `.test.ts`, property tests use `.property.test.ts`.
- **functions/** contains Firebase Cloud Functions using firebase-admin and firebase-functions v7.
- Firestore collections: `users` (keyed by Firebase Auth UID), `appointments` (auto-generated IDs).
- Validation messages and UI text are in Spanish.
- All interactive UI primitives use `@headlessui/vue` components styled with Tailwind CSS.
- Firebase is initialized via `front/app/plugins/01.firebase.client.ts` and accessed through `front/app/composables/useFirebase.ts`.
- Auth listener initialized via `front/app/plugins/02.auth.client.ts`.
- Global auth state is managed via Pinia store in `front/app/stores/auth.ts`.
- Constants for roles in `front/shared/constants/userRoles.ts`, document types in `front/shared/constants/documentTypes.ts`.
