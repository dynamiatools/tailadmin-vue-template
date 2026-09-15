<template>
  <div class="flex gap-4 overflow-x-auto pb-2">
    <div
      v-for="column in columns"
      :key="column.id"
      class="w-72 shrink-0 rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02]"
    >
      <div class="flex items-center justify-between px-3 py-2.5">
        <slot name="column-header" :column="column">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ column.title }}</span>
          <span class="text-xs text-gray-400">{{ column.items.length }}</span>
        </slot>
      </div>

      <draggable
        v-model="column.items"
        item-key="id"
        group="kanban-ext"
        ghost-class="opacity-50"
        class="min-h-20 space-y-2 px-3 pb-3"
        @change="(event: unknown) => onChange(column, event)"
      >
        <template #item="{ element }: { element: KanbanItem }">
          <div
            class="dark:bg-dark-900 cursor-grab rounded-lg border border-gray-200 bg-white p-3 text-sm shadow-theme-xs active:cursor-grabbing dark:border-gray-700"
          >
            <slot name="item" :item="element" :column="column">
              {{ element.title ?? element.id }}
            </slot>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'

export interface KanbanItem {
  id: string | number
  title?: string
  [key: string]: unknown
}

export interface KanbanColumn {
  id: string | number
  title: string
  items: KanbanItem[]
}

interface KanbanChangeAdded {
  added: { element: KanbanItem; newIndex: number }
}

const columns = defineModel<KanbanColumn[]>({ required: true })

const emit = defineEmits<{
  'item-move': [payload: { item: KanbanItem; column: KanbanColumn }]
}>()

function onChange(column: KanbanColumn, event: unknown) {
  const added = (event as KanbanChangeAdded).added
  if (added) emit('item-move', { item: added.element, column })
}
</script>
