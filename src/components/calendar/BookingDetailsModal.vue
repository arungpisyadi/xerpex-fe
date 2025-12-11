<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-999999 bg-black/70 flex items-center justify-center p-4"
      @click.self="$emit('close')"
    >
      <div
        :class="['relative w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-8', sizeClasses[size]]"
      >
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-2xl font-semibold text-gray-800 dark:text-white">
              Bookings on {{ formatDate(date) }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ bookings.length }} booking(s) found
            </p>
          </div>

          <button
            @click="$emit('close')"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <BookingCard
            v-for="booking in bookings"
            :key="booking.id"
            :booking="booking"
            @click="$emit('booking-selected', booking)"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import BookingCard from './BookingCard.vue'
import { formatDate } from '@/utils/calendar-helpers'
import type { Booking } from '@/types/booking.types'

interface Props {
  bookings: Booking[]
  date: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

withDefaults(defineProps<Props>(), {
  size: 'lg'
})

defineEmits<{
  'close': []
  'booking-selected': [booking: Booking]
}>()

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl'
}
</script>
