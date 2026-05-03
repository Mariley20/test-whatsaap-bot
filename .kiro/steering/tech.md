# Technology Stack

## Frontend (`front/`)

### Core Framework
- **Nuxt**: v4.4.4 (meta-framework for Vue.js)
- **Vue**: v3.5.33 (progressive JavaScript framework)
- **Vue Router**: v5.0.6 (official routing library)

### Firebase (Client)
- **firebase**: v12.12.1 (Firebase JS SDK)
- **@pinia/nuxt**: State management with Pinia
- Firebase initialized via client-only plugin (`front/app/plugins/01.firebase.client.ts`)
- Auth listener via `front/app/plugins/02.auth.client.ts`
- Custom composables in `front/app/composables/useFirebase.ts` and `front/app/composables/useAuth.ts`
- Firebase Auth enabled for email/password authentication
- Firestore used for data persistence
- Firebase config loaded via Nuxt `runtimeConfig` (env vars with `NUXT_PUBLIC_` prefix)

### UI
- **Tailwind CSS**: via `@nuxtjs/tailwindcss` v6.14.0
- **Headless UI**: `@headlessui/vue` v1.7.23 for accessible UI primitives

### UI Guidelines
- All UI components MUST be styled with Tailwind CSS utility classes
- Use Headless UI for interactive components (Listbox, Combobox, Dialog, Menu, Switch, Disclosure, Popover)
- Do NOT use native `<select>` elements — use Headless UI `Listbox` or `Combobox`
- Do NOT build custom modals — use Headless UI `Dialog`
- Do NOT build custom dropdown menus — use Headless UI `Menu`
- Color palette: medical/professional theme (blues, whites, subtle grays)

### Testing
- **Vitest**: v4.1.5 (test runner)
- **fast-check**: v4.7.0 (property-based testing)
- Path alias `#shared` configured in `front/vitest.config.ts`
- Run tests: `npm test` from `front/` (runs `vitest --run`)

### Language & Type System
- **TypeScript**: Enabled with Nuxt's auto-generated type definitions
- **ES Modules**: Project uses `"type": "module"` in package.json

## Backend (`functions/`)

### Firebase Cloud Functions
- **firebase-admin**: v13.6.0
- **firebase-functions**: v7.0.0
- **Node.js**: v24
- **TypeScript**: v6.0.0
- Entry point: `functions/src/index.ts`
- Output: `functions/lib/`

### Common Commands (Functions)
- `npm run build` — Compile TypeScript
- `npm run lint` — Run ESLint
- `npm run serve` — Build and start emulators
- `npm run deploy` — Deploy to Firebase

## Firebase Configuration
- **firebase.json**: Firestore rules, indexes, and Cloud Functions config
- **firestore.rules**: Security rules for Firestore
- **.firebaserc**: Project aliases

## Common Commands (Frontend)
- `npm run dev` — Start development server (from `front/`)
- `npm run build` — Create optimized production build
- `npm run preview` — Preview production build locally
- `npm test` — Run all tests with Vitest
- `npm install && npm run postinstall` — Install deps and prepare Nuxt
