<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <Table>
      <TableHeader>
        <TableRow is-header>
          <TableCell v-if="selectable" is-header class="w-11" />
          <TableCell v-for="column in columns" :key="column.key" is-header>
            {{ column.label }}
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="loading">
          <td :colspan="colCount" class="px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400">
            <slot name="loading">Loading…</slot>
          </td>
        </TableRow>
        <TableRow v-else-if="error">
          <td :colspan="colCount" class="text-error-600 dark:text-error-500 px-5 py-4 text-center sm:px-6">
            <slot name="error">{{ error }}</slot>
          </td>
        </TableRow>
        <TableRow v-else-if="nodes.length === 0">
          <td :colspan="colCount" class="px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400">
            <slot name="empty">No records found.</slot>
          </td>
        </TableRow>
        <TreeTableRow
          v-for="node in nodes"
          v-else
          :key="nodeKey(node)"
          :node="node"
          :level="0"
        >
          <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="slotProps: Record<string, unknown>">
            <slot :name="slotName" v-bind="slotProps" />
          </template>
        </TreeTableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import Table from '../../tables/Table.vue'
import TableHeader from '../../tables/TableHeader.vue'
import TableBody from '../../tables/TableBody.vue'
import TableRow from '../../tables/TableRow.vue'
import TableCell from '../../tables/TableCell.vue'
import TreeTableRow from './TreeTableRow.vue'
import {
  TREE_TABLE_COLUMNS_KEY,
  TREE_TABLE_LOAD_CHILDREN_KEY,
  TREE_TABLE_NODE_KEY_KEY,
  TREE_TABLE_SELECTABLE_KEY,
  TREE_TABLE_SELECTION_KEY,
} from './treeTableContext'

export interface TreeNode {
  id: string | number
  children?: TreeNode[]
  hasChildren?: boolean
  [key: string]: unknown
}

export interface TreeTableColumn {
  key: string
  label: string
}

interface TreeTableProps {
  columns: TreeTableColumn[]
  nodes: TreeNode[]
  nodeKeyField?: string
  loading?: boolean
  error?: string | null
  selectable?: boolean
  selected?: (string | number)[]
  loadChildren?: (node: TreeNode) => Promise<TreeNode[]>
}

const props = withDefaults(defineProps<TreeTableProps>(), {
  nodeKeyField: 'id',
  loading: false,
  error: null,
  selectable: false,
  selected: () => [],
  loadChildren: undefined,
})

const emit = defineEmits<{
  'update:selected': [selected: (string | number)[]]
}>()

const colCount = computed(() => props.columns.length + (props.selectable ? 1 : 0))

function nodeKey(node: TreeNode): string | number {
  return (node[props.nodeKeyField] as string | number) ?? node.id
}

function isSelected(node: TreeNode): boolean {
  return props.selected.includes(nodeKey(node))
}

function toggleSelect(node: TreeNode) {
  const key = nodeKey(node)
  const next = isSelected(node) ? props.selected.filter((k) => k !== key) : [...props.selected, key]
  emit('update:selected', next)
}

provide(TREE_TABLE_COLUMNS_KEY, computed(() => props.columns))
provide(TREE_TABLE_SELECTABLE_KEY, computed(() => props.selectable))
provide(TREE_TABLE_SELECTION_KEY, { isSelected, toggleSelect })
provide(TREE_TABLE_LOAD_CHILDREN_KEY, computed(() => props.loadChildren))
provide(TREE_TABLE_NODE_KEY_KEY, nodeKey)
</script>
