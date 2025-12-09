import apiClient from './api.service'
import type {
  Booking,
  BookingVilla,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingListResponse,
  BookingFilters,
  BookingActionResponse,
  BookingStatus,
  ExportToInvoiceRequest,
  ExportToInvoiceResponse,
} from '../types/booking.types'

class BookingService {
  /**
   * Get all bookings with optional pagination and filters
   * @param params - Query parameters
   * @returns Promise with bookings data
   */
  async getBookings(params: BookingFilters = {}): Promise<BookingListResponse> {
    try {
      const response = await apiClient.get('/bookings', { params })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get booking by ID
   * @param id - Booking ID
   * @returns Promise with booking data
   */
  async getBookingById(id: number): Promise<Booking> {
    try {
      const response = await apiClient.get(`/bookings/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Create a new booking
   * @param bookingData - Booking data
   * @returns Promise with created booking
   */
  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    try {
      const response = await apiClient.post('/bookings', bookingData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Update booking
   * @param id - Booking ID
   * @param bookingData - Updated booking data
   * @returns Promise with updated booking
   */
  async updateBooking(id: number, bookingData: UpdateBookingRequest): Promise<Booking> {
    try {
      const response = await apiClient.put(`/bookings/${id}`, bookingData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Delete booking
   * @param id - Booking ID
   * @returns Promise with deletion result
   */
  async deleteBooking(id: number): Promise<void> {
    try {
      await apiClient.delete(`/bookings/${id}`)
    } catch (error) {
      throw error
    }
  }

  /**
   * Confirm booking (Pending → Confirmed)
   * @param id - Booking ID
   * @returns Promise with action result
   */
  async confirmBooking(id: number): Promise<BookingActionResponse> {
    try {
      const response = await apiClient.post(`/bookings/${id}/confirm`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Cancel booking
   * @param id - Booking ID
   * @param reason - Optional cancellation reason
   * @returns Promise with action result
   */
  async cancelBooking(id: number, reason?: string): Promise<BookingActionResponse> {
    try {
      const response = await apiClient.post(`/bookings/${id}/cancel`, { reason })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Check in booking (Confirmed → Checked In)
   * @param id - Booking ID
   * @returns Promise with action result
   */
  async checkInBooking(id: number): Promise<BookingActionResponse> {
    try {
      const response = await apiClient.post(`/bookings/${id}/check-in`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Check out booking (Checked In → Checked Out)
   * @param id - Booking ID
   * @returns Promise with action result
   */
  async checkOutBooking(id: number): Promise<BookingActionResponse> {
    try {
      const response = await apiClient.post(`/bookings/${id}/check-out`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Complete booking (Checked Out → Completed)
   * @param id - Booking ID
   * @returns Promise with action result
   */
  async completeBooking(id: number): Promise<BookingActionResponse> {
    try {
      const response = await apiClient.post(`/bookings/${id}/complete`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Update booking status directly
   * @param id - Booking ID
   * @param status - New status
   * @returns Promise with updated booking
   */
  async updateBookingStatus(id: number, status: BookingStatus): Promise<Booking> {
    try {
      const response = await apiClient.patch(`/bookings/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Export booking to invoice
   * @param id - Booking ID
   * @param exportData - Export parameters
   * @returns Promise with created invoice details
   */
  async exportToInvoice(
    id: number,
    exportData: ExportToInvoiceRequest,
  ): Promise<ExportToInvoiceResponse> {
    try {
      const response = await apiClient.post(`/bookings/${id}/export-to-invoice`, exportData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Update booking notes
   * @param id - Booking ID
   * @param notes - Notes content
   * @returns Promise with updated booking
   */
  async updateBookingNotes(id: number, notes: string): Promise<Booking> {
    try {
      const response = await apiClient.patch(`/bookings/${id}/notes`, { notes })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Calculate booking totals (client-side helper)
   * @param villas - Array of booking villas
   * @param taxRate - Tax rate (default: 0)
   * @returns Object with calculated totals
   */
  calculateBookingTotals(
    villas: BookingVilla[],
    taxRate: number = 0,
  ): {
    subtotal: number
    tax_amount: number
    total_amount: number
  } {
    const subtotal = villas.reduce((sum, villa) => sum + villa.line_total, 0)
    const tax_amount = subtotal * taxRate
    const total_amount = subtotal + tax_amount

    return {
      subtotal,
      tax_amount,
      total_amount,
    }
  }
}

export default new BookingService()
