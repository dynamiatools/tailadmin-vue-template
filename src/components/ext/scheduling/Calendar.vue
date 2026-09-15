<template>
  <div
    class="calendar-ext overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <FullCalendar ref="calendarRef" :options="calendarOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/vue3/daygrid'
import interactionPlugin from '@fullcalendar/vue3/interaction'
import timeGridPlugin from '@fullcalendar/vue3/timegrid'
import themePlugin from '@fullcalendar/vue3/themes/classic'

import '@fullcalendar/vue3/skeleton.css'
import '@fullcalendar/vue3/themes/classic/palette.css'
import '@fullcalendar/vue3/themes/classic/theme.css'

export interface CalendarEvent {
  id?: string
  title: string
  start: string | Date
  end?: string | Date
  allDay?: boolean
  [key: string]: unknown
}

interface CalendarProps {
  events?: CalendarEvent[]
  initialView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'
  selectable?: boolean
  editable?: boolean
  height?: string | number
}

const props = withDefaults(defineProps<CalendarProps>(), {
  events: () => [],
  initialView: 'dayGridMonth',
  selectable: true,
  editable: false,
  height: 'auto',
})

const emit = defineEmits<{
  'date-select': [info: unknown]
  'event-click': [info: unknown]
}>()

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)

const calendarOptions = computed(() => ({
  plugins: [themePlugin, dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: props.initialView,
  height: props.height,
  selectable: props.selectable,
  editable: props.editable,
  events: props.events,
  headerToolbar: {
    start: 'prev,next today',
    center: 'title',
    end: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  select: (info: unknown) => emit('date-select', info),
  eventClick: (info: unknown) => emit('event-click', info),
}))

defineExpose({ calendarRef })
</script>
