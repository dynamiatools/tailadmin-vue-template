<template>
  <section class="mx-auto max-w-(--breakpoint-2xl) px-4 py-16 sm:px-6 lg:px-8">
    <div v-if="title" class="mx-auto mb-12 max-w-2xl text-center">
      <h2 class="text-title-sm font-bold text-gray-800 dark:text-white/90">{{ title }}</h2>
    </div>

    <div class="grid gap-6" :class="items.length >= 3 ? 'lg:grid-cols-3' : 'sm:grid-cols-2'">
      <figure
        v-for="item in items"
        :key="item.name"
        class="dark:bg-gray-900 rounded-2xl border border-gray-200 p-6 dark:border-gray-800"
      >
        <blockquote class="text-sm text-gray-600 dark:text-gray-300">“{{ item.quote }}”</blockquote>
        <figcaption class="mt-5 flex items-center gap-3">
          <img v-if="item.avatar" :src="item.avatar" :alt="item.name" class="h-10 w-10 rounded-full object-cover" />
          <div>
            <p class="text-sm font-semibold text-gray-800 dark:text-white/90">{{ item.name }}</p>
            <p v-if="item.role" class="text-xs text-gray-400">{{ item.role }}</p>
          </div>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface TestimonialItem {
  quote: string
  name: string
  role?: string
  avatar?: string
}

interface TestimonialProps {
  title?: string
  items: TestimonialItem[]
}

withDefaults(defineProps<TestimonialProps>(), {
  title: '',
})
</script>
