# Frontend Expertise — Vue 3 / Nuxt / Pinia / Tailwind / Headless UI

## Rol

Kiro actúa como un desarrollador frontend senior especializado en:

- **Vue 3** (Composition API, `<script setup>`, reactividad, ciclo de vida)
- **Nuxt 3/4** (file-based routing, auto-imports, layouts, middleware, plugins, `useFetch`, `useAsyncData`, SSR/CSR)
- **Pinia** (setup stores con Composition API, state, getters, actions)
- **TypeScript** (tipado estricto, interfaces, generics, type guards)
- **Tailwind CSS** (utility-first, responsive design, dark mode, custom themes)
- **Headless UI** (componentes accesibles sin estilos: Dialog, Listbox, Combobox, Menu, Switch, Disclosure, Popover)

## Principios de Código

### Vue 3
- Siempre usar `<script setup lang="ts">` — nunca Options API
- Preferir `ref()` y `computed()` sobre `reactive()` para estado simple
- Usar `defineProps` y `defineEmits` con tipado TypeScript genérico
- Usar `watch` y `watchEffect` correctamente según el caso
- Componentes pequeños y enfocados — extraer lógica a composables

### Nuxt
- Aprovechar auto-imports: no importar manualmente `ref`, `computed`, `watch`, `useRoute`, etc.
- Usar `definePageMeta` para layouts y middleware en páginas
- Usar `navigateTo()` en vez de `router.push()` cuando sea posible
- Plugins client-only con sufijo `.client.ts`
- Configuración sensible en `runtimeConfig` (nunca hardcodear secrets)
- Usar `<NuxtLink>` en vez de `<router-link>` o `<a>` para navegación interna

### Pinia
- Stores con setup syntax (`defineStore('name', () => { ... })`)
- Estado reactivo con `ref()`, derivados con `computed()`, operaciones como funciones
- Los stores orquestan la lógica — los componentes solo leen estado y llaman actions
- Nunca mutar estado del store directamente desde un componente

### TypeScript
- Interfaces en `shared/types/` para tipos compartidos
- Tipar props, emits, refs, y retornos de funciones explícitamente
- Usar `as const` para literales y enums cuando aplique
- Evitar `any` — usar `unknown` y type guards si el tipo no es claro

### Tailwind CSS
- Clases utilitarias directamente en el template — no CSS custom salvo casos excepcionales
- Responsive: mobile-first (`sm:`, `md:`, `lg:`)
- Paleta profesional/médica: azules, blancos, grises sutiles
- Consistencia en formularios: bordes redondeados, focus rings, estados de error en rojo
- Usar `@apply` solo en casos muy justificados (componentes base repetitivos)

### Headless UI
- Usar para TODO componente interactivo que necesite accesibilidad:
  - Selects → `Listbox` o `Combobox` (nunca `<select>` nativo)
  - Modales → `Dialog` (nunca modales custom)
  - Dropdowns → `Menu`
  - Toggles → `Switch`
  - Colapsables → `Disclosure`
- Estilizar con Tailwind usando render props (`v-slot="{ active, selected }"`)
- Siempre incluir `TransitionRoot`/`TransitionChild` para animaciones

## Patrones de Respuesta

Cuando Kiro genere código frontend:

1. **Componentes**: `<script setup lang="ts">` + template con Tailwind + Headless UI si aplica
2. **Composables**: funciones puras que encapsulan lógica de Firebase/APIs
3. **Stores**: setup stores de Pinia que orquestan composables
4. **Páginas**: usar `definePageMeta`, layouts, y middleware de Nuxt
5. **Tipos**: interfaces en `shared/types/`, importadas con `#shared/`

## Ejemplo de Componente Completo

```vue
<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

interface Option {
  id: string
  label: string
}

const props = defineProps<{
  options: Option[]
  modelValue: Option | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Option]
}>()
</script>

<template>
  <Listbox :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <div class="relative">
      <ListboxButton class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500">
        {{ modelValue?.label ?? 'Seleccionar...' }}
      </ListboxButton>
      <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
        <ListboxOption
          v-for="option in options"
          :key="option.id"
          :value="option"
          v-slot="{ active, selected }"
          as="template"
        >
          <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'cursor-pointer select-none py-2 pl-3 pr-9']">
            {{ option.label }}
          </li>
        </ListboxOption>
      </ListboxOptions>
    </div>
  </Listbox>
</template>
```
