<template>
  <div>
    <div
      class="dark:bg-gray-900 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition dark:border-gray-700"
      :class="isDragging ? 'border-brand-400 bg-brand-50 dark:bg-brand-500/5' : ''"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <p class="text-sm text-gray-500 dark:text-gray-400">Drag & drop files here, or</p>
      <button
        type="button"
        class="text-brand-500 hover:text-brand-600 text-sm font-medium"
        @click="fileInputRef?.click()"
      >
        Browse files
      </button>
      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        :multiple="multiple"
        :accept="acceptedTypes?.join(',')"
        @change="onFileInputChange"
      />
    </div>

    <ul v-if="items.length" class="mt-3 space-y-2">
      <li
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-3 rounded-lg border border-gray-200 p-2 dark:border-gray-800"
      >
        <slot name="preview" :item="item">
          <img
            v-if="item.previewUrl"
            :src="item.previewUrl"
            class="h-10 w-10 rounded object-cover"
            alt=""
          />
          <div
            v-else
            class="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-500 dark:bg-white/5 dark:text-gray-400"
          >
            {{ extensionOf(item.file.name) }}
          </div>
        </slot>

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm text-gray-700 dark:text-gray-300">{{ item.file.name }}</p>
          <div v-if="item.status === 'uploading'" class="mt-1 h-1.5 w-full rounded-full bg-gray-100 dark:bg-white/10">
            <div class="bg-brand-500 h-1.5 rounded-full" :style="{ width: `${item.progress}%` }"></div>
          </div>
          <p v-else-if="item.status === 'error'" class="text-error-600 dark:text-error-500 text-xs">
            {{ item.error }}
          </p>
          <p v-else-if="item.status === 'success'" class="text-success-600 dark:text-success-500 text-xs">
            Uploaded
          </p>
        </div>

        <button
          v-if="item.status === 'error'"
          type="button"
          class="text-brand-500 hover:text-brand-600 text-xs font-medium"
          @click="retry(item.id)"
        >
          Retry
        </button>
        <button
          type="button"
          class="text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          @click="remove(item.id)"
        >
          Remove
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface DropFileItem {
  id: string
  file: File
  previewUrl: string | null
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error: string | null
}

interface DropFileUploaderProps {
  multiple?: boolean
  maxSizeBytes?: number
  acceptedTypes?: string[]
  autoUpload?: boolean
  uploadHandler?: (file: File, onProgress: (percent: number) => void) => Promise<unknown>
}

const props = withDefaults(defineProps<DropFileUploaderProps>(), {
  multiple: true,
  maxSizeBytes: undefined,
  acceptedTypes: undefined,
  autoUpload: true,
  uploadHandler: undefined,
})

const emit = defineEmits<{
  'update:files': [items: DropFileItem[]]
  uploaded: [item: DropFileItem]
  error: [item: DropFileItem]
}>()

const items = ref<DropFileItem[]>([])
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function extensionOf(name: string): string {
  return name.split('.').pop()?.slice(0, 4).toUpperCase() ?? 'FILE'
}

function validate(file: File): string | null {
  if (props.maxSizeBytes && file.size > props.maxSizeBytes) {
    return `File exceeds ${Math.round(props.maxSizeBytes / 1024)} KB`
  }
  if (props.acceptedTypes && props.acceptedTypes.length > 0) {
    const matches = props.acceptedTypes.some(
      (type) => file.type === type || (type.endsWith('/*') && file.type.startsWith(type.replace('/*', '/'))),
    )
    if (!matches) return 'File type not allowed'
  }
  return null
}

function addFiles(fileList: FileList | File[]) {
  const files = props.multiple ? Array.from(fileList) : Array.from(fileList).slice(0, 1)

  for (const file of files) {
    const error = validate(file)
    const item: DropFileItem = {
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      status: error ? 'error' : 'pending',
      progress: 0,
      error,
    }
    items.value.push(item)
    if (!error && props.autoUpload) void upload(item.id)
  }
  emit('update:files', items.value)
}

async function upload(id: string) {
  const item = items.value.find((i) => i.id === id)
  if (!item || !props.uploadHandler) return

  item.status = 'uploading'
  item.error = null
  item.progress = 0
  try {
    await props.uploadHandler(item.file, (percent) => {
      item.progress = percent
    })
    item.status = 'success'
    item.progress = 100
    emit('uploaded', item)
  } catch (err) {
    item.status = 'error'
    item.error = err instanceof Error ? err.message : 'Upload failed'
    emit('error', item)
  }
}

function retry(id: string) {
  void upload(id)
}

function remove(id: string) {
  const item = items.value.find((i) => i.id === id)
  if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl)
  items.value = items.value.filter((i) => i.id !== id)
  emit('update:files', items.value)
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  if (event.dataTransfer?.files.length) addFiles(event.dataTransfer.files)
}

function onFileInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.length) addFiles(target.files)
  target.value = ''
}

defineExpose({ upload, retry, remove })
</script>
