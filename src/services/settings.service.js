import apiClient from './api.service';

class SettingsService {
  /**
   * Get general settings
   * @returns {Promise} - Response from API
   */
  async getGeneralSettings() {
    try {
      const response = await apiClient.get('/settings/general');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update general settings
   * @param {Object} settingsData - Updated settings data
   * @returns {Promise} - Response from API
   */
  async updateGeneralSettings(settingsData) {
    try {
      const response = await apiClient.put('/settings/general', settingsData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create general settings
   * @param {Object} settingsData - Settings data
   * @returns {Promise} - Response from API
   */
  async createGeneralSettings(settingsData) {
    try {
      const response = await apiClient.post('/settings/general', settingsData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new SettingsService();
