import apiClient from './api.service';

class ReportService {
  /**
   * Get dashboard summary report
   * @returns {Promise} - Response from API
   */
  async getDashboardSummary() {
    try {
      const response = await apiClient.get('/reports/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get villa occupancy report
   * @param {Object} params - Report parameters
   * @param {string} params.start_date - Start date (YYYY-MM-DD)
   * @param {string} params.end_date - End date (YYYY-MM-DD)
   * @param {Array} params.villa_ids - Optional array of villa IDs to filter
   * @returns {Promise} - Response from API
   */
  async getVillaOccupancyReport(params) {
    try {
      const response = await apiClient.post('/reports/villa-occupancy', params);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get booking status report
   * @param {Object} params - Report parameters
   * @param {string} params.start_date - Start date (YYYY-MM-DD)
   * @param {string} params.end_date - End date (YYYY-MM-DD)
   * @param {Array} params.status - Optional array of booking statuses to filter
   * @returns {Promise} - Response from API
   */
  async getBookingStatusReport(params) {
    try {
      const response = await apiClient.post('/reports/booking-status', params);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get revenue report
   * @param {Object} params - Report parameters
   * @param {string} params.start_date - Start date (YYYY-MM-DD)
   * @param {string} params.end_date - End date (YYYY-MM-DD)
   * @param {string} params.group_by - Group by option (day, week, month, year)
   * @returns {Promise} - Response from API
   */
  async getRevenueReport(params) {
    try {
      const response = await apiClient.post('/reports/revenue', params);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get top villas report
   * @param {Object} params - Query parameters
   * @param {string} params.start_date - Start date (YYYY-MM-DD)
   * @param {string} params.end_date - End date (YYYY-MM-DD)
   * @param {number} params.limit - Number of top villas to return
   * @returns {Promise} - Response from API
   */
  async getTopVillasReport(params = {}) {
    try {
      const response = await apiClient.get('/reports/top-villas', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ReportService();
