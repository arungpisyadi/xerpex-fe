import apiClient from './api.service';

class VillaService {
  /**
   * Get all villas with optional pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} - Response from API
   */
  async getVillas(params = {}) {
    try {
      const response = await apiClient.get('/villas', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get villa by ID
   * @param {string} id - Villa ID
   * @returns {Promise} - Response from API
   */
  async getVillaById(id) {
    try {
      const response = await apiClient.get(`/villas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new villa
   * @param {Object} villaData - Villa data
   * @returns {Promise} - Response from API
   */
  async createVilla(villaData) {
    try {
      const response = await apiClient.post('/villas', villaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update villa
   * @param {string} id - Villa ID
   * @param {Object} villaData - Updated villa data
   * @returns {Promise} - Response from API
   */
  async updateVilla(id, villaData) {
    try {
      const response = await apiClient.put(`/villas/${id}`, villaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete villa
   * @param {string} id - Villa ID
   * @returns {Promise} - Response from API
   */
  async deleteVilla(id) {
    try {
      const response = await apiClient.delete(`/villas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create villa availability
   * @param {Object} availabilityData - Availability data
   * @returns {Promise} - Response from API
   */
  async createVillaAvailability(availabilityData) {
    try {
      const response = await apiClient.post('/villas/availability', availabilityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update villa availability for a specific date
   * @param {string} id - Villa ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {Object} availabilityData - Updated availability data
   * @returns {Promise} - Response from API
   */
  async updateVillaAvailability(id, date, availabilityData) {
    try {
      const response = await apiClient.put(`/villas/${id}/availability/${date}`, availabilityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check villa availability
   * @param {Object} checkData - Check availability data
   * @returns {Promise} - Response from API
   */
  async checkAvailability(checkData) {
    try {
      const response = await apiClient.post('/villas/check-availability', checkData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available villas for a specific date range
   * @param {string} checkIn - Check-in date in YYYY-MM-DD format
   * @param {string} checkOut - Check-out date in YYYY-MM-DD format
   * @returns {Promise} - Response from API containing available villas
   */
  async getAvailableVillas(checkIn, checkOut) {
    try {
      const response = await apiClient.get('/villas/available', {
        params: { check_in: checkIn, check_out: checkOut }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new VillaService();
