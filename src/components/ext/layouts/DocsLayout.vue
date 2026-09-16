<template>
  <div class="mx-auto flex max-w-(--breakpoint-2xl) gap-8 px-4 py-8 sm:px-6 lg:px-8">
    <aside class="hidden w-64 shrink-0 lg:block">
      <div class="sticky top-8">
        <slot name="sidebar">
          <Menu :items="nav" :active-id="activeId" orientation="vertical" @select="(item) => emit('navigate', item)" />
        </slot>
      </div>
    </aside>

    <main class="min-w-0 flex-1">
      <div
        class="max-w-none text-gray-600 dark:text-gray-300 [&_a]:text-brand-500 [&_a]:underline [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_code]:dark:bg-white/10 [&_h1]:mb-4 [&_h1]:text-title-sm [&_h1]:font-bold [&_h1]:text-gray-800 [&_h1]:dark:text-white/90 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-800 [&_h2]:dark:text-white/90 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:dark:text-white/90 [&_p]:mb-4 [&_p]:leading-relaxed [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre]:text-white [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
      >
        <slot />
      </div>

      <div
        v-if="prev || next"
        class="mt-10 flex items-center justify-between gap-4 border-t border-gray-200 pt-6 dark:border-gray-800"
      >
        <a
          v-if="prev"
          :href="prev.href"
          class="flex flex-col rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-800"
        >
          <span class="text-gray-400">Previous</span>
          <span class="font-medium text-gray-800 dark:text-white/90">{{ prev.label }}</span>
        </a>
        <span v-else></span>
        <a
          v-if="next"
          :href="next.href"
          class="flex flex-col rounded-lg border border-gray-200 px-4 py-2.5 text-right text-sm dark:border-gray-800"
        >
          <span class="text-gray-400">Next</span>
          <span class="font-medium text-gray-800 dark:text-white/90">{{ next.label }}</span>
        </a>
      </div>
    </main>

    <aside v-if="$slots.toc || tocItems.length" class="hidden w-56 shrink-0 xl:block">
      <div class="sticky top-8">
        <slot name="toc">
          <p class="mb-3 text-xs font-semibold text-gray-400 uppercase">On this page</p>
          <ul class="space-y-2 text-sm">
            <li v-for="item in tocItems" :key="item.id" :style="{ paddingLeft: `${(item.depth - 1) * 0.75}rem` }">
              <a :href="`#${item.id}`" class="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                {{ item.label }}
              </a>
            </li>
          </ul>
        </slot>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import Menu from '../navigation/Menu.vue'
import type { MenuItem } from '../navigation/Menu.vue'

export interface DocsTocItem {
  id: string
  label: string
  depth: number
}

export interface DocsPageLink {
  label: string
  href: string
}

interface DocsLayoutProps {
  nav: MenuItem[]
  activeId?: string | number | null
  tocItems?: DocsTocItem[]
  prev?: DocsPageLink
  next?: DocsPageLink
}

withDefaults(defineProps<DocsLayoutProps>(), {
  activeId: null,
  tocItems: () => [],
  prev: undefined,
  next: undefined,
})

const emit = defineEmits<{
  navigate: [item: MenuItem]
}>()
</script>
