<template>
  <ExtLayout page-title="Ext / Scheduling">
    <ComponentCard title="Calendar" desc="Thin wrapper around @fullcalendar/vue3.">
      <Calendar :events="calendarEvents" @date-select="onDateSelect" @event-click="onEventClick" />
    </ComponentCard>

    <ComponentCard title="DateRangePicker" desc="Range selection built on vue-flatpickr-component.">
      <DateRangePicker v-model="dateRange" :presets="rangePresets" />
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Range: {{ dateRange ? dateRange.join(' → ') : '—' }}
      </p>
    </ComponentCard>

    <ComponentCard title="TimeSlotPicker" desc="Grid of selectable time slots.">
      <TimeSlotPicker v-model="selectedSlot" :slots="timeSlots" :columns="4" />
      <p class="text-sm text-gray-500 dark:text-gray-400">Selected: {{ selectedSlot ?? '—' }}</p>
    </ComponentCard>
  </ExtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentCard from '@dynamia-tools/tailadmin-vue/components/common/ComponentCard.vue'
import Calendar from '@dynamia-tools/tailadmin-vue/components/ext/scheduling/Calendar.vue'
import DateRangePicker from '@dynamia-tools/tailadmin-vue/components/ext/scheduling/DateRangePicker.vue'
import type { DateRangePreset } from '@dynamia-tools/tailadmin-vue/components/ext/scheduling/DateRangePicker.vue'
import TimeSlotPicker from '@dynamia-tools/tailadmin-vue/components/ext/scheduling/TimeSlotPicker.vue'
import type { TimeSlotOption } from '@dynamia-tools/tailadmin-vue/components/ext/scheduling/TimeSlotPicker.vue'
import ExtLayout from './ExtLayout.vue'

const today = new Date().toISOString().split('T')[0]
const calendarEvents = [{ id: '1', title: 'Team sync', start: today }]
function onDateSelect(info: unknown) {
  console.log('date-select', info)
}
function onEventClick(info: unknown) {
  console.log('event-click', info)
}

const dateRange = ref<[string, string] | null>(null)
const now = new Date()
const in7Days = new Date(now.getTime() + 7 * 86400000)
const rangePresets: DateRangePreset[] = [{ label: 'Next 7 days', range: [now, in7Days] }]

const timeSlots: TimeSlotOption[] = [
  { value: '09:00', label: '09:00' },
  { value: '09:30', label: '09:30', available: false },
  { value: '10:00', label: '10:00' },
  { value: '10:30', label: '10:30' },
]
const selectedSlot = ref<string | null>(null)
</script>
