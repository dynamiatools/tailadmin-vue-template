<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <Table>
      <TableHeader>
        <TableRow is-header>
          <TableCell v-for="column in columns" :key="column.key" is-header>
            {{ column.label }}
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(row, rowIndex) in modelValue" :key="rowIndex">
          <TableCell v-for="column in columns" :key="column.key">
            <input
              v-if="column.editable && isEditing(rowIndex, column.key)"
              ref="editingInputRef"
              :type="column.type === 'number' ? 'number' : 'text'"
              class="dark:bg-gray-900 -my-1.5 h-9 w-full rounded-md border border-brand-300 bg-transparent px-2 text-sm text-gray-800 focus:outline-hidden dark:border-brand-800 dark:text-white/90"
              :value="row[column.key]"
              @blur="commitEdit(rowIndex, column.key, $event)"
              @keydown.enter="commitEdit(rowIndex, column.key, $event)"
              @keydown.esc="cancelEdit"
            />
            <div
              v-else
              class="text-sm text-gray-700 dark:text-gray-300"
              :class="column.editable ? 'cursor-text rounded-md px-1 -mx-1 hover:bg-gray-50 dark:hover:bg-white/[0.03]' : ''"
              @click="column.editable && startEdit(rowIndex, column.key)"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import Table from '../../tables/Table.vue'
import TableHeader from '../../tables/TableHeader.vue'
import TableBody from '../../tables/TableBody.vue'
import TableRow from '../../tables/TableRow.vue'
import TableCell from '../../tables/TableCell.vue'

export interface DataGridColumn {
  key: string
  label: string
  editable?: boolean
  type?: 'text' | 'number'
}

interface DataGridProps {
  columns: DataGridColumn[]
  modelValue: Record<string, unknown>[]
}

const props = defineProps<DataGridProps>()

const emit = defineEmits<{
  'update:modelValue': [rows: Record<string, unknown>[]]
  'cell-change': [payload: { rowIndex: number; key: string; value: unknown }]
}>()

const editingCell = ref<{ rowIndex: number; key: string } | null>(null)
const editingInputRef = ref<HTMLInputElement[] | null>(null)

function isEditing(rowIndex: number, key: string): boolean {
  return editingCell.value?.rowIndex === rowIndex && editingCell.value?.key === key
}

async function startEdit(rowIndex: number, key: string) {
  editingCell.value = { rowIndex, key }
  await nextTick()
  editingInputRef.value?.[0]?.focus()
}

function cancelEdit() {
  editingCell.value = null
}

function commitEdit(rowIndex: number, key: string, event: Event) {
  const target = event.target as HTMLInputElement
  const column = props.columns.find((c) => c.key === key)
  const value: unknown = column?.type === 'number' ? Number(target.value) : target.value

  const next = props.modelValue.map((row, i) => (i === rowIndex ? { ...row, [key]: value } : row))
  emit('update:modelValue', next)
  emit('cell-change', { rowIndex, key, value })
  editingCell.value = null
}
</script>
