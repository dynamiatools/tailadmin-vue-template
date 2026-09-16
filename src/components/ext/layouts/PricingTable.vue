<template>
  <section class="mx-auto max-w-(--breakpoint-2xl) px-4 py-16 sm:px-6 lg:px-8">
    <div v-if="title || subtitle" class="mx-auto mb-12 max-w-2xl text-center">
      <h2 class="text-title-sm font-bold text-gray-800 dark:text-white/90">{{ title }}</h2>
      <p v-if="subtitle" class="mt-3 text-gray-500 dark:text-gray-400">{{ subtitle }}</p>
    </div>

    <div class="grid gap-6" :class="plans.length >= 3 ? 'lg:grid-cols-3' : 'sm:grid-cols-2'">
      <div
        v-for="plan in plans"
        :key="plan.name"
        class="dark:bg-gray-900 flex flex-col rounded-2xl border p-6"
        :class="plan.highlighted ? 'border-brand-500 shadow-theme-lg' : 'border-gray-200 dark:border-gray-800'"
      >
        <span v-if="plan.highlighted" class="bg-brand-500 mb-3 w-fit rounded-full px-2.5 py-0.5 text-xs font-medium text-white">
          {{ plan.badge || 'Most popular' }}
        </span>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ plan.name }}</h3>
        <p class="mt-2 flex items-baseline gap-1">
          <span class="text-title-sm font-bold text-gray-800 dark:text-white/90">{{ plan.price }}</span>
          <span v-if="plan.period" class="text-sm text-gray-400">/{{ plan.period }}</span>
        </p>
        <p v-if="plan.description" class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ plan.description }}</p>

        <ul class="mt-6 flex-1 space-y-3">
          <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
            <CheckIcon class="text-success-500 mt-0.5 h-4 w-4 shrink-0" />
            {{ feature }}
          </li>
        </ul>

        <div class="mt-6">
          <slot name="action" :plan="plan">
            <Button class="w-full justify-center" :variant="plan.highlighted ? 'primary' : 'outline'" @click="emit('select', plan)">
              {{ plan.cta || 'Choose plan' }}
            </Button>
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '../../ui/Button.vue'
import { CheckIcon } from '../../../icons'

export interface PricingPlan {
  name: string
  price: string
  period?: string
  description?: string
  features: string[]
  highlighted?: boolean
  badge?: string
  cta?: string
}

interface PricingTableProps {
  title?: string
  subtitle?: string
  plans: PricingPlan[]
}

withDefaults(defineProps<PricingTableProps>(), {
  title: '',
  subtitle: '',
})

const emit = defineEmits<{
  select: [plan: PricingPlan]
}>()
</script>
