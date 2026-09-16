<template>
  <div v-if="loading" class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
    <slot name="loading">Loading…</slot>
  </div>
  <div v-else-if="items.length === 0" class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
    <slot name="empty">No items found.</slot>
  </div>
  <div v-else class="grid gap-4" :style="{ gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))` }">
    <template v-for="item in items" :key="item.id">
      <slot name="item" :item="item" :selected="isSelected(item)">
        <ItemCard
          :image="item.image"
          :title="item.title"
          :subtitle="item.subtitle"
          :price="item.price"
          :currency="currency"
          :locale="locale"
          :badge="item.badge"
          :badge-color="item.badgeColor"
          :selected="isSelected(item)"
          :disabled="item.disabled"
          @click="select(item)"
        >
          <template #actions>
            <slot name="actions" :item="item" />
          </template>
        </ItemCard>
      </slot>
    </template>
  </div>
</template>

<script setup lang="ts">
import ItemCard from './ItemCard.vue'

export interface ItemGridEntry {
  id: string | number
  title: string
  subtitle?: string
  image?: string
  price?: number
  badge?: string
  badgeColor?: 'success' | 'error' | 'warning' | 'info' | 'neutral'
  disabled?: boolean
}

interface ItemGridProps {
  items: ItemGridEntry[]
  selected?: (string | number)[]
  multiple?: boolean
  loading?: boolean
  minCardWidth?: number
  currency?: string
  locale?: string
}

const props = withDefaults(defineProps<ItemGridProps>(), {
  selected: () => [],
  multiple: false,
  loading: false,
  minCardWidth: 220,
  currency: 'USD',
  locale: 'en-US',
})

const emit = defineEmits<{
  'update:selected': [selected: (string | number)[]]
  select: [item: ItemGridEntry]
}>()

function isSelected(item: ItemGridEntry): boolean {
  return props.selected.includes(item.id)
}

function select(item: ItemGridEntry) {
  emit('select', item)
  if (props.multiple) {
    const next = isSelected(item) ? props.selected.filter((id) => id !== item.id) : [...props.selected, item.id]
    emit('update:selected', next)
  } else {
    emit('update:selected', isSelected(item) ? [] : [item.id])
  }
}
</script>
