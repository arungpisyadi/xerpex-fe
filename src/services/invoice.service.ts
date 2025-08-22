import apiClient from './api.service';
import type {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceListResponse,
  InvoiceFilters,
  InvoiceActionResponse,
  SendInvoiceRequest
} from '../types/invoice.types';

class InvoiceService {
  /**
   * Get all invoices with optional pagination and filters
   * @param params - Query parameters
   * @returns Promise with invoices data
   */
  async getInvoices(params: InvoiceFilters = {}): Promise<InvoiceListResponse> {
    try {
      // Remove user_id from params as backend handles role-based filtering automatically
      const { user_id, ...cleanParams } = params as any;
      const response = await apiClient.get('/invoices', { params: cleanParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get invoice by ID
   * @param id - Invoice ID
   * @returns Promise with invoice data
   */
  async getInvoice(id: number): Promise<Invoice> {
    try {
      const response = await apiClient.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new invoice
   * @param data - Invoice data
   * @returns Promise with created invoice
   */
  async createInvoice(data: CreateInvoiceRequest): Promise<Invoice> {
    try {
      const response = await apiClient.post('/invoices', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an invoice
   * @param id - Invoice ID
   * @param data - Invoice data to update
   * @returns Promise with updated invoice
   */
  async updateInvoice(id: number, data: UpdateInvoiceRequest): Promise<Invoice> {
    try {
      const response = await apiClient.put(`/invoices/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete an invoice (draft only)
   * @param id - Invoice ID
   * @returns Promise with deletion result
   */
  async deleteInvoice(id: number): Promise<void> {
    try {
      await apiClient.delete(`/invoices/${id}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send invoice to customer (Draft → Sent)
   * @param id - Invoice ID
   * @param data - Email data (optional)
   * @returns Promise with action result
   */
  async sendInvoice(id: number, data?: SendInvoiceRequest): Promise<InvoiceActionResponse> {
    try {
      const response = await apiClient.post(`/invoices/${id}/send`, data || {});
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark invoice as paid
   * @param id - Invoice ID
   * @param data - Payment details (optional)
   * @returns Promise with updated invoice
   */
  async markAsPaid(id: number, data: any = {}): Promise<Invoice> {
    try {
      const response = await apiClient.post(`/invoices/${id}/mark-paid`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel invoice
   * @param id - Invoice ID
   * @returns Promise with action result
   */
  async cancelInvoice(id: number): Promise<InvoiceActionResponse> {
    try {
      const response = await apiClient.post(`/invoices/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reopen cancelled invoice (Cancelled → Draft)
   * @param id - Invoice ID
   * @returns Promise with action result
   */
  async reopenInvoice(id: number): Promise<InvoiceActionResponse> {
    try {
      const response = await apiClient.post(`/invoices/${id}/reopen`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate PDF for an invoice
   * @param id - Invoice ID
   * @returns Promise with PDF blob
   */
  async generatePdf(id: number): Promise<Blob> {
    try {
      const response = await apiClient.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download invoice PDF
   * @param id - Invoice ID
   * @param filename - Optional filename
   */
  async downloadInvoice(id: number, filename?: string): Promise<void> {
    try {
      const blob = await this.generatePdf(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `invoice-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send invoice by email
   * @param id - Invoice ID
   * @param data - Email data (recipient, subject, message)
   * @returns Promise with sending result
   */
  async sendByEmail(id: number, data: SendInvoiceRequest): Promise<InvoiceActionResponse> {
    return this.sendInvoice(id, data);
  }

  /**
   * Get overdue invoices
   * @param filters - Additional filters
   * @returns Promise with overdue invoices
   */
  async getOverdueInvoices(filters: Omit<InvoiceFilters, 'overdue_only'> = {}): Promise<InvoiceListResponse> {
    return this.getInvoices({ ...filters, overdue_only: true });
  }

  /**
   * Get invoices by status
   * @param status - Invoice status
   * @param filters - Additional filters
   * @returns Promise with filtered invoices
   */
  async getInvoicesByStatus(status: string, filters: Omit<InvoiceFilters, 'status'> = {}): Promise<InvoiceListResponse> {
    return this.getInvoices({ ...filters, status: status as any });
  }

  /**
   * Get invoices by customer
   * @param customerId - Customer ID
   * @param filters - Additional filters
   * @returns Promise with customer invoices
   */
  async getInvoicesByCustomer(customerId: number, filters: Omit<InvoiceFilters, 'customer_id'> = {}): Promise<InvoiceListResponse> {
    return this.getInvoices({ ...filters, customer_id: customerId });
  }

  /**
   * Get invoices by date range
   * @param fromDate - Start date (YYYY-MM-DD)
   * @param toDate - End date (YYYY-MM-DD)
   * @param filters - Additional filters
   * @returns Promise with filtered invoices
   */
  async getInvoicesByDateRange(
    fromDate: string,
    toDate: string,
    filters: Omit<InvoiceFilters, 'from_date' | 'to_date'> = {}
  ): Promise<InvoiceListResponse> {
    return this.getInvoices({ ...filters, from_date: fromDate, to_date: toDate });
  }

  /**
   * Update invoice status (internal method)
   * @param id - Invoice ID
   * @param status - New status
   * @returns Promise with updated invoice
   */
  async updateInvoiceStatus(id: number, status: string): Promise<Invoice> {
    try {
      const response = await apiClient.patch(`/invoices/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new InvoiceService();
