<template>
  <div class="inline-block">
    <canvas
      ref="canvasRef"
      :width="width"
      :height="height"
      class="touch-none rounded-lg border border-gray-300 bg-white dark:border-gray-700"
      @pointerdown="startStroke"
      @pointermove="draw"
      @pointerup="endStroke"
      @pointerleave="endStroke"
    ></canvas>

    <div class="mt-2 flex gap-2">
      <button
        type="button"
        :disabled="strokes.length === 0"
        class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400"
        @click="undo"
      >
        Undo
      </button>
      <button
        type="button"
        :disabled="strokes.length === 0"
        class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400"
        @click="clear"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Point {
  x: number
  y: number
}

interface SignaturePadProps {
  width?: number
  height?: number
  penColor?: string
  penWidth?: number
  backgroundColor?: string
}

const props = withDefaults(defineProps<SignaturePadProps>(), {
  width: 400,
  height: 200,
  penColor: '#1f2937',
  penWidth: 2,
  backgroundColor: '#ffffff',
})

const emit = defineEmits<{
  'update:modelValue': [dataUrl: string]
  change: [dataUrl: string]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const strokes = ref<Point[][]>([])
let ctx: CanvasRenderingContext2D | null = null
let currentStroke: Point[] = []
let drawing = false

function paintBackground() {
  if (!ctx || !canvasRef.value) return
  ctx.fillStyle = props.backgroundColor
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}

function redraw() {
  if (!ctx || !canvasRef.value) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  paintBackground()
  ctx.strokeStyle = props.penColor
  ctx.lineWidth = props.penWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (const stroke of strokes.value) {
    ctx.beginPath()
    stroke.forEach((point, i) => {
      if (i === 0) ctx!.moveTo(point.x, point.y)
      else ctx!.lineTo(point.x, point.y)
    })
    ctx.stroke()
  }
}

function pointFromEvent(event: PointerEvent): Point {
  const rect = canvasRef.value!.getBoundingClientRect()
  return { x: event.clientX - rect.left, y: event.clientY - rect.top }
}

function startStroke(event: PointerEvent) {
  drawing = true
  currentStroke = [pointFromEvent(event)]
}

function draw(event: PointerEvent) {
  if (!drawing) return
  currentStroke.push(pointFromEvent(event))
  redraw()
  if (!ctx) return
  ctx.strokeStyle = props.penColor
  ctx.lineWidth = props.penWidth
  ctx.beginPath()
  currentStroke.forEach((point, i) => {
    if (i === 0) ctx!.moveTo(point.x, point.y)
    else ctx!.lineTo(point.x, point.y)
  })
  ctx.stroke()
}

function endStroke() {
  if (!drawing) return
  drawing = false
  if (currentStroke.length > 1) {
    strokes.value.push(currentStroke)
    emitChange()
  }
  currentStroke = []
}

function undo() {
  strokes.value.pop()
  redraw()
  emitChange()
}

function clear() {
  strokes.value = []
  redraw()
  emitChange()
}

function emitChange() {
  const dataUrl = canvasRef.value?.toDataURL('image/png') ?? ''
  emit('update:modelValue', dataUrl)
  emit('change', dataUrl)
}

function exportDataUrl(): string {
  return canvasRef.value?.toDataURL('image/png') ?? ''
}

onMounted(() => {
  ctx = canvasRef.value?.getContext('2d') ?? null
  paintBackground()
})

defineExpose({ undo, clear, exportDataUrl })
</script>
