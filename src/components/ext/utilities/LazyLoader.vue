<template>
  <div>
    <slot v-if="loading" name="loading">
      <div class="flex items-center justify-center py-8 text-sm text-gray-500 dark:text-gray-400">Loading…</div>
    </slot>
    <slot v-else-if="error" name="error" :error="error" :retry="reload">
      <div class="flex flex-col items-center gap-3 py-8 text-center">
        <p class="text-error-600 dark:text-error-500 text-sm">{{ error.message }}</p>
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-400"
          @click="reload"
        >
          Retry
        </button>
      </div>
    </slot>
    <slot v-else :data="data as T" :reload="reload" />
  </div>
</template>

<script setup lang="ts" generic="T">
import { onMounted, ref, watch } from 'vue'

const cache = new Map<string, unknown>()

interface LazyLoaderProps {
  loader: () => Promise<T>
  /** Re-runs the loader whenever this value changes (e.g. filters, page, id). */
  params?: unknown
  immediate?: boolean
  /** When set, caches the resolved value in memory under this key across reloads/instances. */
  cacheKey?: string
}

const props = withDefaults(defineProps<LazyLoaderProps>(), {
  params: undefined,
  immediate: true,
  cacheKey: undefined,
})

const emit = defineEmits<{
  loaded: [data: T]
  error: [error: Error]
}>()

const data = ref<T | null>(null)
const loading = ref(false)
const error = ref<Error | null>(null)

async function load() {
  if (props.cacheKey && cache.has(props.cacheKey)) {
    data.value = cache.get(props.cacheKey) as T
    error.value = null
    return
  }

  loading.value = true
  error.value = null
  try {
    const result = await props.loader()
    data.value = result
    if (props.cacheKey) cache.set(props.cacheKey, result)
    emit('loaded', result)
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err))
    emit('error', error.value)
  } finally {
    loading.value = false
  }
}

function reload() {
  if (props.cacheKey) cache.delete(props.cacheKey)
  return load()
}

onMounted(() => {
  if (props.immediate) load()
})

watch(
  () => props.params,
  () => {
    if (props.params !== undefined) load()
  },
)

defineExpose({ reload, load })
</script>
