<template>
  <div class="inline-flex flex-col items-center gap-2">
    <canvas ref="canvasRef"></canvas>
    <p v-if="error" class="text-error-600 dark:text-error-500 text-xs">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import QRCode from 'qrcode'

interface QrCodeProps {
  value: string
  size?: number
  margin?: number
  color?: string
  backgroundColor?: string
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

const props = withDefaults(defineProps<QrCodeProps>(), {
  size: 200,
  margin: 2,
  color: '#000000',
  backgroundColor: '#ffffff',
  errorCorrectionLevel: 'M',
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const error = ref<string | null>(null)

async function render() {
  if (!canvasRef.value) return
  error.value = null
  try {
    await QRCode.toCanvas(canvasRef.value, props.value, {
      width: props.size,
      margin: props.margin,
      errorCorrectionLevel: props.errorCorrectionLevel,
      color: { dark: props.color, light: props.backgroundColor },
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to generate QR code'
  }
}

onMounted(render)
watch(() => [props.value, props.size, props.margin, props.color, props.backgroundColor, props.errorCorrectionLevel], render)
</script>
