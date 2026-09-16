<template>
  <ExtLayout page-title="Ext / Data">
    <ComponentCard title="DataTable" desc="Sortable, selectable table with pagination.">
      <DataTable
        :columns="tableColumns"
        :rows="tableRows"
        selectable
        :selected="selectedRows"
        :sort-key="sortKey"
        :sort-direction="sortDirection"
        @update:selected="(rows) => (selectedRows = rows)"
        @sort-change="onSortChange"
      >
        <template #cell-status="{ value }">
          <span
            class="rounded-full px-2 py-0.5 text-xs font-medium"
            :class="
              value === 'active'
                ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'
                : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400'
            "
          >
            {{ value }}
          </span>
        </template>
      </DataTable>
      <p class="text-sm text-gray-500 dark:text-gray-400">Selected: {{ selectedRows.length }}</p>
    </ComponentCard>

    <ComponentCard title="DataGrid" desc="Click a cell to edit it inline.">
      <DataGrid :columns="gridColumns" v-model="gridRows" />
    </ComponentCard>

    <ComponentCard title="TreeTable" desc="Hierarchical rows with lazy-loaded children.">
      <TreeTable :columns="treeColumns" :nodes="treeNodes" :load-children="loadChildren" />
    </ComponentCard>

    <ComponentCard title="EntitySelector" desc="Dropdown selector with inline search.">
      <EntitySelector v-model="selectedCustomer" :items="customers" placeholder="Select a customer" />
      <p class="text-sm text-gray-500 dark:text-gray-400">Selected: {{ selectedCustomer ?? '—' }}</p>
    </ComponentCard>

    <ComponentCard title="EntityAutocomplete" desc="Debounced remote search.">
      <EntityAutocomplete v-model="selectedProduct" :search="searchProducts" placeholder="Search products…" />
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Selected: {{ selectedProduct?.label ?? '—' }}
      </p>
    </ComponentCard>

    <ComponentCard title="ItemSelector" desc="Visual grid selector for simple or complex values.">
      <ItemSelector :items="planOptions" v-model="selectedPlan" :columns="3" />
      <p class="text-sm text-gray-500 dark:text-gray-400">Selected: {{ selectedPlan ?? '—' }}</p>
    </ComponentCard>
  </ExtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentCard from '@dynamia-tools/tailadmin-vue/components/common/ComponentCard.vue'
import DataTable from '@dynamia-tools/tailadmin-vue/components/ext/data/DataTable.vue'
import type { DataTableColumn } from '@dynamia-tools/tailadmin-vue/components/ext/data/DataTable.vue'
import DataGrid from '@dynamia-tools/tailadmin-vue/components/ext/data/DataGrid.vue'
import type { DataGridColumn } from '@dynamia-tools/tailadmin-vue/components/ext/data/DataGrid.vue'
import TreeTable from '@dynamia-tools/tailadmin-vue/components/ext/data/TreeTable.vue'
import type { TreeNode, TreeTableColumn } from '@dynamia-tools/tailadmin-vue/components/ext/data/TreeTable.vue'
import EntitySelector from '@dynamia-tools/tailadmin-vue/components/ext/data/EntitySelector.vue'
import EntityAutocomplete from '@dynamia-tools/tailadmin-vue/components/ext/data/EntityAutocomplete.vue'
import ItemSelector from '@dynamia-tools/tailadmin-vue/components/ext/data/ItemSelector.vue'
import ExtLayout from './ExtLayout.vue'

const tableColumns: DataTableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
]
const tableRows = ref<Record<string, unknown>[]>([
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', status: 'active' },
  { id: 2, name: 'Grace Hopper', email: 'grace@example.com', status: 'inactive' },
  { id: 3, name: 'Alan Turing', email: 'alan@example.com', status: 'active' },
])
const selectedRows = ref<Record<string, unknown>[]>([])
const sortKey = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')
function onSortChange({ key, direction }: { key: string; direction: 'asc' | 'desc' }) {
  sortKey.value = key
  sortDirection.value = direction
  tableRows.value = [...tableRows.value].sort((a, b) => {
    const cmp = String(a[key]).localeCompare(String(b[key]))
    return direction === 'asc' ? cmp : -cmp
  })
}

const gridColumns: DataGridColumn[] = [
  { key: 'sku', label: 'SKU' },
  { key: 'price', label: 'Price', editable: true, type: 'number' },
  { key: 'stock', label: 'Stock', editable: true, type: 'number' },
]
const gridRows = ref([
  { sku: 'SKU-001', price: 19.99, stock: 42 },
  { sku: 'SKU-002', price: 29.99, stock: 7 },
])

const treeColumns: TreeTableColumn[] = [{ key: 'name', label: 'Category' }]
const treeNodes = ref<TreeNode[]>([
  { id: 'electronics', name: 'Electronics', hasChildren: true },
  {
    id: 'clothing',
    name: 'Clothing',
    children: [
      { id: 'clothing-men', name: 'Men' },
      { id: 'clothing-women', name: 'Women' },
    ],
  },
])
function loadChildren(node: TreeNode): Promise<TreeNode[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: `${node.id}-1`, name: 'Phones' },
        { id: `${node.id}-2`, name: 'Laptops' },
      ])
    }, 500)
  })
}

const customers = [
  { value: 1, label: 'Acme Corp' },
  { value: 2, label: 'Globex Inc' },
  { value: 3, label: 'Initech' },
]
const selectedCustomer = ref<number | null>(null)

const productCatalog = [
  { value: 'p1', label: 'Wireless Mouse' },
  { value: 'p2', label: 'Mechanical Keyboard' },
  { value: 'p3', label: 'USB-C Hub' },
]
const selectedProduct = ref<{ value: string; label: string } | null>(null)
function searchProducts(query: string) {
  return new Promise<{ value: string; label: string }[]>((resolve) => {
    setTimeout(() => {
      resolve(productCatalog.filter((p) => p.label.toLowerCase().includes(query.toLowerCase())))
    }, 300)
  })
}

const planOptions = [
  { value: 'starter', label: 'Starter' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
]
const selectedPlan = ref<string | null>('pro')
</script>
