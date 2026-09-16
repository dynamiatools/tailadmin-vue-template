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

const treeColumns: TreeTableColumn[] = [
  { key: 'name', label: 'Category' },
  { key: 'type', label: 'Type' },
  { key: 'count', label: 'Items' },
]
const treeNodes = ref<TreeNode[]>([
  {
    id: 'electronics',
    name: 'Electronics',
    type: 'Department',
    count: 120,
    children: [
      {
        id: 'phones',
        name: 'Phones',
        type: 'Category',
        count: 45,
        children: [
          { id: 'phones-iphone', name: 'iPhone 15', type: 'Product', count: 12 },
          { id: 'phones-galaxy', name: 'Galaxy S24', type: 'Product', count: 18 },
        ],
      },
      {
        id: 'laptops',
        name: 'Laptops',
        type: 'Category',
        count: 75,
        children: [{ id: 'laptops-macbook', name: 'MacBook Pro', type: 'Product', count: 20 }],
      },
    ],
  },
  { id: 'clothing', name: 'Clothing', type: 'Department', count: 80, hasChildren: true },
  { id: 'home-garden', name: 'Home & Garden', type: 'Department', count: 60, hasChildren: true },
])
// Simulates a remote fetch keyed by node id — every level (including
// children loaded lazily) can itself declare hasChildren and be expanded
// further, since loadChildren is shared through TreeTable's provide/inject.
function loadChildren(node: TreeNode): Promise<TreeNode[]> {
  const childrenByParent: Record<string, TreeNode[]> = {
    clothing: [
      { id: 'clothing-men', name: 'Men', type: 'Category', count: 34, hasChildren: true },
      { id: 'clothing-women', name: 'Women', type: 'Category', count: 46, hasChildren: true },
    ],
    'clothing-men': [
      { id: 'clothing-men-shirts', name: 'Shirts', type: 'Product', count: 20 },
      { id: 'clothing-men-jeans', name: 'Jeans', type: 'Product', count: 14 },
    ],
    'clothing-women': [
      { id: 'clothing-women-dresses', name: 'Dresses', type: 'Product', count: 25 },
      { id: 'clothing-women-shoes', name: 'Shoes', type: 'Product', count: 21 },
    ],
    'home-garden': [
      { id: 'furniture', name: 'Furniture', type: 'Category', count: 28 },
      { id: 'decor', name: 'Decor', type: 'Category', count: 32 },
    ],
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve(childrenByParent[String(node.id)] ?? []), 500)
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
