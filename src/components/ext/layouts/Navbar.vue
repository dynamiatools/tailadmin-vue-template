<template>
  <header
    class="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80"
    :class="sticky ? 'sticky top-0 z-40' : ''"
  >
    <div class="mx-auto flex max-w-(--breakpoint-2xl) items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2">
        <slot name="logo">
          <span class="text-lg font-bold text-gray-800 dark:text-white/90">{{ brand }}</span>
        </slot>
      </div>

      <nav class="hidden items-center gap-6 lg:flex">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="hidden items-center gap-3 lg:flex">
        <slot name="actions" />
      </div>

      <button
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 lg:hidden dark:text-gray-300"
        aria-label="Toggle menu"
        @click="mobileOpen = !mobileOpen"
      >
        <MenuIcon v-if="!mobileOpen" class="h-5 w-5" />
        <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 5L5 15M5 5l10 10"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <div v-if="mobileOpen" class="border-t border-gray-200 px-4 py-4 lg:hidden dark:border-gray-800">
      <nav class="flex flex-col gap-3">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="text-sm font-medium text-gray-600 dark:text-gray-300"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </a>
      </nav>
      <div class="mt-4 flex flex-col gap-2">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MenuIcon } from '../../../icons'

export interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  brand?: string
  links?: NavLink[]
  sticky?: boolean
}

withDefaults(defineProps<NavbarProps>(), {
  brand: '',
  links: () => [],
  sticky: true,
})

const mobileOpen = ref(false)
</script>
