<template>
  <footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div class="mx-auto max-w-(--breakpoint-2xl) px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <slot name="brand">
            <span class="text-lg font-bold text-gray-800 dark:text-white/90">{{ brand }}</span>
          </slot>
          <div v-if="$slots.social" class="mt-4 flex items-center gap-3">
            <slot name="social" />
          </div>
        </div>

        <div v-for="column in columns" :key="column.title">
          <h4 class="text-sm font-semibold text-gray-800 dark:text-white/90">{{ column.title }}</h4>
          <ul class="mt-3 space-y-2">
            <li v-for="link in column.links" :key="link.href">
              <a
                :href="link.href"
                class="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <div v-if="$slots.newsletter">
          <h4 class="text-sm font-semibold text-gray-800 dark:text-white/90">Stay updated</h4>
          <div class="mt-3">
            <slot name="newsletter" />
          </div>
        </div>
      </div>

      <div
        class="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 text-sm text-gray-400 sm:flex-row dark:border-gray-800"
      >
        <slot name="copyright">
          <span>© {{ new Date().getFullYear() }} {{ brand }}. All rights reserved.</span>
        </slot>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  brand?: string
  columns?: FooterColumn[]
}

withDefaults(defineProps<FooterProps>(), {
  brand: '',
  columns: () => [],
})
</script>
