<template>
  <div
    :class="[
      'booking-calendar-container',
      fullWidth ? 'w-full' : 'max-w-7xl',
      customClass
    ]"
    class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div v-if="loading" class="flex justify-center items-center p-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="p-6 text-center text-red-500">
      {{ error }}
    </div>

    <div v-else class="custom-calendar p-4">
      <FullCalendar
        ref="calendarRef"
        :options="calendarOptions"
        class="min-h-[600px]"
      />
    </div>

    <BookingDetailsModal
      v-if="showDetailsModal"
      :bookings="selectedDateBookings"
      :date="selectedDate"
      @close="closeDetailsModal"
      @booking-selected="handleBookingSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import BookingDetailsModal from './BookingDetailsModal.vue'
import { useBookingCalendar } from '@/composables/useBookingCalendar'
import type { Booking } from '@/types/booking.types'
import type { BookingCalendarProps, BookingCalendarEvents } from '@/types/calendar.types'

const props = withDefaults(defineProps<BookingCalendarProps>(), {
  initialView: 'dayGridMonth',
  showToolbar: true,
  clickable: true,
  height: 'auto',
  autoFetch: true,
  fullWidth: true
})

const emit = defineEmits<{
  'booking-clicked': [booking: Booking]
  'date-clicked': [date: string, bookings: Booking[]]
  'view-changed': [view: string]
  'date-range-changed': [start: string, end: string]
  'error': [error: Error]
}>()

const {
  bookings,
  loading,
  error,
  fetchBookings,
  transformBookingsToEvents,
  getBookingsByDate
} = useBookingCalendar(props.filters)

const calendarRef = ref()
const showDetailsModal = ref(false)
const selectedDate = ref<string>('')
const selectedDateBookings = ref<Booking[]>([])

const calendarEvents = computed(() =>
  transformBookingsToEvents(props.bookings || bookings.value)
)

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: props.initialView,
  headerToolbar: props.showToolbar ? {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  } : undefined,
  events: calendarEvents.value,
  eventClick: handleEventClick,
  dateClick: handleDateClick,
  height: props.height,
  selectable: props.clickable,
  editable: false,
  eventContent: renderEventContent,
  datesSet: handleDatesSet,
  eventDisplay: 'block',
  displayEventTime: false
}))

const handleEventClick = (info: any) => {
  // Extract the date from the event to show bookings for that date
  const eventDate = info.event.startStr
  const dateBookings = getBookingsByDate(eventDate)

  if (dateBookings.length > 0) {
    selectedDate.value = eventDate
    selectedDateBookings.value = dateBookings
    showDetailsModal.value = true
    emit('date-clicked', eventDate, dateBookings)
  }
}

const handleDateClick = (info: any) => {
  const dateBookings = getBookingsByDate(info.dateStr)
  if (dateBookings.length > 0) {
    selectedDate.value = info.dateStr
    selectedDateBookings.value = dateBookings
    showDetailsModal.value = true
    emit('date-clicked', info.dateStr, dateBookings)
  }
}

const handleDatesSet = (dateInfo: any) => {
  emit('date-range-changed', dateInfo.startStr, dateInfo.endStr)
}

const renderEventContent = (eventInfo: any) => {
  return {
    html: `<div class="fc-event-booking p-1 rounded-sm text-xs font-medium truncate">${eventInfo.event.title}</div>`
  }
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedDate.value = ''
  selectedDateBookings.value = []
}

const handleBookingSelected = (booking: Booking) => {
  emit('booking-clicked', booking)
  closeDetailsModal()
}

onMounted(async () => {
  if (props.autoFetch && !props.bookings) {
    await fetchBookings()
  }
})

watch(() => props.bookings, (newBookings) => {
  if (newBookings) {
    bookings.value = newBookings
  }
}, { deep: true })
</script>

<style scoped>
.custom-calendar {
  --fc-border-color: #e5e7eb;
  --fc-today-bg-color: #f3f4f6;
}

.dark .custom-calendar {
  --fc-border-color: #374151;
  --fc-today-bg-color: #1f2937;
}

.fc-event-booking {
  border-radius: 0.25rem;
  padding: 2px 4px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.fc-event:hover) {
  filter: brightness(1.1);
  cursor: pointer;
  transform: scale(1.02);
  transition: all 0.15s ease;
}
</style>
