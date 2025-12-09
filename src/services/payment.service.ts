import apiClient from './api.service'
import type {
  Payment,
  CreatePaymentRequest,
  UpdatePaymentRequest,
  PaymentListResponse,
  PaymentFilters,
  PaymentActionResponse,
  PaymentSummary,
} from '../types/payment.types'

class PaymentService {
  /**
   * Get all payments with optional pagination and filters
   * @param params - Query parameters
   * @returns Promise with payments data
   */
  async getPayments(params: PaymentFilters = {}): Promise<PaymentListResponse> {
    try {
      // Remove user_id from params as backend handles role-based filtering automatically
      const { user_id, ...cleanParams } = params as any
      const response = await apiClient.get('/payments', { params: cleanParams })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get payment by ID
   * @param id - Payment ID
   * @returns Promise with payment data
   */
  async getPaymentById(id: number): Promise<Payment> {
    try {
      const response = await apiClient.get(`/payments/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get payment details
   * @param id - Payment ID
   * @returns Promise with detailed payment data
   */
  async getPaymentDetails(id: number): Promise<Payment> {
    try {
      const response = await apiClient.get(`/payments/${id}/details`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Create a new payment
   * @param paymentData - Payment data
   * @returns Promise with created payment
   */
  async createPayment(paymentData: CreatePaymentRequest): Promise<Payment> {
    try {
      const response = await apiClient.post('/payments', paymentData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Update payment
   * @param id - Payment ID
   * @param paymentData - Updated payment data
   * @returns Promise with updated payment
   */
  async updatePayment(id: number, paymentData: UpdatePaymentRequest): Promise<Payment> {
    try {
      const response = await apiClient.put(`/payments/${id}`, paymentData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Delete payment
   * @param id - Payment ID
   * @returns Promise with deletion result
   */
  async deletePayment(id: number): Promise<void> {
    try {
      await apiClient.delete(`/payments/${id}`)
    } catch (error) {
      throw error
    }
  }

  /**
   * Confirm payment (Pending → Completed)
   * @param id - Payment ID
   * @returns Promise with action result
   */
  async confirmPayment(id: number): Promise<PaymentActionResponse> {
    try {
      const response = await apiClient.post(`/payments/${id}/confirm`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Mark payment as failed (→ Failed)
   * @param id - Payment ID
   * @returns Promise with action result
   */
  async failPayment(id: number): Promise<PaymentActionResponse> {
    try {
      const response = await apiClient.post(`/payments/${id}/fail`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Refund payment (→ Refunded)
   * @param id - Payment ID
   * @param refundData - Refund details
   * @returns Promise with action result
   */
  async refundPayment(id: number, refundData: any = {}): Promise<PaymentActionResponse> {
    try {
      const response = await apiClient.post(`/payments/${id}/refund`, refundData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Update payment status
   * @param id - Payment ID
   * @param status - New status
   * @returns Promise with updated payment
   */
  async updatePaymentStatus(id: number, status: string): Promise<Payment> {
    try {
      const response = await apiClient.patch(`/payments/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Link payment to invoice
   * @param paymentId - Payment ID
   * @param invoiceId - Invoice ID
   * @returns Promise with linking result
   */
  async linkPaymentToInvoice(paymentId: number, invoiceId: number): Promise<PaymentActionResponse> {
    try {
      const response = await apiClient.post(`/payments/${paymentId}/link-invoice/${invoiceId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get payment summary for an invoice
   * @param invoiceId - Invoice ID
   * @returns Promise with payment summary
   */
  async getInvoicePaymentSummary(invoiceId: number): Promise<PaymentSummary> {
    try {
      const response = await apiClient.get(`/payments/invoices/${invoiceId}/summary`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get payments by invoice
   * @param invoiceId - Invoice ID
   * @param filters - Additional filters
   * @returns Promise with invoice payments
   */
  async getPaymentsByInvoice(
    invoiceId: number,
    filters: Omit<PaymentFilters, 'invoice_id'> = {},
  ): Promise<PaymentListResponse> {
    return this.getPayments({ ...filters, invoice_id: invoiceId })
  }

  /**
   * Get payments by status
   * @param status - Payment status
   * @param filters - Additional filters
   * @returns Promise with filtered payments
   */
  async getPaymentsByStatus(
    status: string,
    filters: Omit<PaymentFilters, 'status'> = {},
  ): Promise<PaymentListResponse> {
    return this.getPayments({ ...filters, status: status as any })
  }

  /**
   * Get payments by method
   * @param method - Payment method
   * @param filters - Additional filters
   * @returns Promise with filtered payments
   */
  async getPaymentsByMethod(
    method: string,
    filters: Omit<PaymentFilters, 'payment_method'> = {},
  ): Promise<PaymentListResponse> {
    return this.getPayments({ ...filters, payment_method: method as any })
  }

  /**
   * Get payments by date range
   * @param fromDate - Start date (YYYY-MM-DD)
   * @param toDate - End date (YYYY-MM-DD)
   * @param filters - Additional filters
   * @returns Promise with filtered payments
   */
  async getPaymentsByDateRange(
    fromDate: string,
    toDate: string,
    filters: Omit<PaymentFilters, 'from_date' | 'to_date'> = {},
  ): Promise<PaymentListResponse> {
    return this.getPayments({ ...filters, from_date: fromDate, to_date: toDate })
  }

  /**
   * Get pending payments
   * @param filters - Additional filters
   * @returns Promise with pending payments
   */
  async getPendingPayments(
    filters: Omit<PaymentFilters, 'status'> = {},
  ): Promise<PaymentListResponse> {
    return this.getPaymentsByStatus('pending', filters)
  }

  /**
   * Get completed payments
   * @param filters - Additional filters
   * @returns Promise with completed payments
   */
  async getCompletedPayments(
    filters: Omit<PaymentFilters, 'status'> = {},
  ): Promise<PaymentListResponse> {
    return this.getPaymentsByStatus('completed', filters)
  }

  /**
   * Get failed payments
   * @param filters - Additional filters
   * @returns Promise with failed payments
   */
  async getFailedPayments(
    filters: Omit<PaymentFilters, 'status'> = {},
  ): Promise<PaymentListResponse> {
    return this.getPaymentsByStatus('failed', filters)
  }

  /**
   * Get refunded payments
   * @param filters - Additional filters
   * @returns Promise with refunded payments
   */
  async getRefundedPayments(
    filters: Omit<PaymentFilters, 'status'> = {},
  ): Promise<PaymentListResponse> {
    return this.getPaymentsByStatus('refunded', filters)
  }

  /**
   * Get payment statistics
   * @param filters - Date range and other filters
   * @returns Promise with payment statistics
   */
  async getPaymentStatistics(filters: PaymentFilters = {}): Promise<PaymentSummary> {
    try {
      const response = await apiClient.get('/payments/statistics', { params: filters })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new PaymentService()
