<template>
  <li>
    <component
      :is="asLink ? 'a' : 'button'"
      :href="asLink ? item.href : undefined"
      :type="asLink ? undefined : 'button'"
      :disabled="!asLink && item.disabled ? true : undefined"
      :aria-disabled="item.disabled ? true : undefined"
      :aria-expanded="hasChildren ? String(expandedState) : undefined"
      :aria-haspopup="condensedTop && hasChildren ? 'true' : undefined"
      :aria-current="isCurrent ? 'page' : undefined"
      :title="condensedTop ? item.label : undefined"
      data-tm-item
      :data-tm-id="id"
      class="group w-full text-start"
      :class="[rowClasses, condensedTop ? 'justify-center px-0' : '']"
      :style="indentStyle"
      @click="onClick"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
    >
      <SlotOutlet v-if="ctx.slots.icon" :render="ctx.slots.icon" :props="slotProps" />
      <component
        :is="icon"
        v-else-if="icon"
        class="h-5 w-5 shrink-0"
        :class="active ? 'menu-item-icon-active' : 'menu-item-icon-inactive'"
      />

      <span :class="condensedTop ? 'sr-only' : 'min-w-0 flex-1 truncate'">
        <SlotOutlet v-if="ctx.slots.label" :render="ctx.slots.label" :props="slotProps" />
        <template v-else>{{ item.label }}</template>
      </span>

      <template v-if="!condensedTop">
        <span
          v-if="item.badge !== undefined && item.badge !== ''"
          class="bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400 rounded-full px-2 py-0.5 text-xs font-medium"
        >
          {{ item.badge }}
        </span>
        <ChevronDownIcon
          v-if="hasChildren"
          class="h-4 w-4 shrink-0 transition-transform"
          :class="[open ? 'rotate-180' : '', active ? 'menu-item-arrow-active' : 'menu-item-arrow-inactive']"
        />
      </template>
    </component>

    <div
      v-if="showChildren"
      class="grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
      :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      :inert="open ? undefined : true"
      :aria-hidden="open ? undefined : true"
    >
      <div class="min-h-0 overflow-hidden">
        <ul class="flex flex-col gap-1 pt-1">
          <TreeMenuItemRow
            v-for="child in item.children"
            :key="child.id"
            :item="child"
            :level="level + 1"
            :in-flyout="inFlyout"
          />
        </ul>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed, defineComponent, inject, ref, watch } from 'vue'
import type { PropType, Slot } from 'vue'
import ChevronDownIcon from '../../../icons/ChevronDownIcon.vue'
import { TREE_MENU_KEY } from './treeMenuContext'
import type { TreeMenuItem } from './TreeMenu.vue'

// Renders a slot function handed down through the tree context (slots can't be forwarded
// through a recursive component any other way).
const SlotOutlet = defineComponent({
  props: {
    render: { type: Function as PropType<Slot>, required: true },
    props: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
  },
  setup: (p) => () => p.render(p.props),
})

const props = defineProps<{
  item: TreeMenuItem
  /** 0 for the top level. Inside a flyout the first level is 1. */
  level: number
  /** Rendered inside the condensed-mode flyout panel. */
  inFlyout?: boolean
}>()

const ctx = inject(TREE_MENU_KEY)
if (!ctx) throw new Error('TreeMenuItemRow must be rendered inside a TreeMenu')

const id = computed(() => String(props.item.id))
const hasChildren = computed(() => !!props.item.children?.length)
const isTop = computed(() => props.level === 0 && !props.inFlyout)
const condensedTop = computed(() => isTop.value && ctx.condensed.value)
const asLink = computed(() => !!props.item.href && !hasChildren.value)

const active = computed(() => ctx.activeBranch.value.has(id.value))
const isCurrent = computed(() => !hasChildren.value && ctx.activeId.value === id.value)
const open = computed(() => ctx.openIds.value.has(id.value))
const expandedState = computed(() => (condensedTop.value ? ctx.flyoutId.value === id.value : open.value))

// Children are rendered lazily (first expansion) so large trees stay cheap, and are not
// rendered inline at all for a condensed top level (they live in the flyout).
const everOpen = ref(open.value)
watch(open, (value) => {
  if (value) everOpen.value = true
})
const showChildren = computed(() => hasChildren.value && !condensedTop.value && (open.value || everOpen.value))

const icon = computed(() => {
  const own = props.item.icon
  if (typeof own === 'string') return ctx.iconMap.value[own] ?? (isTop.value ? ctx.defaultIcon.value : undefined)
  return own ?? (isTop.value ? ctx.defaultIcon.value : undefined)
})

const slotProps = computed(() => ({ item: props.item, active: active.value, level: props.level }))

// Classes are spelled out in full so Tailwind's scanner generates these package utilities.
const rowClasses = computed(() => {
  if (isTop.value) {
    return ['menu-item', active.value ? 'menu-item-active' : 'menu-item-inactive']
  }
  return ['menu-dropdown-item', active.value ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive']
})

// Nested (inline) levels align their text under the parent's label, then step 1rem per level.
const indentStyle = computed(() => {
  const depth = props.inFlyout ? props.level - 1 : props.level
  if (depth < 1) return undefined
  return { paddingInlineStart: `calc(2.75rem + ${depth - 1} * 1rem)` }
})

function onClick(event: MouseEvent) {
  if (props.item.disabled) {
    event.preventDefault()
    return
  }
  if (hasChildren.value) {
    event.preventDefault()
    if (condensedTop.value) ctx!.toggleFlyout(props.item, event.currentTarget as HTMLElement)
    else ctx!.toggle(props.item)
    return
  }
  ctx!.select(props.item, event)
}

function onPointerEnter(event: PointerEvent) {
  if (condensedTop.value && hasChildren.value && event.pointerType === 'mouse') {
    ctx!.openFlyout(props.item, event.currentTarget as HTMLElement)
  }
}

function onPointerLeave(event: PointerEvent) {
  if (condensedTop.value && hasChildren.value && event.pointerType === 'mouse') {
    ctx!.scheduleCloseFlyout()
  }
}
</script>
