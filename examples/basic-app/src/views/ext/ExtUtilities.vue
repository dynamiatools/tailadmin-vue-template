<template>
  <ExtLayout page-title="Ext / Utilities">
    <ComponentCard title="LazyLoader" desc="Generic async loading wrapper with loading/error/retry states.">
      <LazyLoader :loader="loadUsers" :params="reloadToken">
        <template #default="{ data, reload }">
          <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li v-for="user in data" :key="user.id">{{ user.name }}</li>
          </ul>
          <button
            type="button"
            class="mt-3 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-400"
            @click="reload"
          >
            Reload
          </button>
        </template>
      </LazyLoader>

      <div class="mt-4">
        <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Failing loader (retry demo)</p>
        <LazyLoader :loader="loadWithError">
          <template #default="{ data }">
            <p class="text-success-600 dark:text-success-500 text-sm">{{ data }}</p>
          </template>
        </LazyLoader>
      </div>
    </ComponentCard>
  </ExtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentCard from '@dynamia-tools/tailadmin-vue/components/common/ComponentCard.vue'
import LazyLoader from '@dynamia-tools/tailadmin-vue/components/ext/utilities/LazyLoader.vue'
import ExtLayout from './ExtLayout.vue'

const reloadToken = ref(0)

function loadUsers(): Promise<{ id: number; name: string }[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Ada Lovelace' },
        { id: 2, name: 'Grace Hopper' },
      ])
    }, 600)
  })
}

let attempts = 0
function loadWithError(): Promise<string> {
  attempts += 1
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (attempts < 2) reject(new Error('Simulated failure — click Retry'))
      else resolve('Loaded successfully')
    }, 600)
  })
}
</script>
