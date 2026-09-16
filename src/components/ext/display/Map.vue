<template>
  <div
    ref="containerRef"
    class="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
    :style="{ height }"
  ></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Vite/webpack can't resolve Leaflet's default marker image imports —
// point them at the package's own CDN-hosted assets instead.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export interface MapMarker {
  lat: number
  lng: number
  label?: string
  popup?: string
}

interface MapProps {
  center?: [number, number]
  zoom?: number
  markers?: MapMarker[]
  height?: string
  selectable?: boolean
}

const props = withDefaults(defineProps<MapProps>(), {
  center: () => [0, 0],
  zoom: 13,
  markers: () => [],
  height: '400px',
  selectable: false,
})

const emit = defineEmits<{
  'map-click': [location: { lat: number; lng: number }]
  'marker-click': [marker: MapMarker]
}>()

const containerRef = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null

function renderMarkers() {
  if (!map || !markerLayer) return
  markerLayer.clearLayers()
  for (const marker of props.markers) {
    const leafletMarker = L.marker([marker.lat, marker.lng])
    if (marker.popup) leafletMarker.bindPopup(marker.popup)
    leafletMarker.on('click', () => emit('marker-click', marker))
    leafletMarker.addTo(markerLayer)
  }
}

onMounted(() => {
  if (!containerRef.value) return

  map = L.map(containerRef.value).setView(props.center, props.zoom)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map)

  markerLayer = L.layerGroup().addTo(map)
  renderMarkers()

  if (props.selectable) {
    map.on('click', (event: L.LeafletMouseEvent) => {
      emit('map-click', { lat: event.latlng.lat, lng: event.latlng.lng })
    })
  }
})

watch(() => props.markers, renderMarkers, { deep: true })
watch(
  () => [props.center, props.zoom],
  () => {
    if (map) map.setView(props.center, props.zoom)
  },
)

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>
