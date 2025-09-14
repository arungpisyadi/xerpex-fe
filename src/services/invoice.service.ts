import apiClient, { pdfApiClient } from './api.service';
import type {
  Invoice,
  InvoiceResponse,
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
  async getInvoice(id: number): Promise<InvoiceResponse> {
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
  async createInvoice(data: CreateInvoiceRequest): Promise<InvoiceResponse> {
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
  async updateInvoice(id: number, data: UpdateInvoiceRequest): Promise<InvoiceResponse> {
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
  async markAsPaid(id: number, data: any = {}): Promise<InvoiceResponse> {
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
   * Generate PDF using client-side html2pdf.js
   * @param id - Invoice ID
   * @param filename - Optional filename
   * @returns Promise with generated PDF blob
   */
  async generateClientSidePdf(id: number, filename?: string): Promise<Blob> {
    try {
      console.log(`[DEBUG] Starting client-side PDF generation for invoice ${id}`);

      // Dynamic import to avoid bundle bloat
      const html2pdf = await import('html2pdf.js');

      // Get invoice data
      const response = await apiClient.get(`/invoices/${id}`);
      const invoiceData = response.data?.data || response.data?.invoice || response.data;

      if (!invoiceData) {
        throw new Error('Invoice data not found for client-side generation');
      }

      // Import and use the composables properly
      const { useInvoiceTemplate } = await import('../composables/useInvoiceTemplate');
      const { useGlobalCompanySettings } = await import('../composables/useCompanySettings');

      // Get the composable functions
      const { generatePrintHTML } = useInvoiceTemplate();
      const { getInvoiceDisplaySettings } = useGlobalCompanySettings();

      // Get company settings
      let companySettings;
      try {
        companySettings = await getInvoiceDisplaySettings();
      } catch (settingsError) {
        console.warn('[DEBUG] Could not load company settings, using defaults:', settingsError);
        companySettings = {
          companyName: 'Company Name Not Set',
          companyAddress: 'Address Not Set',
          companyPhone: 'Phone Not Set',
          companyEmail: 'Email Not Set',
          bankName: 'Bank Name Not Set',
          bankAccountNumber: 'Account Number Not Set',
          bankAccountHolderName: 'Account Holder Name Not Set'
        };
      }

      // Generate HTML content
      const htmlContent = generatePrintHTML(invoiceData, companySettings);

      // Create temporary container
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = htmlContent;
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);

      // Configure html2pdf options
      const options = {
        margin: 0.5,
        filename: filename || `invoice-${invoiceData.invoice_number || id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'portrait'
        }
      };

      console.log('[DEBUG] Generating PDF with options:', options);

      // Generate PDF and get blob
      const pdfBlob = await html2pdf.default()
        .set(options)
        .from(tempContainer)
        .outputPdf('blob');

      // Clean up
      document.body.removeChild(tempContainer);

      console.log('[DEBUG] Client-side PDF generation completed:', {
        size: pdfBlob.size,
        type: pdfBlob.type
      });

      return pdfBlob;

    } catch (error) {
      console.error('[DEBUG] Client-side PDF generation failed:', error);
      throw new Error(`Client-side PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Download invoice PDF using client-side html2pdf.js generation
   * @param id - Invoice ID
   * @param filename - Optional filename
   */
  async downloadInvoice(id: number, filename?: string): Promise<void> {
    try {
      console.log(`[DEBUG] Starting client-side PDF download for invoice ${id}`);

      // Generate PDF using client-side html2pdf.js
      const clientBlob = await this.generateClientSidePdf(id, filename);

      console.log('[DEBUG] Client-side PDF blob generated:', {
        size: clientBlob.size,
        type: clientBlob.type
      });

      // Create download link
      const url = window.URL.createObjectURL(clientBlob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = filename || `invoice-${id}.pdf`;
      link.setAttribute('download', filename || `invoice-${id}.pdf`);

      console.log('[DEBUG] Created download link:', {
        download: link.download,
        href: url.substring(0, 50) + '...'
      });

      // Add to DOM, trigger download, then clean up
      document.body.appendChild(link);

      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: false
      });

      link.dispatchEvent(clickEvent);
      console.log('[DEBUG] PDF download initiated');

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('[DEBUG] PDF download cleanup completed');
      }, 100);

      console.log('[DEBUG] ✅ Client-side PDF download successful');

    } catch (error) {
      console.error('[DEBUG] Client-side PDF download failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`PDF download failed: ${errorMessage}`);
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
  async updateInvoiceStatus(id: number, status: string): Promise<InvoiceResponse> {
    try {
      const response = await apiClient.patch(`/invoices/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update invoice notes
   * @param id - Invoice ID
   * @param notes - Notes to update
   * @returns Promise with updated invoice
   */
  async updateInvoiceNotes(id: number, notes: string): Promise<InvoiceResponse> {
    try {
      const response = await apiClient.patch(`/invoices/${id}/notes`, { notes });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get invoice history/activity log
   * @param id - Invoice ID
   * @returns Promise with invoice history data
   */
  async getInvoiceHistory(id: number): Promise<{ items: any[] }> {
    try {
      const response = await apiClient.get(`/invoices/${id}/history`);
      return response.data;
    } catch (error) {
      // If endpoint doesn't exist, return empty history
      console.warn('Invoice history endpoint not available:', error);
      return { items: [] };
    }
  }
}

export default new InvoiceService();
