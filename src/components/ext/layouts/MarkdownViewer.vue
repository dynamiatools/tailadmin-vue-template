<template>
  <div
    class="max-w-none text-gray-600 dark:text-gray-300 [&_a]:text-brand-500 [&_a]:underline [&_blockquote]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:text-gray-500 [&_blockquote]:dark:border-gray-700 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_code]:dark:bg-white/10 [&_h1]:mb-4 [&_h1]:text-title-sm [&_h1]:font-bold [&_h1]:text-gray-800 [&_h1]:dark:text-white/90 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-800 [&_h2]:dark:text-white/90 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:dark:text-white/90 [&_img]:rounded-lg [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_p]:leading-relaxed [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre]:text-white [&_table]:mb-4 [&_table]:w-full [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-1.5 [&_td]:dark:border-gray-800 [&_th]:border [&_th]:border-gray-200 [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-left [&_th]:dark:border-gray-800 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
  >
    <p v-if="error" class="text-error-600 dark:text-error-500 text-sm">{{ error }}</p>
    <div v-else v-html="html"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface MarkdownViewerProps {
  source: string
  breaks?: boolean
  gfm?: boolean
}

const props = withDefaults(defineProps<MarkdownViewerProps>(), {
  breaks: false,
  gfm: true,
})

const html = ref('')
const error = ref<string | null>(null)

async function render() {
  error.value = null
  try {
    const [{ marked }, { default: DOMPurify }] = await Promise.all([import('marked'), import('dompurify')])
    const rawHtml = await marked.parse(props.source, { breaks: props.breaks, gfm: props.gfm })
    html.value = DOMPurify.sanitize(rawHtml)
  } catch (err) {
    error.value =
      err instanceof Error && err.message.includes('Cannot find')
        ? 'MarkdownViewer requires the optional "marked" and "dompurify" peer dependencies to be installed.'
        : err instanceof Error
          ? err.message
          : 'Unable to render markdown'
  }
}

watch(() => [props.source, props.breaks, props.gfm], render, { immediate: true })
</script>
