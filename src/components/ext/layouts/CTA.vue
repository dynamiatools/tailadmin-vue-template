<template>
  <section
    class="rounded-2xl px-6 py-12 text-center sm:px-12"
    :class="variant === 'solid' ? 'bg-brand-500' : 'border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'"
  >
    <h2
      class="text-title-sm font-bold"
      :class="variant === 'solid' ? 'text-white' : 'text-gray-800 dark:text-white/90'"
    >
      <slot name="title">{{ title }}</slot>
    </h2>
    <p
      v-if="subtitle || $slots.subtitle"
      class="mx-auto mt-3 max-w-xl text-base"
      :class="variant === 'solid' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'"
    >
      <slot name="subtitle">{{ subtitle }}</slot>
    </p>
    <div v-if="$slots.actions" class="mt-8 flex flex-wrap justify-center gap-3">
      <slot name="actions" />
    </div>
  </section>
</template>

<script setup lang="ts">
interface CTAProps {
  title?: string
  subtitle?: string
  variant?: 'solid' | 'outline'
}

withDefaults(defineProps<CTAProps>(), {
  title: '',
  subtitle: '',
  variant: 'solid',
})
</script>
