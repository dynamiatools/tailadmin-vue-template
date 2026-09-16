<template>
  <div
    v-if="visible"
    class="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
  >
    <button
      type="button"
      class="bg-brand-500 hover:bg-brand-600 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
      :aria-label="playing ? 'Pause' : 'Play'"
      @click="toggle"
    >
      <svg v-if="!playing" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M2 1.5v11l10-5.5z" />
      </svg>
      <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M3 2h3v10H3zM8 2h3v10H8z" />
      </svg>
    </button>

    <input
      type="range"
      min="0"
      :max="duration || 0"
      step="0.1"
      :value="currentTime"
      class="flex-1 accent-brand-500"
      @input="onSeek"
    />

    <span class="w-20 shrink-0 text-right text-xs text-gray-500 tabular-nums dark:text-gray-400">
      {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
    </span>

    <input
      type="range"
      min="0"
      max="1"
      step="0.05"
      :value="volume"
      class="accent-brand-500 w-16"
      aria-label="Volume"
      @input="onVolumeChange"
    />
  </div>

  <audio
    ref="audioRef"
    :src="src"
    :loop="loop"
    hidden
    @play="onPlay"
    @pause="onPause"
    @ended="onEnded"
    @timeupdate="onTimeUpdate"
    @loadedmetadata="onLoadedMetadata"
    @error="onError"
  ></audio>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

interface SoundPlayerProps {
  src: string
  visible?: boolean
  autoplay?: boolean
  loop?: boolean
  volume?: number
}

const props = withDefaults(defineProps<SoundPlayerProps>(), {
  visible: true,
  autoplay: false,
  loop: false,
  volume: 1,
})

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  error: [message: string]
  timeupdate: [seconds: number]
}>()

const audioRef = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(props.volume)

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function play() {
  void audioRef.value?.play()
}

function pause() {
  audioRef.value?.pause()
}

function stop() {
  const audio = audioRef.value
  if (!audio) return
  audio.pause()
  audio.currentTime = 0
}

function toggle() {
  if (playing.value) pause()
  else play()
}

function onSeek(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  if (audioRef.value) audioRef.value.currentTime = value
}

function onVolumeChange(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  volume.value = value
  if (audioRef.value) audioRef.value.volume = value
}

function onPlay() {
  playing.value = true
  emit('play')
}

function onPause() {
  playing.value = false
  emit('pause')
}

function onEnded() {
  playing.value = false
  emit('ended')
}

function onTimeUpdate() {
  currentTime.value = audioRef.value?.currentTime ?? 0
  emit('timeupdate', currentTime.value)
}

function onLoadedMetadata() {
  duration.value = audioRef.value?.duration ?? 0
}

function onError() {
  emit('error', 'Unable to load audio source')
}

watch(
  () => props.src,
  () => {
    currentTime.value = 0
    duration.value = 0
  },
)

onMounted(() => {
  if (audioRef.value) audioRef.value.volume = volume.value
  if (props.autoplay) play()
})

defineExpose({ play, pause, stop })
</script>
