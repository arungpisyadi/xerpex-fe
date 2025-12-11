<template>
  <div
    class="booking-card border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    :class="statusBorderClass"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-3">
        <span class="text-lg font-semibold text-gray-800 dark:text-white">
          {{ booking.booking_code || booking.booking_number }}
        </span>
        <span :class="statusClasses" class="px-2.5 py-1 rounded-md text-xs font-medium">
          {{ formatStatus(booking.status) }}
        </span>
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-400">
        {{ formatDateRange(booking.check_in, booking.check_out) }}
      </div>
    </div>

    <div class="mb-3">
      <div class="flex items-center gap-2 text-sm mb-1">
        <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
        </svg>
        <span class="font-medium text-gray-700 dark:text-gray-300">
          {{ booking.customer?.name || booking.customer_name || 'N/A' }}
        </span>
      </div>
      <div class="flex items-center gap-2 text-sm mb-1">
        <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
        </svg>
        <span class="text-gray-600 dark:text-gray-400">
          {{ booking.customer?.email || booking.customer_email || 'N/A' }}
        </span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
        </svg>
        <span class="text-gray-600 dark:text-gray-400">
          {{ booking.customer?.phone_number || booking.customer_phone || 'N/A' }}
        </span>
      </div>
    </div>

    <div v-if="booking.villas && booking.villas.length > 0" class="mb-3">
      <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Villas:</div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="villa in booking.villas"
          :key="villa.id"
          class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
        >
          {{ villa.villa?.name || villa.villa_name || 'Villa #' + villa.villa_id }} - {{ villa.villa?.capacity || villa.num_guests }} guests
        </span>
      </div>
    </div>

    <div v-if="booking.packages && booking.packages.length > 0" class="mb-3">
      <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Packages:</div>
      <div class="space-y-1">
        <div
          v-for="item in booking.packages"
          :key="item.id"
          class="text-xs text-gray-600 dark:text-gray-400"
        >
          {{ item.package_name }} ({{ item.pax }} pax)
        </div>
      </div>
    </div>

    <div class="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
        <span class="font-medium text-gray-700 dark:text-gray-300">
          {{ formatCurrency(booking.total || booking.total_amount || 0) }}
        </span>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">Amount Paid</span>
        <span class="font-medium text-green-600 dark:text-green-400">
          {{ formatCurrency(booking.amount_paid || 0) }}
        </span>
      </div>
      <div class="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Due</span>
        <span class="text-lg font-bold text-brand-500 dark:text-brand-400">
          {{ formatCurrency(booking.amount_due || booking.total_amount || booking.total || 0) }}
        </span>
      </div>
    </div>

    <!-- View Details Button -->
    <div class="mt-4 pt-4 border-t border-stroke dark:border-strokedark">
      <button
        @click="viewDetails"
        class="w-full py-2.5 px-4 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        View Booking Details
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Booking } from '@/types/booking.types'
import { formatCurrency, formatStatus, formatDateRange } from '@/utils/calendar-helpers'

const props = defineProps<{
  booking: Booking
  compact?: boolean
  showActions?: boolean
}>()

const router = useRouter()

const viewDetails = () => {
  router.push(`/bookings/${props.booking.id}`)
}

const statusClasses = computed(() => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    checked_in: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    checked_out: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[props.booking.status] || classes.pending
})

const statusBorderClass = computed(() => {
  const classes = {
    pending: 'border-l-4 border-l-yellow-500',
    confirmed: 'border-l-4 border-l-blue-500',
    checked_in: 'border-l-4 border-l-green-500',
    checked_out: 'border-l-4 border-l-purple-500',
    completed: 'border-l-4 border-l-gray-500',
    cancelled: 'border-l-4 border-l-red-500'
  }
  return classes[props.booking.status] || classes.pending
})
</script>
