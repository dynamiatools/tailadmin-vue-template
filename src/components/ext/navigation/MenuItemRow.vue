<template>
  <li class="relative">
    <component
      :is="item.href && !hasChildren ? 'a' : 'button'"
      :href="item.href && !hasChildren ? item.href : undefined"
      :type="item.href && !hasChildren ? undefined : 'button'"
      :disabled="!item.href && item.disabled"
      class="menu-item group"
      :class="isActive ? 'menu-item-active' : 'menu-item-inactive'"
      @click="onClick"
    >
      <component :is="item.icon" v-if="item.icon" :class="['h-5 w-5 shrink-0', isActive ? 'menu-item-icon-active' : 'menu-item-icon-inactive']" />
      <span class="flex-1 text-left">{{ item.label }}</span>
      <ChevronDownIcon
        v-if="hasChildren"
        :class="['h-4 w-4 shrink-0 transition-transform', expanded ? 'rotate-180' : '', isActive ? 'menu-item-icon-active' : 'menu-item-icon-inactive']"
      />
    </component>

    <ul
      v-if="hasChildren && expanded"
      :class="
        topLevel && orientation === 'horizontal'
          ? 'dark:bg-gray-900 absolute left-0 top-full z-30 mt-1 min-w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-theme-lg dark:border-gray-700'
          : 'mt-1 ml-6 flex flex-col gap-1 border-l border-gray-200 pl-3 dark:border-gray-800'
      "
    >
      <MenuItemRow
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        orientation="vertical"
        :active-id="activeId"
        :top-level="false"
        @select="(selected) => emit('select', selected)"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ChevronDownIcon from '../../../icons/ChevronDownIcon.vue'
import type { MenuItem } from './Menu.vue'

const props = defineProps<{
  item: MenuItem
  orientation: 'vertical' | 'horizontal'
  activeId?: string | number | null
  topLevel: boolean
}>()

const emit = defineEmits<{
  select: [item: MenuItem]
}>()

const expanded = ref(false)
const hasChildren = computed(() => !!props.item.children?.length)
const isActive = computed(() => props.item.id === props.activeId)

function onClick(event: MouseEvent) {
  if (props.item.disabled) {
    event.preventDefault()
    return
  }
  if (hasChildren.value) {
    event.preventDefault()
    expanded.value = !expanded.value
    return
  }
  emit('select', props.item)
}
</script>
