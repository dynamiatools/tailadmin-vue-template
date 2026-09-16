<template>
  <section class="mx-auto max-w-(--breakpoint-md) px-4 py-16 sm:px-6 lg:px-8">
    <div v-if="title" class="mb-10 text-center">
      <h2 class="text-title-sm font-bold text-gray-800 dark:text-white/90">{{ title }}</h2>
    </div>

    <div class="divide-y divide-gray-200 dark:divide-gray-800">
      <div v-for="(item, index) in items" :key="item.question">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-4 py-4 text-left"
          @click="toggle(index)"
        >
          <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ item.question }}</span>
          <ChevronDownIcon
            class="h-5 w-5 shrink-0 text-gray-400 transition-transform"
            :class="openIndex === index ? 'rotate-180' : ''"
          />
        </button>
        <p v-if="openIndex === index" class="pb-4 text-sm text-gray-500 dark:text-gray-400">
          {{ item.answer }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon } from '../../../icons'

export interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  title?: string
  items: FAQItem[]
}

withDefaults(defineProps<FAQAccordionProps>(), {
  title: '',
})

const openIndex = ref<number | null>(null)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>
