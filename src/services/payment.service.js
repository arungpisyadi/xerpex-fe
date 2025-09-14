import apiClient from './api.service';

class PaymentService {
  /**
   * Get all payments with optional pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} - Response from API
   */
  async getPayments(params = {}) {
    try {
      const response = await apiClient.get('/payments', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payment by ID
   * @param {string} id - Payment ID
   * @returns {Promise} - Response from API
   */
  async getPaymentById(id) {
    try {
      const response = await apiClient.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payment details
   * @param {string} id - Payment ID
   * @returns {Promise} - Response from API
   */
  async getPaymentDetails(id) {
    try {
      const response = await apiClient.get(`/payments/${id}/details`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise} - Response from API
   */
  async createPayment(paymentData) {
    try {
      const response = await apiClient.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update payment
   * @param {string} id - Payment ID
   * @param {Object} paymentData - Updated payment data
   * @returns {Promise} - Response from API
   */
  async updatePayment(id, paymentData) {
    try {
      const response = await apiClient.put(`/payments/${id}`, paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete payment
   * @param {string} id - Payment ID
   * @returns {Promise} - Response from API
   */
  async deletePayment(id) {
    try {
      const response = await apiClient.delete(`/payments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update payment status
   * @param {string} id - Payment ID
   * @param {Object} statusData - Status data
   * @returns {Promise} - Response from API
   */
  async updatePaymentStatus(id, statusData) {
    try {
      const response = await apiClient.patch(`/payments/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Link payment to invoice
   * @param {string} paymentId - Payment ID
   * @param {string} invoiceId - Invoice ID
   * @returns {Promise} - Response from API
   */
  async linkPaymentToInvoice(paymentId, invoiceId) {
    try {
      const response = await apiClient.post(`/payments/${paymentId}/link-invoice/${invoiceId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get booking payment summary
   * @param {string} bookingId - Booking ID
   * @returns {Promise} - Response from API
   */
  async getBookingPaymentSummary(bookingId) {
    try {
      const response = await apiClient.get(`/payments/bookings/${bookingId}/summary`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Invoice methods removed - use invoice.service.ts instead
  // These duplicate methods were causing conflicts with the main invoice service
}

export default new PaymentService();
