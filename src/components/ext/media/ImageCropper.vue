<template>
  <div class="w-full max-w-md">
    <div
      ref="viewportRef"
      class="relative touch-none overflow-hidden rounded-lg border border-gray-300 bg-gray-100 select-none dark:border-gray-700 dark:bg-gray-900"
      :style="{ width: `${width}px`, height: `${height}px` }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointerleave="onPointerUp"
    >
      <img
        v-if="src"
        ref="imageRef"
        :src="src"
        class="pointer-events-none absolute top-1/2 left-1/2 max-w-none"
        :style="{
          transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
        }"
        @load="onImageLoad"
      />
    </div>

    <div class="mt-3 flex items-center gap-3">
      <label class="text-sm text-gray-500 dark:text-gray-400">Zoom</label>
      <input v-model.number="zoom" type="range" min="0.5" max="3" step="0.05" class="flex-1" />
      <button
        type="button"
        class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-400"
        @click="rotate"
      >
        Rotate
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

interface ImageCropperProps {
  src: string
  width?: number
  height?: number
}

const props = withDefaults(defineProps<ImageCropperProps>(), {
  width: 300,
  height: 300,
})

const emit = defineEmits<{
  export: [dataUrl: string]
}>()

const viewportRef = ref<HTMLDivElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const zoom = ref(1)
const rotation = ref(0)
const offset = reactive({ x: 0, y: 0 })

let dragging = false
let dragStart = { x: 0, y: 0 }
let offsetStart = { x: 0, y: 0 }

function onImageLoad() {
  offset.x = 0
  offset.y = 0
  zoom.value = 1
  rotation.value = 0
}

function rotate() {
  rotation.value = (rotation.value + 90) % 360
}

function onPointerDown(event: PointerEvent) {
  dragging = true
  dragStart = { x: event.clientX, y: event.clientY }
  offsetStart = { ...offset }
  ;(event.target as HTMLElement).setPointerCapture?.(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging) return
  offset.x = offsetStart.x + (event.clientX - dragStart.x)
  offset.y = offsetStart.y + (event.clientY - dragStart.y)
}

function onPointerUp() {
  dragging = false
}

function exportImage(): string | null {
  const img = imageRef.value
  if (!img) return null

  const canvas = document.createElement('canvas')
  canvas.width = props.width
  canvas.height = props.height
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.translate(canvas.width / 2 + offset.x, canvas.height / 2 + offset.y)
  ctx.rotate((rotation.value * Math.PI) / 180)
  ctx.scale(zoom.value, zoom.value)
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)

  const dataUrl = canvas.toDataURL('image/png')
  emit('export', dataUrl)
  return dataUrl
}

defineExpose({ exportImage, rotate })
</script>
