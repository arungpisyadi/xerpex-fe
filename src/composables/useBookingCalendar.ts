import { ref, computed } from 'vue'
import bookingService from '@/services/booking.service'
import type { Booking, BookingFilters } from '@/types/booking.types'
import type { CalendarEvent } from '@/types/calendar.types'
import { getStatusColor } from '@/utils/calendar-helpers'

export function useBookingCalendar(filters?: BookingFilters) {
  const bookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBookings = async (customFilters?: BookingFilters) => {
    loading.value = true
    error.value = null

    try {
      const params = {
        ...filters,
        ...customFilters,
        limit: 1000
      }

      const response = await bookingService.getBookings(params)
      bookings.value = response.bookings || []
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch bookings'
      console.error('Error fetching bookings for calendar:', err)
    } finally {
      loading.value = false
    }
  }

  const transformBookingsToEvents = (bookingList: Booking[]): CalendarEvent[] => {
    const events: CalendarEvent[] = []

    bookingList.forEach(booking => {
      // Get the proper booking identifier
      const title = booking.booking_code || `Booking #${booking.id}`
      const checkIn = new Date(booking.check_in)
      const checkOut = new Date(booking.check_out)

      // Generate all dates from check-in to check-out (inclusive)
      const currentDate = new Date(checkIn)
      while (currentDate <= checkOut) {
        const dateStr = currentDate.toISOString().split('T')[0]

        events.push({
          id: `${booking.id}-${dateStr}`,
          title: title,
          start: dateStr,
          allDay: true,
          backgroundColor: getStatusColor(booking.status),
          borderColor: getStatusColor(booking.status),
          textColor: '#ffffff',
          extendedProps: {
            booking: booking,
            status: booking.status,
            customerName: booking.customer_name,
            totalAmount: booking.total_amount?.toString()
          }
        })

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1)
      }
    })

    return events
  }

  const getBookingsByDate = (dateStr: string): Booking[] => {
    const targetDate = new Date(dateStr)

    return bookings.value.filter(booking => {
      const checkIn = new Date(booking.check_in)
      const checkOut = new Date(booking.check_out)

      return targetDate >= checkIn && targetDate <= checkOut
    })
  }

  const getBookingsInRange = (startDate: string, endDate: string): Booking[] => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    return bookings.value.filter(booking => {
      const checkIn = new Date(booking.check_in)
      const checkOut = new Date(booking.check_out)

      return checkIn <= end && checkOut >= start
    })
  }

  const getStatistics = computed(() => {
    const total = bookings.value.length
    const byStatus = bookings.value.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      byStatus,
      totalRevenue: bookings.value.reduce((sum, b) => sum + parseFloat(b.total_amount?.toString() || '0'), 0)
    }
  })

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    transformBookingsToEvents,
    getBookingsByDate,
    getBookingsInRange,
    statistics: getStatistics
  }
}
