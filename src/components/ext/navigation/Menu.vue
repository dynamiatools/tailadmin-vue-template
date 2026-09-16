<template>
  <nav>
    <ul :class="orientation === 'horizontal' ? 'flex items-center gap-1' : 'flex flex-col gap-1'">
      <MenuItemRow
        v-for="item in items"
        :key="item.id"
        :item="item"
        :orientation="orientation"
        :active-id="activeId"
        :top-level="true"
        @select="(selected) => emit('select', selected)"
      />
    </ul>
  </nav>
</template>

<script setup lang="ts">
import MenuItemRow from './MenuItemRow.vue'

export interface MenuItem {
  id: string | number
  label: string
  icon?: object
  href?: string
  disabled?: boolean
  children?: MenuItem[]
}

interface MenuProps {
  items: MenuItem[]
  orientation?: 'vertical' | 'horizontal'
  activeId?: string | number | null
}

withDefaults(defineProps<MenuProps>(), {
  orientation: 'vertical',
  activeId: null,
})

const emit = defineEmits<{
  select: [item: MenuItem]
}>()
</script>
