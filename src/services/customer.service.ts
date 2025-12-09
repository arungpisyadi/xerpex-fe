import apiClient from './api.service'
import type {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerListResponse,
  CustomerFilters,
} from '../types/customer.types'

class CustomerService {
  /**
   * Get all customers with optional pagination and filters
   * @param params - Query parameters
   * @returns Promise with customers data
   */
  async getCustomers(params: CustomerFilters = {}): Promise<CustomerListResponse> {
    try {
      // Remove user_id from params as backend handles role-based filtering automatically
      const { user_id, ...cleanParams } = params as any
      const response = await apiClient.get('/customers', { params: cleanParams })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get customer by ID
   * @param id - Customer ID
   * @returns Promise with customer data
   */
  async getCustomerById(id: number): Promise<Customer> {
    try {
      const response = await apiClient.get(`/customers/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Create a new customer
   * @param customerData - Customer data
   * @returns Promise with created customer
   */
  async createCustomer(customerData: CreateCustomerRequest): Promise<Customer> {
    try {
      const response = await apiClient.post('/customers', customerData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Update customer
   * @param id - Customer ID
   * @param customerData - Updated customer data
   * @returns Promise with updated customer
   */
  async updateCustomer(id: number, customerData: UpdateCustomerRequest): Promise<Customer> {
    try {
      const response = await apiClient.put(`/customers/${id}`, customerData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Delete customer
   * @param id - Customer ID
   * @returns Promise with deletion result
   */
  async deleteCustomer(id: number): Promise<void> {
    try {
      await apiClient.delete(`/customers/${id}`)
    } catch (error) {
      throw error
    }
  }

  /**
   * Activate customer
   * @param id - Customer ID
   * @returns Promise with updated customer
   */
  async activateCustomer(id: number): Promise<Customer> {
    try {
      const response = await apiClient.post(`/customers/${id}/activate`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Deactivate customer
   * @param id - Customer ID
   * @returns Promise with updated customer
   */
  async deactivateCustomer(id: number): Promise<Customer> {
    try {
      const response = await apiClient.post(`/customers/${id}/deactivate`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new CustomerService()
