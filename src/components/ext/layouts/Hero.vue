<template>
  <section class="relative overflow-hidden">
    <div class="mx-auto max-w-(--breakpoint-2xl) px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div class="grid items-center gap-10" :class="image || $slots.image ? 'lg:grid-cols-2' : ''">
        <div :class="image || $slots.image ? 'text-left' : 'mx-auto max-w-3xl text-center'">
          <p v-if="eyebrow" class="text-brand-500 mb-3 text-sm font-semibold uppercase tracking-wide">
            {{ eyebrow }}
          </p>
          <h1 class="text-title-md sm:text-title-lg font-bold text-gray-800 dark:text-white/90">
            <slot name="title">{{ title }}</slot>
          </h1>
          <p v-if="subtitle || $slots.subtitle" class="mt-4 text-lg text-gray-500 dark:text-gray-400">
            <slot name="subtitle">{{ subtitle }}</slot>
          </p>
          <div
            v-if="$slots.actions"
            class="mt-8 flex flex-wrap gap-3"
            :class="image || $slots.image ? '' : 'justify-center'"
          >
            <slot name="actions" />
          </div>
        </div>

        <div v-if="image || $slots.image" class="relative">
          <slot name="image">
            <img :src="image" :alt="title" class="w-full rounded-2xl object-cover" />
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface HeroProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  image?: string
}

withDefaults(defineProps<HeroProps>(), {
  eyebrow: '',
  title: '',
  subtitle: '',
  image: '',
})
</script>
