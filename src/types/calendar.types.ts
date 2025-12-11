import type { Booking, BookingFilters } from './booking.types'

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  allDay: boolean
  backgroundColor: string
  borderColor: string
  textColor: string
  extendedProps: {
    booking: Booking
    status: string
    customerName?: string
    totalAmount?: string
  }
}

export interface CalendarView {
  type: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'
  start: Date
  end: Date
  title: string
}

export interface CalendarFilters {
  status?: string
  dateRange?: {
    start: string
    end: string
  }
  villaId?: number
  customerId?: number
}

export interface BookingCalendarProps {
  initialView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'
  showToolbar?: boolean
  clickable?: boolean
  height?: string | number
  autoFetch?: boolean
  bookings?: Booking[]
  filters?: BookingFilters
  customClass?: string
  fullWidth?: boolean
}

export interface BookingCalendarEvents {
  'booking-clicked': (booking: Booking) => void
  'date-clicked': (date: string, bookings: Booking[]) => void
  'view-changed': (view: string) => void
  'date-range-changed': (start: string, end: string) => void
  'error': (error: Error) => void
}

export interface BookingDetailsModalProps {
  bookings: Booking[]
  date: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
