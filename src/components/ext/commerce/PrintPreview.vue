<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center justify-end gap-2 border-b border-gray-200 px-3 py-2 dark:border-gray-800">
      <button
        type="button"
        class="bg-brand-500 hover:bg-brand-600 rounded-lg px-3 py-1.5 text-sm font-medium text-white"
        @click="print"
      >
        Print
      </button>
    </div>
    <iframe
      ref="iframeRef"
      :src="src"
      :srcdoc="src ? undefined : html"
      :style="{ height }"
      class="w-full bg-white"
      title="Print preview"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface PrintPreviewProps {
  src?: string
  html?: string
  height?: string
}

withDefaults(defineProps<PrintPreviewProps>(), {
  src: undefined,
  html: undefined,
  height: '600px',
})

const iframeRef = ref<HTMLIFrameElement | null>(null)

function print() {
  const win = iframeRef.value?.contentWindow
  if (!win) return
  win.focus()
  win.print()
}

defineExpose({ print })
</script>
