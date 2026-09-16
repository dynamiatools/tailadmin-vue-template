<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <Table>
      <TableHeader>
        <TableRow is-header>
          <TableCell v-if="selectable" is-header class="w-11">
            <input
              type="checkbox"
              :checked="allSelected"
              :indeterminate="someSelected"
              @change="toggleSelectAll"
            />
          </TableCell>
          <TableCell
            v-for="column in columns"
            :key="column.key"
            is-header
            :class="column.sortable ? 'cursor-pointer select-none' : ''"
            @click="column.sortable && toggleSort(column.key)"
          >
            <span class="inline-flex items-center gap-1">
              {{ column.label }}
              <span v-if="column.sortable && sortKey === column.key" class="text-gray-400 dark:text-gray-500">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </span>
          </TableCell>
          <TableCell v-if="$slots.actions" is-header class="w-1">Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="loading">
          <td :colspan="colCount" class="px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400">
            <slot name="loading">Loading…</slot>
          </td>
        </TableRow>
        <TableRow v-else-if="rows.length === 0">
          <td :colspan="colCount" class="px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400">
            <slot name="empty">No records found.</slot>
          </td>
        </TableRow>
        <TableRow v-for="(row, rowIndex) in rows" v-else :key="getRowKey(row, rowIndex)">
          <TableCell v-if="selectable" class="w-11">
            <input
              type="checkbox"
              :checked="isSelected(row)"
              @change="toggleSelect(row)"
            />
          </TableCell>
          <TableCell v-for="column in columns" :key="column.key">
            <span class="text-sm text-gray-700 dark:text-gray-300">
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </span>
          </TableCell>
          <TableCell v-if="$slots.actions">
            <slot name="actions" :row="row" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div
      v-if="pagination"
      class="flex items-center justify-between border-t border-gray-200 px-5 py-3 dark:border-gray-800"
    >
      <span class="text-sm text-gray-500 dark:text-gray-400">
        Page {{ pagination.page }} of {{ totalPages }}
      </span>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400"
          :disabled="pagination.page <= 1"
          @click="emit('page-change', pagination.page - 1)"
        >
          Previous
        </button>
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400"
          :disabled="pagination.page >= totalPages"
          @click="emit('page-change', pagination.page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Table from '../../tables/Table.vue'
import TableHeader from '../../tables/TableHeader.vue'
import TableBody from '../../tables/TableBody.vue'
import TableRow from '../../tables/TableRow.vue'
import TableCell from '../../tables/TableCell.vue'

export interface DataTableColumn {
  key: string
  label: string
  sortable?: boolean
}

export interface DataTablePagination {
  page: number
  pageSize: number
  total: number
}

interface DataTableProps {
  columns: DataTableColumn[]
  rows: Record<string, unknown>[]
  rowKey?: string | ((row: Record<string, unknown>, index: number) => string | number)
  loading?: boolean
  selectable?: boolean
  selected?: Record<string, unknown>[]
  sortKey?: string | null
  sortDirection?: 'asc' | 'desc'
  pagination?: DataTablePagination | null
}

const props = withDefaults(defineProps<DataTableProps>(), {
  rowKey: 'id',
  loading: false,
  selectable: false,
  selected: () => [],
  sortKey: null,
  sortDirection: 'asc',
  pagination: null,
})

const emit = defineEmits<{
  'update:selected': [rows: Record<string, unknown>[]]
  'sort-change': [payload: { key: string; direction: 'asc' | 'desc' }]
  'page-change': [page: number]
}>()

const colCount = computed(() => props.columns.length + (props.selectable ? 1 : 0))
const totalPages = computed(() =>
  props.pagination ? Math.max(1, Math.ceil(props.pagination.total / props.pagination.pageSize)) : 1,
)

function getRowKey(row: Record<string, unknown>, index: number): string | number {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  return (row[props.rowKey] as string | number) ?? index
}

function isSelected(row: Record<string, unknown>): boolean {
  return props.selected.some((selectedRow, i) => getRowKey(selectedRow, i) === getRowKey(row, i))
}

const allSelected = computed(() => props.rows.length > 0 && props.rows.every((row) => isSelected(row)))
const someSelected = computed(() => !allSelected.value && props.rows.some((row) => isSelected(row)))

function toggleSelect(row: Record<string, unknown>) {
  const next = isSelected(row)
    ? props.selected.filter((selectedRow, i) => getRowKey(selectedRow, i) !== getRowKey(row, i))
    : [...props.selected, row]
  emit('update:selected', next)
}

function toggleSelectAll() {
  emit('update:selected', allSelected.value ? [] : [...props.rows])
}

function toggleSort(key: string) {
  const direction = props.sortKey === key && props.sortDirection === 'asc' ? 'desc' : 'asc'
  emit('sort-change', { key, direction })
}
</script>
