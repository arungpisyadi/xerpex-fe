import apiClient from './api.service'
import type {
  Quote,
  CreateQuoteRequest,
  UpdateQuoteRequest,
  QuoteListResponse,
  QuoteFilters,
  ConvertToInvoiceRequest,
  QuoteActionResponse,
  UpdateQuoteNotesRequest,
  UpdateQuoteNotesResponse,
} from '../types/quote.types'

class QuoteService {
  /**
   * Get all quotes with optional pagination and filters
   * @param params - Query parameters
   * @returns Promise with quotes data
   */
  async getQuotes(params: QuoteFilters = {}): Promise<QuoteListResponse> {
    try {
      // Remove user_id from params as backend handles role-based filtering automatically
      const { user_id, ...cleanParams } = params as any
      const response = await apiClient.get('/quotes', { params: cleanParams })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get quote by ID
   * @param id - Quote ID
   * @returns Promise with quote data
   */
  async getQuoteById(id: number): Promise<Quote> {
    try {
      const response = await apiClient.get(`/quotes/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Create a new quote
   * @param quoteData - Quote data
   * @returns Promise with created quote
   */
  async createQuote(quoteData: CreateQuoteRequest): Promise<Quote> {
    try {
      const response = await apiClient.post('/quotes', quoteData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Update quote
   * @param id - Quote ID
   * @param quoteData - Updated quote data
   * @returns Promise with updated quote
   */
  async updateQuote(id: number, quoteData: UpdateQuoteRequest): Promise<Quote> {
    try {
      const response = await apiClient.put(`/quotes/${id}`, quoteData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Delete quote (draft only)
   * @param id - Quote ID
   * @returns Promise with deletion result
   */
  async deleteQuote(id: number): Promise<void> {
    try {
      await apiClient.delete(`/quotes/${id}`)
    } catch (error) {
      throw error
    }
  }

  /**
   * Send quote to customer (Draft → Sent)
   * @param id - Quote ID
   * @returns Promise with action result
   */
  async sendQuote(id: number): Promise<QuoteActionResponse> {
    try {
      const response = await apiClient.post(`/quotes/${id}/send`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Accept quote (Sent → Accepted)
   * @param id - Quote ID
   * @returns Promise with action result
   */
  async acceptQuote(id: number): Promise<QuoteActionResponse> {
    try {
      const response = await apiClient.post(`/quotes/${id}/accept`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Decline quote (Sent → Declined)
   * @param id - Quote ID
   * @returns Promise with action result
   */
  async declineQuote(id: number): Promise<QuoteActionResponse> {
    try {
      const response = await apiClient.post(`/quotes/${id}/decline`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Reopen quote (Declined/Expired → Draft)
   * @param id - Quote ID
   * @returns Promise with action result
   */
  async reopenQuote(id: number): Promise<QuoteActionResponse> {
    try {
      const response = await apiClient.post(`/quotes/${id}/reopen`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Update quote notes
   * @param id - Quote ID
   * @param notes - Notes content
   * @returns Promise with updated quote
   */
  async updateQuoteNotes(id: number, notes: string): Promise<UpdateQuoteNotesResponse> {
    try {
      const requestData: UpdateQuoteNotesRequest = { notes }
      const response = await apiClient.patch(`/quotes/${id}/notes`, requestData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Convert quote to invoice
   * @param id - Quote ID
   * @param conversionData - Conversion parameters
   * @returns Promise with created invoice
   */
  async convertToInvoice(id: number, conversionData: ConvertToInvoiceRequest): Promise<any> {
    try {
      const response = await apiClient.post(`/quotes/${id}/convert-to-invoice`, conversionData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Generate PDF for quote
   * @param id - Quote ID
   * @returns Promise with PDF blob
   */
  async generatePdf(id: number): Promise<Blob> {
    try {
      const response = await apiClient.get(`/quotes/${id}/pdf`, { responseType: 'blob' })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new QuoteService()
