# Project Structure

## Directory Organization

```
maley/
├── .nuxt/                          # Auto-generated Nuxt files (do not edit)
├── app/                            # Application source code
│   ├── app.vue                     # Root component with NuxtLayout + NuxtPage
│   ├── layouts/
│   │   └── default.vue             # Default layout
│   ├── pages/                      # File-based routing (in progress)
│   ├── components/                 # Auto-imported Vue components (in progress)
│   ├── composables/                # Auto-imported composition functions (in progress)
│   └── middleware/                 # Route middleware (in progress)
├── shared/                         # Shared code between client and server
│   ├── constants/
│   │   └── userRoles.ts            # Role constants (admin, doctor, patient, secretary)
│   ├── types/
│   │   ├── userTypes.ts            # IUser, IWorkingHours, UserRegistrationData
│   │   └── medicalAppointmentTypes.ts  # IMedicalAppointment
│   └── utils/
│       ├── validation.ts           # Form validation (registration, appointment, profile)
│       ├── slots.ts                # Time slot generation and availability filtering
│       └── appointmentSerializer.ts # Firestore Timestamp serialization/deserialization
├── tests/
│   └── unit/
│       └── validation.test.ts      # Unit tests for validation module
├── public/                         # Static assets
├── nuxt.config.ts                  # Nuxt + nuxt-vuefire configuration
├── vitest.config.ts                # Vitest config with #shared alias
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies and scripts
```

## Key Conventions

- **shared/** contains types, utils, and constants shared across the app. Use `#shared/` alias for imports.
- **app/** follows Nuxt directory conventions (pages, components, composables, middleware, layouts).
- **tests/** mirrors the source structure. Unit tests use `.test.ts`, property tests use `.property.test.ts`.
- Firestore collections: `users` (keyed by Firebase Auth UID), `appointments` (auto-generated IDs).
- Validation messages and UI text are in Spanish.
- All interactive UI primitives (selects, modals, menus, toggles) use `@headlessui/vue` components styled with Tailwind CSS.
- Firebase is initialized via `app/plugins/firebase.client.ts` and accessed through `app/composables/useFirebase.ts`.
- Global auth state is managed via Pinia store in `app/stores/auth.ts`.
