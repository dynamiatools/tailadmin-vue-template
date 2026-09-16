<template>
  <ExtLayout page-title="Ext / Display">
    <ComponentCard title="Summary" desc="Labeled metric block with an optional trend badge.">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Summary label="Customers" value="3,782" :icon="UserGroupIcon" :trend="{ direction: 'up', value: '11.01%' }" />
        <Summary label="Orders" value="5,359" :icon="BoxIcon" :trend="{ direction: 'down', value: '9.05%' }" />
        <Summary label="Revenue" value="$45,231" description="Last 30 days" />
      </div>
    </ComponentCard>

    <ComponentCard title="Status" desc="Semantic status pill.">
      <div class="flex flex-wrap gap-3">
        <Status label="Active" color="success" />
        <Status label="Failed" color="error" />
        <Status label="Pending" color="warning" />
        <Status label="Draft" color="neutral" />
        <Status label="Info" color="info" :show-dot="false" :icon="InfoCircleIcon" />
      </div>
    </ComponentCard>

    <ComponentCard title="Timeline" desc="Chronological event list.">
      <Timeline :items="timelineItems" />
    </ComponentCard>

    <ComponentCard title="PdfViewer" desc="Native browser PDF preview with page/zoom controls.">
      <PdfViewer src="/files/sample.pdf" height="360px" />
    </ComponentCard>

    <ComponentCard title="QrCode" desc="Generates a QR code from configurable content.">
      <QrCode value="https://github.com/dynamiatools/tailadmin-vue-template" :size="160" />
    </ComponentCard>

    <ComponentCard title="Map" desc="Interactive OpenStreetMap map via Leaflet — no API key required.">
      <Map :center="mapCenter" :zoom="12" :markers="mapMarkers" selectable height="320px" @map-click="onMapClick" />
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Last clicked: {{ lastMapClick ?? '—' }}
      </p>
    </ComponentCard>
  </ExtLayout>
</template>

<script setup lang="ts">
import ComponentCard from '@dynamia-tools/tailadmin-vue/components/common/ComponentCard.vue'
import Summary from '@dynamia-tools/tailadmin-vue/components/ext/display/Summary.vue'
import Status from '@dynamia-tools/tailadmin-vue/components/ext/display/Status.vue'
import Timeline from '@dynamia-tools/tailadmin-vue/components/ext/display/Timeline.vue'
import type { TimelineItem } from '@dynamia-tools/tailadmin-vue/components/ext/display/Timeline.vue'
import PdfViewer from '@dynamia-tools/tailadmin-vue/components/ext/display/PdfViewer.vue'
import QrCode from '@dynamia-tools/tailadmin-vue/components/ext/display/QrCode.vue'
import Map from '@dynamia-tools/tailadmin-vue/components/ext/display/Map.vue'
import type { MapMarker } from '@dynamia-tools/tailadmin-vue/components/ext/display/Map.vue'
import { UserGroupIcon, BoxIcon, InfoCircleIcon } from '@dynamia-tools/tailadmin-vue/icons'
import { ref } from 'vue'
import ExtLayout from './ExtLayout.vue'

const timelineItems: TimelineItem[] = [
  { id: 1, title: 'Order placed', description: 'Order #1024 was created.', timestamp: '09:00', color: 'info' },
  { id: 2, title: 'Payment confirmed', timestamp: '09:05', color: 'success' },
  { id: 3, title: 'Shipment delayed', description: 'Carrier reported a delay.', timestamp: '14:20', color: 'warning' },
]

const mapCenter: [number, number] = [40.4168, -3.7038]
const mapMarkers: MapMarker[] = [
  { lat: 40.4168, lng: -3.7038, popup: 'Madrid HQ' },
  { lat: 40.42, lng: -3.71, popup: 'Warehouse' },
]
const lastMapClick = ref<string | null>(null)
function onMapClick(location: { lat: number; lng: number }) {
  lastMapClick.value = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
}
</script>
