<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-99999 flex items-start justify-center bg-gray-900/50 p-4 pt-24"
    @click.self="close"
  >
    <div
      class="w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-700 dark:bg-gray-900"
      @keydown.esc="close"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
      @keydown.enter="selectHighlighted"
    >
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        :placeholder="placeholder"
        class="h-12 w-full border-b border-gray-100 bg-transparent px-4 text-sm text-gray-800 focus:outline-hidden dark:border-gray-800 dark:text-white/90"
        @input="emit('search', query)"
      />

      <div class="max-h-80 overflow-y-auto py-2">
        <div v-if="loading" class="px-4 py-6 text-center text-sm text-gray-400">Loading…</div>
        <div v-else-if="filtered.length === 0" class="px-4 py-6 text-center text-sm text-gray-400">
          No commands found.
        </div>
        <template v-else>
          <div v-for="group in groups" :key="group.category">
            <p
              v-if="group.category"
              class="px-4 pt-2 pb-1 text-xs font-medium text-gray-400 uppercase dark:text-gray-500"
            >
              {{ group.category }}
            </p>
            <button
              v-for="command in group.commands"
              :key="command.id"
              type="button"
              class="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm"
              :class="
                flatIndex(command) === highlightedIndex
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.03]'
              "
              @mouseenter="highlightedIndex = flatIndex(command)"
              @click="select(command)"
            >
              <span class="flex items-center gap-2">
                <component :is="command.icon" v-if="command.icon" class="h-4 w-4" />
                {{ command.label }}
              </span>
              <kbd v-if="command.shortcut" class="text-xs text-gray-400">{{ command.shortcut }}</kbd>
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

export interface CommandItem {
  id: string
  label: string
  category?: string
  icon?: object
  shortcut?: string
}

interface CommandPaletteProps {
  modelValue: boolean
  commands: CommandItem[]
  placeholder?: string
  loading?: boolean
}

const props = withDefaults(defineProps<CommandPaletteProps>(), {
  placeholder: 'Type a command or search…',
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  select: [command: CommandItem]
  search: [query: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const query = ref('')
const highlightedIndex = ref(0)

const filtered = computed(() => {
  const needle = query.value.trim().toLowerCase()
  if (!needle) return props.commands
  return props.commands.filter((command) => command.label.toLowerCase().includes(needle))
})

const groups = computed(() => {
  const map = new Map<string, CommandItem[]>()
  for (const command of filtered.value) {
    const key = command.category ?? ''
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(command)
  }
  return Array.from(map.entries()).map(([category, commands]) => ({ category, commands }))
})

function flatIndex(command: CommandItem): number {
  return filtered.value.indexOf(command)
}

function move(delta: number) {
  const max = filtered.value.length - 1
  if (max < 0) return
  highlightedIndex.value = (highlightedIndex.value + delta + filtered.value.length) % filtered.value.length
}

function select(command: CommandItem) {
  emit('select', command)
  close()
}

function selectHighlighted() {
  const command = filtered.value[highlightedIndex.value]
  if (command) select(command)
}

function close() {
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      query.value = ''
      highlightedIndex.value = 0
      await nextTick()
      inputRef.value?.focus()
    }
  },
)
</script>
