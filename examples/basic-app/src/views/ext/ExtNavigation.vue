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
import { PlusIcon, TaskIcon, DocsIcon, SettingsIcon } from '@dynamia-tools/tailadmin-vue/icons'
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
</script>
