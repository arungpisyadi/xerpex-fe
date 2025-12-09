import apiClient from './api.service'
import type {
  Tax,
  CreateTaxRequest,
  UpdateTaxRequest,
  TaxListResponse,
  TaxFilters,
  TaxCalculationRequest,
  TaxCalculationResponse,
} from '../types/tax.types'

class TaxService {
  /**
   * Get all taxes with optional pagination and filters
   * @param params - Query parameters
   * @returns Promise with taxes data
   */
  async getTaxes(params: TaxFilters = {}): Promise<TaxListResponse> {
    try {
      const response = await apiClient.get('/taxes', { params })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get tax by ID
   * @param id - Tax ID
   * @returns Promise with tax data
   */
  async getTaxById(id: number): Promise<Tax> {
    try {
      const response = await apiClient.get(`/taxes/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Create a new tax
   * @param taxData - Tax data
   * @returns Promise with created tax
   */
  async createTax(taxData: CreateTaxRequest): Promise<Tax> {
    try {
      const response = await apiClient.post('/taxes', taxData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Update tax
   * @param id - Tax ID
   * @param taxData - Updated tax data
   * @returns Promise with updated tax
   */
  async updateTax(id: number, taxData: UpdateTaxRequest): Promise<Tax> {
    try {
      const response = await apiClient.put(`/taxes/${id}`, taxData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Delete tax
   * @param id - Tax ID
   * @returns Promise with deletion result
   */
  async deleteTax(id: number): Promise<void> {
    try {
      await apiClient.delete(`/taxes/${id}`)
    } catch (error) {
      throw error
    }
  }

  /**
   * Calculate taxes for given amount and tax IDs
   * @param calculationData - Calculation request data
   * @returns Promise with tax calculation result
   */
  async calculateTaxes(calculationData: TaxCalculationRequest): Promise<TaxCalculationResponse> {
    try {
      const response = await apiClient.post('/taxes/calculate', calculationData)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new TaxService()
