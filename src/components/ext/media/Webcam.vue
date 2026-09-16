<template>
  <div class="w-full max-w-md">
    <div
      class="dark:bg-gray-900 relative aspect-video w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-100 dark:border-gray-700"
    >
      <video ref="videoRef" class="h-full w-full object-cover" autoplay playsinline muted></video>
      <div
        v-if="!active && !error"
        class="absolute inset-0 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500"
      >
        Camera is off
      </div>
      <div v-if="error" class="text-error-600 dark:text-error-500 absolute inset-0 flex items-center justify-center px-4 text-center text-sm">
        {{ error }}
      </div>
    </div>

    <div class="mt-3 flex flex-wrap items-center gap-2">
      <select
        v-if="devices.length > 1"
        v-model="selectedDeviceId"
        class="dark:bg-gray-900 h-9 rounded-lg border border-gray-300 bg-transparent px-2 text-sm text-gray-800 dark:border-gray-700 dark:text-white/90"
        @change="active && restart()"
      >
        <option v-for="device in devices" :key="device.deviceId" :value="device.deviceId">
          {{ device.label || 'Camera' }}
        </option>
      </select>

      <button
        v-if="!active"
        type="button"
        class="bg-brand-500 hover:bg-brand-600 rounded-lg px-3 py-1.5 text-sm font-medium text-white"
        @click="start"
      >
        Start
      </button>
      <button
        v-else
        type="button"
        class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-400"
        @click="stop"
      >
        Stop
      </button>
      <button
        type="button"
        :disabled="!active"
        class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400"
        @click="capture"
      >
        Capture
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface WebcamProps {
  facingMode?: 'user' | 'environment'
  autoStart?: boolean
}

const props = withDefaults(defineProps<WebcamProps>(), {
  facingMode: 'user',
  autoStart: false,
})

const emit = defineEmits<{
  capture: [dataUrl: string]
  started: []
  stopped: []
  error: [error: string]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const active = ref(false)
const error = ref<string | null>(null)
const devices = ref<MediaDeviceInfo[]>([])
const selectedDeviceId = ref<string>('')
let stream: MediaStream | null = null

async function listDevices() {
  try {
    devices.value = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === 'videoinput')
  } catch {
    devices.value = []
  }
}

async function start() {
  error.value = null
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: selectedDeviceId.value
        ? { deviceId: { exact: selectedDeviceId.value } }
        : { facingMode: props.facingMode },
    })
    if (videoRef.value) videoRef.value.srcObject = stream
    active.value = true
    emit('started')
    await listDevices()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to access camera'
    emit('error', error.value)
  }
}

function stop() {
  stream?.getTracks().forEach((track) => track.stop())
  stream = null
  if (videoRef.value) videoRef.value.srcObject = null
  active.value = false
  emit('stopped')
}

async function restart() {
  stop()
  await start()
}

function capture() {
  if (!videoRef.value || !active.value) return
  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)
  emit('capture', canvas.toDataURL('image/png'))
}

onMounted(() => {
  void listDevices()
  if (props.autoStart) void start()
})

onBeforeUnmount(stop)

defineExpose({ start, stop, capture })
</script>
