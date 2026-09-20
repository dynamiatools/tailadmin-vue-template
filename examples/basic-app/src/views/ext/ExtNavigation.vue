<template>
  <ExtLayout page-title="Ext / Navigation">
    <ComponentCard title="CommandPalette" desc="Cmd+K style search/command overlay.">
      <button
        type="button"
        class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-400"
        @click="paletteOpen = true"
      >
        Open command palette
      </button>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Last selected: {{ lastCommand ?? '—' }}
      </p>
      <CommandPalette
        v-model="paletteOpen"
        :commands="commands"
        @select="(command) => (lastCommand = command.label)"
      />
    </ComponentCard>

    <ComponentCard title="Fab" desc="Floating action button with an optional action menu.">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Fixed to the bottom-right corner of the viewport. Last action: {{ lastFabAction ?? '—' }}
      </p>
      <Fab :icon="PlusIcon" tooltip="Quick actions" :actions="fabActions" />
    </ComponentCard>

    <ComponentCard title="Kanban" desc="Drag-and-drop board across configurable columns.">
      <Kanban v-model="board" @item-move="onItemMove" />
      <p class="text-sm text-gray-500 dark:text-gray-400">Last move: {{ lastMove ?? '—' }}</p>
    </ComponentCard>

    <ComponentCard title="Menu" desc="Generic menu list, vertical or horizontal, with nested items.">
      <div class="space-y-6">
        <div>
          <p class="mb-2 text-xs font-medium text-gray-400 uppercase dark:text-gray-500">Vertical</p>
          <Menu :items="menuItems" orientation="vertical" :active-id="activeMenuId" @select="onMenuSelect" />
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-gray-400 uppercase dark:text-gray-500">Horizontal</p>
          <Menu :items="menuItems" orientation="horizontal" :active-id="activeMenuId" @select="onMenuSelect" />
        </div>
      </div>
    </ComponentCard>
    <ComponentCard
      title="TreeMenu"
      desc="Recursive sidebar-style menu: accordion, any depth, condensed mode with a flyout, icons by key."
    >
      <div class="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
        <label class="flex items-center gap-2"><input v-model="treeCondensed" type="checkbox" /> Condensed</label>
        <label class="flex items-center gap-2"><input v-model="treeAccordion" type="checkbox" /> Accordion</label>
        <span>Active: <strong>{{ treeActive }}</strong></span>
      </div>
      <!-- Scrolling container on purpose: the condensed flyout is teleported, so it is not clipped by it. -->
      <div
        class="max-h-96 overflow-y-auto rounded-lg border border-gray-200 p-2 transition-[width] dark:border-gray-800"
        :class="treeCondensed ? 'w-16' : 'w-72'"
      >
        <TreeMenu
          :items="treeItems"
          :active-id="treeActive"
          :condensed="treeCondensed"
          :accordion="treeAccordion"
          :icon-map="treeIcons"
          :default-icon="GridIcon"
          aria-label="Example navigation"
          @select="onTreeSelect"
        />
      </div>
    </ComponentCard>
  </ExtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentCard from '@dynamia-tools/tailadmin-vue/components/common/ComponentCard.vue'
import CommandPalette from '@dynamia-tools/tailadmin-vue/components/ext/navigation/CommandPalette.vue'
import type { CommandItem } from '@dynamia-tools/tailadmin-vue/components/ext/navigation/CommandPalette.vue'
import Fab from '@dynamia-tools/tailadmin-vue/components/ext/navigation/Fab.vue'
import type { FabAction } from '@dynamia-tools/tailadmin-vue/components/ext/navigation/Fab.vue'
import Kanban from '@dynamia-tools/tailadmin-vue/components/ext/navigation/Kanban.vue'
import type { KanbanColumn, KanbanItem } from '@dynamia-tools/tailadmin-vue/components/ext/navigation/Kanban.vue'
import Menu from '@dynamia-tools/tailadmin-vue/components/ext/navigation/Menu.vue'
import type { MenuItem } from '@dynamia-tools/tailadmin-vue/components/ext/navigation/Menu.vue'
import TreeMenu from '@dynamia-tools/tailadmin-vue/components/ext/navigation/TreeMenu.vue'
import type { TreeMenuItem } from '@dynamia-tools/tailadmin-vue/components/ext/navigation/TreeMenu.vue'
import { PlusIcon, TaskIcon, DocsIcon, SettingsIcon, GridIcon, UserCircleIcon, PieChartIcon, UserGroupIcon } from '@dynamia-tools/tailadmin-vue/icons'
import ExtLayout from './ExtLayout.vue'

