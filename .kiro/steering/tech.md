# Technology Stack

## Core Framework

- **Nuxt**: v4.4.4 (meta-framework for Vue.js)
- **Vue**: v3.5.33 (progressive JavaScript framework)
- **Vue Router**: v5.0.6 (official routing library)

## Firebase

- **firebase**: v12.12.1 (Firebase JS SDK)
- **@pinia/nuxt**: State management with Pinia
- Firebase initialized via client-only plugin (`app/plugins/firebase.client.ts`)
- Custom composables in `app/composables/useFirebase.ts` replace vuefire
- Firebase Auth enabled for email/password authentication
- Firestore used for data persistence
- Firebase config loaded via Nuxt `runtimeConfig` (env vars with `NUXT_PUBLIC_` prefix)

## UI

- **Tailwind CSS**: via `@nuxtjs/tailwindcss` v6.14.0
- **Headless UI**: `@headlessui/vue` v1.7.23 for accessible UI primitives

### UI Guidelines

- All UI components MUST be styled with Tailwind CSS utility classes
- Use Headless UI (`@headlessui/vue`) for interactive components that need accessibility:
  - `Listbox` — for custom select/dropdown inputs (e.g., doctor selector, document type)
  - `Combobox` — for searchable select inputs (e.g., patient search)
  - `Dialog` — for modals and confirmation dialogs (e.g., cancel appointment confirmation)
  - `Menu` — for dropdown menus (e.g., navbar user menu)
  - `Switch` — for toggle switches
  - `Disclosure` — for collapsible sections
  - `Popover` — for floating panels
  - `TransitionRoot` / `TransitionChild` — for enter/leave animations on Headless UI components
- Do NOT use native `<select>` elements — use Headless UI `Listbox` or `Combobox` instead
- Do NOT build custom modals from scratch — use Headless UI `Dialog`
- Do NOT build custom dropdown menus — use Headless UI `Menu`
- Headless UI components are unstyled by default; apply all visual styling via Tailwind classes
- Use Headless UI's render prop pattern for conditional styling (e.g., `v-slot="{ active, selected }"`)
- Import components directly: `import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'`
- All forms should use consistent Tailwind styling: rounded borders, focus rings, error states in red
- Color palette: use a medical/professional theme (blues, whites, subtle grays)

## Testing

- **Vitest**: v4.1.5 (test runner, compatible with Vite)
- **fast-check**: v4.7.0 (property-based testing)
- Path alias `#shared` configured in `vitest.config.ts`
- Run tests: `npm test` (runs `vitest --run`)

## Language & Type System

- **TypeScript**: Enabled with Nuxt's auto-generated type definitions
- **ES Modules**: Project uses `"type": "module"` in package.json

## Build System

Nuxt handles the build process internally using Vite.

## Common Commands

- `npm run dev` — Start development server on http://localhost:3000
- `npm run build` — Create optimized production build
- `npm run preview` — Preview production build locally
- `npm run generate` — Pre-render as static files (SSG)
- `npm test` — Run all tests with Vitest
- `npm install && npm run postinstall` — Install deps and prepare Nuxt

## Configuration

- **nuxt.config.ts**: Nuxt config with Tailwind CSS, Pinia, and runtimeConfig for Firebase
- **vitest.config.ts**: Test config with `#shared` path alias
- **tsconfig.json**: References auto-generated configs from `.nuxt/`
- **.env**: Firebase credentials (not committed to git)
- Compatibility date: `2025-07-15`
- Devtools enabled by default
