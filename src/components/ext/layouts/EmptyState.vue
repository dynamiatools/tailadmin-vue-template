<template>
  <div class="flex flex-col items-center justify-center px-4 py-12 text-center">
    <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500">
      <slot name="icon">
        <FolderIcon class="h-8 w-8" />
      </slot>
    </div>

    <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">{{ title }}</h3>
    <p v-if="description" class="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
      {{ description }}
    </p>

    <div v-if="$slots.action || actionLabel" class="mt-5">
      <slot name="action">
        <Button v-if="actionLabel" size="sm" @click="emit('action')">
          {{ actionLabel }}
        </Button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '../../ui/Button.vue'
import FolderIcon from '../../../icons/FolderIcon.vue'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
}

withDefaults(defineProps<EmptyStateProps>(), {
  description: '',
  actionLabel: '',
})

const emit = defineEmits<{
  action: []
}>()
</script>
