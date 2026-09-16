<template>
  <div class="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
    <header
      v-if="$slots.header"
      class="sticky top-0 z-30 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      :style="{ paddingTop: 'env(safe-area-inset-top, 0px)' }"
    >
      <slot name="header" />
    </header>

    <main class="flex-1 pb-20">
      <slot />
    </main>

    <nav
      class="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      :style="{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }"
    >
      <div class="flex items-center justify-around">
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          class="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium"
          :class="
            activeId === item.id
              ? 'text-brand-500'
              : 'text-gray-400 dark:text-gray-500'
          "
          @click="emit('select', item)"
        >
          <component :is="item.icon" class="h-5 w-5" />
          {{ item.label }}
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
export interface MobileNavItem {
  id: string | number
  label: string
  icon: object
}

interface MobileAppLayoutProps {
  items: MobileNavItem[]
  activeId?: string | number | null
}

withDefaults(defineProps<MobileAppLayoutProps>(), {
  activeId: null,
})

const emit = defineEmits<{
  select: [item: MobileNavItem]
}>()
</script>
