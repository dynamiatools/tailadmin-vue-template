<template>
  <TableRow>
    <TableCell v-if="selectable" class="w-11">
      <input type="checkbox" :checked="selection.isSelected(node)" @change="selection.toggleSelect(node)" />
    </TableCell>
    <TableCell v-for="(column, index) in columns" :key="column.key">
      <div class="flex items-center gap-1.5" :style="index === 0 ? { paddingLeft: `${level * 1.25}rem` } : {}">
        <template v-if="index === 0">
          <button
            v-if="hasChildren"
            type="button"
            class="flex h-5 w-5 shrink-0 items-center justify-center text-gray-500 dark:text-gray-400"
            :aria-label="expanded ? 'Collapse' : 'Expand'"
            @click="toggleExpand"
          >
            <ChevronRightIcon :class="['transition-transform', expanded ? 'rotate-90' : '']" />
          </button>
          <span v-else class="inline-block h-5 w-5 shrink-0" />
        </template>
        <span class="text-sm text-gray-700 dark:text-gray-300">
          <slot :name="`cell-${column.key}`" :node="node" :value="node[column.key]">
            {{ node[column.key] }}
          </slot>
        </span>
      </div>
    </TableCell>
  </TableRow>

  <template v-if="expanded">
    <TableRow v-if="loadingChildren">
      <td :colspan="colCount" class="px-5 py-3 text-sm text-gray-500 sm:px-6 dark:text-gray-400">Loading…</td>
    </TableRow>
    <TableRow v-else-if="loadError">
      <td :colspan="colCount" class="text-error-600 dark:text-error-500 px-5 py-3 text-sm sm:px-6">
        {{ loadError }}
      </td>
    </TableRow>
    <TreeTableRow
      v-for="child in children"
      v-else
      :key="nodeKeyFn(child)"
      :node="child"
      :level="level + 1"
    >
      <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="slotProps: Record<string, unknown>">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </TreeTableRow>
  </template>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import TableRow from '../../tables/TableRow.vue'
import TableCell from '../../tables/TableCell.vue'
import ChevronRightIcon from '../../../icons/ChevronRightIcon.vue'
import type { TreeNode } from './TreeTable.vue'
import {
  TREE_TABLE_COLUMNS_KEY,
  TREE_TABLE_LOAD_CHILDREN_KEY,
  TREE_TABLE_NODE_KEY_KEY,
  TREE_TABLE_SELECTABLE_KEY,
  TREE_TABLE_SELECTION_KEY,
} from './treeTableContext'

const props = defineProps<{
  node: TreeNode
  level: number
}>()

const columns = inject(TREE_TABLE_COLUMNS_KEY)!
const selectableRef = inject(TREE_TABLE_SELECTABLE_KEY)!
const selection = inject(TREE_TABLE_SELECTION_KEY)!
const loadChildrenRef = inject(TREE_TABLE_LOAD_CHILDREN_KEY)!
const nodeKeyFn = inject(TREE_TABLE_NODE_KEY_KEY)!

const selectable = computed(() => selectableRef.value)
const colCount = computed(() => columns.value.length + (selectable.value ? 1 : 0))

const expanded = ref(false)
const children = ref<TreeNode[]>(props.node.children ?? [])
const childrenLoaded = ref(!!props.node.children || !props.node.hasChildren)
const loadingChildren = ref(false)
const loadError = ref<string | null>(null)

const hasChildren = computed(() =>
  props.node.hasChildren !== undefined ? props.node.hasChildren : children.value.length > 0,
)

async function toggleExpand() {
  if (!hasChildren.value) return
  expanded.value = !expanded.value
  if (!expanded.value || childrenLoaded.value) return

  const loadChildren = loadChildrenRef.value
  if (!loadChildren) {
    childrenLoaded.value = true
    return
  }

  loadingChildren.value = true
  loadError.value = null
  try {
    children.value = await loadChildren(props.node)
    childrenLoaded.value = true
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : 'Failed to load children'
  } finally {
    loadingChildren.value = false
  }
}
</script>
