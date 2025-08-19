import apiClient from './api.service';

class SettingsService {
  /**
   * Get general settings
   * @returns {Promise} - Response from API
   */
  async getGeneralSettings() {
    try {
      const response = await apiClient.get('/settings/general');
      const data = response.data;

      // Transform snake_case to camelCase for frontend
      return {
        companyName: data.company_name || '',
        companyEmail: data.company_email || '',
        companyPhone: data.company_phone || '',
        companyAddress: data.company_address || '',
        currency: data.currency || 'USD',
        timezone: data.timezone || 'UTC',
        bankName: data.bank_name || '',
        bankAccountHolderName: data.bank_account_holder_name || '',
        bankAccountNumber: data.bank_account_number || '',
        bankSwiftNumber: data.bank_swift_number || ''
      };
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
      // Transform camelCase to snake_case for API
      const apiData = {
        company_name: settingsData.companyName,
        company_email: settingsData.companyEmail,
        company_phone: settingsData.companyPhone,
        company_address: settingsData.companyAddress,
        currency: settingsData.currency,
        timezone: settingsData.timezone,
        bank_name: settingsData.bankName,
        bank_account_holder_name: settingsData.bankAccountHolderName,
        bank_account_number: settingsData.bankAccountNumber,
        bank_swift_number: settingsData.bankSwiftNumber
      };

      const response = await apiClient.put('/settings/general', apiData);
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