const paletteOpen = ref(false)
const lastCommand = ref<string | null>(null)
const commands: CommandItem[] = [
  { id: 'new-task', label: 'Create new task', category: 'Actions', icon: TaskIcon, shortcut: 'N' },
  { id: 'open-docs', label: 'Open documentation', category: 'Actions', icon: DocsIcon },
  { id: 'settings', label: 'Open settings', category: 'Navigation', icon: SettingsIcon },
]

const lastFabAction = ref<string | null>(null)
const fabActions: FabAction[] = [
  { id: 'task', label: 'New task', icon: TaskIcon, onClick: () => (lastFabAction.value = 'New task') },
  { id: 'doc', label: 'New document', icon: DocsIcon, onClick: () => (lastFabAction.value = 'New document') },
]

const board = ref<KanbanColumn[]>([
  { id: 'todo', title: 'To Do', items: [{ id: 1, title: 'Design landing page' }, { id: 2, title: 'Write copy' }] },
  { id: 'in-progress', title: 'In Progress', items: [{ id: 3, title: 'Build EXT components' }] },
  { id: 'done', title: 'Done', items: [{ id: 4, title: 'Kickoff meeting' }] },
])
const lastMove = ref<string | null>(null)
function onItemMove({ item, column }: { item: KanbanItem; column: KanbanColumn }) {
  lastMove.value = `${item.title} → ${column.title}`
}

const activeMenuId = ref<string | number | null>('dashboard')
const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: GridIcon },
  {
    id: 'account',
    label: 'Account',
    icon: UserCircleIcon,
    children: [
      { id: 'profile', label: 'Profile' },
      { id: 'settings', label: 'Settings' },
    ],
  },
  { id: 'docs', label: 'Documentation', icon: DocsIcon },
]
function onMenuSelect(item: MenuItem) {
  activeMenuId.value = item.id
}
const treeCondensed = ref(false)
const treeAccordion = ref(true)
const treeActive = ref<string | number>('invoices')
// String keys resolved through `icon-map`: the tree data stays serializable (e.g. from an API).
const treeIcons = { sales: PieChartIcon, people: UserGroupIcon, cog: SettingsIcon, docs: DocsIcon }
const treeItems: TreeMenuItem[] = [
  { id: 'home', label: 'Home', icon: 'home', href: '#home' },
  {
    id: 'sales',
    label: 'Sales',
    icon: 'sales',
    children: [
      { id: 'invoices', label: 'Invoices', badge: 3 },
      { id: 'quotes', label: 'Quotes' },
      {
        id: 'reports',
        label: 'Reports',
        children: [
          { id: 'daily', label: 'Daily', children: [{ id: 'daily-detail', label: 'Detail' }, { id: 'daily-summary', label: 'Summary' }] },
          { id: 'monthly', label: 'Monthly' },
        ],
      },
    ],
  },
  {
    id: 'people',
    label: 'People',
    icon: 'people',
    children: [{ id: 'customers', label: 'Customers' }, { id: 'suppliers', label: 'Suppliers' }],
  },
  { id: 'settings', label: 'Settings', icon: 'cog', children: [{ id: 'company', label: 'Company' }, { id: 'taxes', label: 'Taxes', disabled: true }] },
  { id: 'misc', label: 'No icon (default icon)', children: [{ id: 'misc-1', label: 'Item' }] },
]
function onTreeSelect(item: TreeMenuItem, event: MouseEvent) {
  event.preventDefault() // consumer owns navigation (e.g. router.push)
  treeActive.value = item.id
}
</script>
