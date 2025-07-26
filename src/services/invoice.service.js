import apiClient from './api.service';

const invoiceService = {
  /**
   * Get all invoices
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise with invoices data
   */
  getInvoices(params = {}) {
    return apiClient.get('/invoices', { params });
  },

  /**
   * Get invoice by ID
   * @param {string|number} id - Invoice ID
   * @returns {Promise} - Promise with invoice data
   */
  getInvoice(id) {
    return apiClient.get(`/invoices/${id}`);
  },

  /**
   * Create a new invoice
   * @param {Object} data - Invoice data
   * @returns {Promise} - Promise with created invoice
   */
  createInvoice(data) {
    return apiClient.post('/invoices', data);
  },

  /**
   * Update an invoice
   * @param {string|number} id - Invoice ID
   * @param {Object} data - Invoice data to update
   * @returns {Promise} - Promise with updated invoice
   */
  updateInvoice(id, data) {
    return apiClient.put(`/invoices/${id}`, data);
  },

  /**
   * Delete an invoice
   * @param {string|number} id - Invoice ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteInvoice(id) {
    return apiClient.delete(`/invoices/${id}`);
  },

  /**
   * Generate PDF for an invoice
   * @param {string|number} id - Invoice ID
   * @returns {Promise} - Promise with PDF data
   */
  generatePdf(id) {
    return apiClient.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
  },

  /**
   * Send invoice by email
   * @param {string|number} id - Invoice ID
   * @param {Object} data - Email data (recipient, subject, message)
   * @returns {Promise} - Promise with sending result
   */
  sendByEmail(id, data) {
    return apiClient.post(`/invoices/${id}/send`, data);
  },

  /**
   * Mark invoice as paid
   * @param {string|number} id - Invoice ID
   * @param {Object} data - Payment details
   * @returns {Promise} - Promise with updated invoice
   */
  markAsPaid(id, data) {
    return apiClient.post(`/invoices/${id}/mark-paid`, data);
  }
};

export default invoiceService;
