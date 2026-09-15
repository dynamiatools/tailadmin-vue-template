<template>
  <div ref="containerRef" class="w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-3 py-2 dark:border-gray-800">
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400"
          :disabled="page <= 1"
          @click="page--"
        >
          ‹
        </button>
        <span class="text-sm text-gray-600 dark:text-gray-400">Page {{ page }}</span>
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-400"
          @click="page++"
        >
          ›
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400"
          :disabled="zoom <= 50"
          @click="zoom = Math.max(50, zoom - 25)"
        >
          −
        </button>
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ zoom }}%</span>
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400"
          :disabled="zoom >= 300"
          @click="zoom = Math.min(300, zoom + 25)"
        >
          +
        </button>
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-400"
          @click="toggleFullscreen"
        >
          ⛶
        </button>
        <a
          v-if="showDownload"
          :href="src"
          download
          class="bg-brand-500 hover:bg-brand-600 rounded-lg px-2.5 py-1 text-sm text-white"
        >
          Download
        </a>
      </div>
    </div>

    <iframe :src="viewerSrc" :style="{ height }" class="w-full" title="PDF preview"></iframe>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface PdfViewerProps {
  src: string
  initialPage?: number
  initialZoom?: number
  showDownload?: boolean
  height?: string
}

const props = withDefaults(defineProps<PdfViewerProps>(), {
  initialPage: 1,
  initialZoom: 100,
  showDownload: true,
  height: '600px',
})

const containerRef = ref<HTMLElement | null>(null)
const page = ref(props.initialPage)
const zoom = ref(props.initialZoom)

const viewerSrc = computed(() => `${props.src}#page=${page.value}&zoom=${zoom.value}`)

function toggleFullscreen() {
  if (!containerRef.value) return
  if (document.fullscreenElement) {
    void document.exitFullscreen()
  } else {
    void containerRef.value.requestFullscreen?.()
  }
}
</script>
