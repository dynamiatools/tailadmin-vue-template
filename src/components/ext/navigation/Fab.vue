<template>
  <div :class="['fixed z-50 flex flex-col items-end gap-3', positionClasses]">
    <div v-if="open && actions.length" class="flex flex-col items-end gap-2">
      <div v-for="action in actions" :key="action.id" class="group flex items-center gap-2">
        <span
          class="rounded-lg bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-700"
        >
          {{ action.label }}
        </span>
        <button
          type="button"
          class="dark:bg-gray-900 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-theme-lg dark:border-gray-700 dark:text-gray-300"
          :aria-label="action.label"
          @click="runAction(action)"
        >
          <component :is="action.icon" v-if="action.icon" class="h-5 w-5" />
        </button>
      </div>
    </div>

    <button
      type="button"
      :disabled="disabled"
      :title="tooltip"
      class="bg-brand-500 hover:bg-brand-600 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-theme-lg transition disabled:cursor-not-allowed disabled:opacity-50"
      :aria-label="tooltip || 'Actions'"
      @click="onMainClick"
    >
      <component :is="icon" class="h-6 w-6" :class="actions.length && open ? 'rotate-45 transition-transform' : 'transition-transform'" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface FabAction {
  id: string
  label: string
  icon?: object
  onClick?: () => void
}

interface FabProps {
  icon: object
  actions?: FabAction[]
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  tooltip?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<FabProps>(), {
  actions: () => [],
  position: 'bottom-right',
  tooltip: '',
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()

const open = ref(false)

const positionMap: Record<NonNullable<FabProps['position']>, string> = {
  'bottom-right': 'right-6 bottom-6',
  'bottom-left': 'left-6 bottom-6',
  'top-right': 'right-6 top-6',
  'top-left': 'left-6 top-6',
}
const positionClasses = positionMap[props.position]

function onMainClick() {
  if (props.disabled) return
  if (props.actions.length) {
    open.value = !open.value
  } else {
    emit('click')
  }
}

function runAction(action: FabAction) {
  action.onClick?.()
  open.value = false
}
</script>
