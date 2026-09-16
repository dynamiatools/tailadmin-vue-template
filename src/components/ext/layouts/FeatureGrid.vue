<template>
  <section class="mx-auto max-w-(--breakpoint-2xl) px-4 py-16 sm:px-6 lg:px-8">
    <div v-if="title || subtitle || $slots.title" class="mx-auto mb-12 max-w-2xl text-center">
      <h2 class="text-title-sm font-bold text-gray-800 dark:text-white/90">
        <slot name="title">{{ title }}</slot>
      </h2>
      <p v-if="subtitle" class="mt-3 text-gray-500 dark:text-gray-400">{{ subtitle }}</p>
    </div>

    <div class="grid gap-6" :class="columnClasses[columns]">
      <div v-for="feature in features" :key="feature.title" class="rounded-2xl border border-gray-200 p-6 dark:border-gray-800">
        <div
          v-if="feature.icon"
          class="bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400 mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
        >
          <component :is="feature.icon" class="h-5 w-5" />
        </div>
        <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">{{ feature.title }}</h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ feature.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface Feature {
  icon?: object
  title: string
  description: string
}

interface FeatureGridProps {
  title?: string
  subtitle?: string
  features: Feature[]
  columns?: 2 | 3 | 4
}

withDefaults(defineProps<FeatureGridProps>(), {
  title: '',
  subtitle: '',
  columns: 3,
})

const columnClasses: Record<2 | 3 | 4, string> = {
  2: 'sm:grid-cols-2 lg:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}
</script>
