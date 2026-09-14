<template>
  <div
    class="fixed right-4 top-20 z-[999] flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-2 shadow-lg backdrop-blur dark:border-gray-800 dark:bg-gray-900/90"
  >
    <label for="brand-color" class="text-xs font-medium text-gray-600 dark:text-gray-300">
      Brand color
    </label>
    <input
      id="brand-color"
      type="color"
      :value="color"
      class="h-7 w-9 cursor-pointer rounded border border-gray-200 bg-transparent dark:border-gray-700"
      @input="onInput"
    />
    <button
      type="button"
      class="text-xs font-medium text-gray-500 underline decoration-dotted hover:text-brand-500 dark:text-gray-400"
      @click="reset"
    >
      Reset
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { applyBrandColor, resetBrandColor } from '../lib/brandColor'

// Matches the package's own default --color-brand-500 (src/assets/main.css).
const DEFAULT_COLOR = '#465fff'
const STORAGE_KEY = 'tailadmin-vue-example:brand-color'

const color = ref(DEFAULT_COLOR)

function persist(value: string | null) {
  try {
    if (value) localStorage.setItem(STORAGE_KEY, value)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Private browsing / storage disabled — the picker still works for the session.
  }
}

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  color.value = value
  applyBrandColor(value)
  persist(value)
}

function reset() {
  color.value = DEFAULT_COLOR
  resetBrandColor()
  persist(null)
}

onMounted(() => {
  let stored: string | null = null
  try {
    stored = localStorage.getItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  if (stored) {
    color.value = stored
    applyBrandColor(stored)
  }
})
</script>
