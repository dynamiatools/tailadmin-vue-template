<script setup lang="ts">
import { ref } from 'vue'

import AdminLayout from '@dynamia-tools/tailadmin-vue/components/layout/AdminLayout.vue'
import AppSidebar from '@dynamia-tools/tailadmin-vue/components/layout/AppSidebar.vue'
import type { MenuGroup } from '@dynamia-tools/tailadmin-vue/components/layout/AppSidebar.vue'
import AppHeader from '@dynamia-tools/tailadmin-vue/components/layout/AppHeader.vue'
import NotificationMenu from '@dynamia-tools/tailadmin-vue/components/layout/header/NotificationMenu.vue'
import type { NotificationItem } from '@dynamia-tools/tailadmin-vue/components/layout/header/NotificationMenu.vue'
import UserMenu from '@dynamia-tools/tailadmin-vue/components/layout/header/UserMenu.vue'
import ThemeToggler from '@dynamia-tools/tailadmin-vue/components/common/ThemeToggler.vue'
import {
  HomeIcon,
  UserGroupIcon,
  FolderIcon,
  PlugInIcon,
  SettingsIcon,
} from '@dynamia-tools/tailadmin-vue/icons'

// A tiny inline avatar generator so this example needs no image assets of its
// own — a real app would pass a real avatar/logo URL instead.
function initialsAvatar(initials: string, background: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="32" fill="${background}"/><text x="32" y="41" font-family="system-ui, sans-serif" font-size="24" fill="white" text-anchor="middle">${initials}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// Custom nav — deliberately unrelated to the demo dashboard menu, to make it
// obvious this isn't the package's built-in data.
const menuGroups: MenuGroup[] = [
  {
    title: 'Workspace',
    items: [
      { icon: HomeIcon, name: 'Overview', path: '/' },
      { icon: UserGroupIcon, name: 'Team', path: '/team' },
      { icon: FolderIcon, name: 'Projects', path: '/projects' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { icon: PlugInIcon, name: 'Integrations', path: '/integrations' },
      { icon: SettingsIcon, name: 'Settings', path: '/settings' },
    ],
  },
]

const notifications: NotificationItem[] = [
  {
    id: 1,
    userName: 'CI Pipeline',
    userImage: initialsAvatar('CI', '#0ea5e9'),
    action: 'finished deploying',
    project: 'production',
    type: 'Deploy',
    time: '2 min ago',
    status: 'online',
  },
  {
    id: 2,
    userName: 'Sam Rivera',
    userImage: initialsAvatar('SR', '#f97316'),
    action: 'requested access to',
    project: 'billing dashboard',
    type: 'Access',
    time: '18 min ago',
    status: 'online',
  },
  {
    id: 3,
    userName: 'Uptime Monitor',
    userImage: initialsAvatar('UM', '#ef4444'),
    action: 'flagged a latency spike in',
    project: 'checkout-api',
    type: 'Alert',
    time: '1 hr ago',
    status: 'offline',
  },
]

const userAvatar = initialsAvatar('AL', '#8b5cf6')

const isProduction = ref(true)

const eventLog = ref<string[]>([])
function logEvent(message: string) {
  eventLog.value = [`${new Date().toLocaleTimeString()} — ${message}`, ...eventLog.value].slice(
    0,
    6,
  )
}

function handleNotificationClick(notification: NotificationItem) {
  logEvent(`Notification opened — ${notification.userName}: ${notification.action} ${notification.project}`)
}

function handleViewAllNotifications() {
  logEvent('Clicked "View All Notifications"')
}

function handleSignOut() {
  logEvent('UserMenu emitted @sign-out')
}
</script>

<template>
  <AdminLayout>
    <template #sidebar>
      <div class="custom-sidebar-shell">
        <AppSidebar
          :menu-groups="menuGroups"
          active-item-class="bg-white/10 text-white"
          inactive-item-class="text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <template #sidebar-header>
            <div class="flex items-center gap-3 pt-8 pb-7">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500 text-sm font-bold text-white"
              >
                NW
              </span>
              <span class="truncate text-sm font-semibold text-white">Northwind Ops</span>
            </div>
          </template>

          <template #sidebar-footer>
            <div class="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 pb-6">
              <button
                type="button"
                class="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10"
                @click="isProduction = !isProduction"
              >
                <span>Environment</span>
                <span :class="isProduction ? 'text-success-400' : 'text-warning-400'">
                  {{ isProduction ? 'Production' : 'Sandbox' }}
                </span>
              </button>
              <ThemeToggler />
            </div>
          </template>
        </AppSidebar>
      </div>
    </template>

    <template #header>
      <div class="custom-header-shell">
        <AppHeader>
          <template #search>
            <div
              class="hidden items-center gap-2 rounded-lg border border-indigo-200 bg-white/60 px-3 py-2 text-sm text-indigo-900 dark:border-indigo-800 dark:bg-white/5 dark:text-indigo-100 xl:flex"
            >
              <span aria-hidden="true">🔍</span>
              <span>Custom search placeholder…</span>
            </div>
          </template>

          <template #actions>
            <span
              class="hidden rounded-full border border-indigo-200 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:text-indigo-200 sm:inline-block"
            >
              EN
            </span>
          </template>

          <template #notifications>
            <NotificationMenu
              :notifications="notifications"
              @item-click="handleNotificationClick"
              @view-all="handleViewAllNotifications"
            />
          </template>

          <template #user-menu>
            <UserMenu
              name="Ada Lovelace"
              email="ada@northwind.example"
              :avatar-url="userAvatar"
              :show-language-switcher="false"
              @sign-out="handleSignOut"
            />
          </template>
        </AppHeader>
      </div>
    </template>

    <div class="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90">Custom layout demo</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Every slot and color-affecting prop the layout components expose, wired up on one page.
          Source: <code>src/views/CustomLayoutDemo.vue</code>. Full explanation of each
          slot/prop: <code>docs/USER_GUIDE.md</code> in the package repo.
        </p>
      </div>

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <h2 class="text-base font-semibold text-gray-800 dark:text-white/90">
          What's customized here
        </h2>
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">
          <li>
            <strong>AdminLayout</strong> — <code>#sidebar</code> / <code>#header</code> slots wrap
            custom-colored shells around <code>AppSidebar</code> / <code>AppHeader</code>. Their
            background color isn't a prop, so the color swap is a scoped <code>:deep()</code>
            override in this file's <code>&lt;style&gt;</code> block, not a documented API.
          </li>
          <li>
            <strong>AppSidebar</strong> — custom <code>menu-groups</code>,
            <code>active-item-class</code> / <code>inactive-item-class</code>, plus
            <code>#sidebar-header</code> (workspace badge) and <code>#sidebar-footer</code>
            (environment toggle + the package's own <code>ThemeToggler</code>).
          </li>
          <li>
            <strong>AppHeader</strong> — all four slots filled: <code>#search</code>,
            <code>#actions</code>, <code>#notifications</code>, <code>#user-menu</code>.
          </li>
          <li>
            <strong>NotificationMenu</strong> — custom <code>notifications</code> data,
            <code>@item-click</code> / <code>@view-all</code> wired to the log below instead of a
            real backend.
          </li>
          <li>
            <strong>UserMenu</strong> — custom <code>name</code> / <code>email</code> /
            <code>avatar-url</code>, <code>show-language-switcher</code> off (the header's
            <code>#actions</code> slot has its own "EN" pill instead), <code>@sign-out</code>
            wired to the log.
          </li>
        </ul>
        <p class="mt-3 text-xs text-gray-400 dark:text-gray-500">
          Known gap: expanded submenu items (<code>menu-dropdown-item-*</code>) aren't covered by
          <code>active-item-class</code> / <code>inactive-item-class</code> — they'd still render
          with upstream's light-mode text color on a dark sidebar. That's why this demo's menu
          sticks to flat items with no <code>subItems</code>. A real dark-sidebar theme would need
          a small CSS override for those classes too (or a feature request against this package).
        </p>
      </div>

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <h2 class="text-base font-semibold text-gray-800 dark:text-white/90">Event log</h2>
        <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
          Click a notification, "View All Notifications", or sign out from the user menu — the
          emitted events land here.
        </p>
        <ul class="mt-3 space-y-1.5 font-mono text-xs text-gray-600 dark:text-gray-300">
          <li v-if="eventLog.length === 0" class="text-gray-400 dark:text-gray-500">
            (nothing yet)
          </li>
          <li v-for="entry in eventLog" :key="entry">{{ entry }}</li>
        </ul>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
/* AppSidebar/AppHeader don't expose a background-color prop — this is the
   documented workaround (see docs/USER_GUIDE.md) for retheming a piece you
   don't want to fully replace: a scoped :deep() override with enough
   specificity to beat the component's own utility classes. */
.custom-sidebar-shell :deep(aside) {
  background-color: #0f172a;
  border-color: rgba(148, 163, 184, 0.16);
}

.custom-header-shell :deep(header) {
  background-color: #eef2ff;
  border-color: #c7d2fe;
}

html.dark .custom-header-shell :deep(header) {
  background-color: #1e1b4b;
  border-color: #3730a3;
}
</style>
