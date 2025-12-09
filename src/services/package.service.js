import apiClient from './api.service'

class PackageService {
  /**
   * Get all packages with optional pagination
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip
   * @param {number} params.limit - Maximum number of records to return
   * @param {string} params.category - Filter by category
   * @param {string} params.type - Filter by type
   * @param {number} params.min_cost - Filter by minimum cost per pax
   * @param {number} params.max_cost - Filter by maximum cost per pax
   * @param {string} params.search - Search by name (partial match)
   * @returns {Promise} - Response from API
   */
  async getPackages(params = {}) {
    try {
      const response = await apiClient.get('/packages', { params })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get package by ID
   * @param {string} id - Package ID
   * @returns {Promise} - Response from API
   */
  async getPackageById(id) {
    try {
      const response = await apiClient.get(`/packages/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Create a new package
   * @param {Object} packageData - Package data
   * @param {string} packageData.name - Package name
   * @param {string} packageData.category - Package category
   * @param {string} packageData.type - Package type
   * @param {string} packageData.description - Package description
   * @param {number} packageData.days - Number of days
   * @param {string} packageData.cost_per_pax - Cost per person
   * @param {number} packageData.min_pax - Minimum number of persons
   * @returns {Promise} - Response from API
   */
  async createPackage(packageData) {
    try {
      const response = await apiClient.post('/packages', packageData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Update package
   * @param {string} id - Package ID
   * @param {Object} packageData - Updated package data
   * @returns {Promise} - Response from API
   */
  async updatePackage(id, packageData) {
    try {
      const response = await apiClient.put(`/packages/${id}`, packageData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Delete package
   * @param {string} id - Package ID
   * @returns {Promise} - Response from API
   */
  async deletePackage(id) {
    try {
      const response = await apiClient.delete(`/packages/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get package categories
   * @returns {Promise} - Response from API
   */
  async getCategories() {
    try {
      const response = await apiClient.get('/packages/meta/categories')
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get package types
   * @returns {Promise} - Response from API
   */
  async getTypes() {
    try {
      const response = await apiClient.get('/packages/meta/types')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new PackageService()
