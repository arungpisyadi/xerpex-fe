import apiClient from './api.service';
import type {
  CompanySettings,
  CompanySettingsResponse,
  CompanySettingsApiResponse,
  UpdateCompanySettings,
  UpdateCompanySettingsRequest
} from '../types/settings.types';
import { DEFAULT_COMPANY_SETTINGS } from '../types/settings.types';

class SettingsService {
  /**
   * Get general company settings from API
   * @returns Promise with transformed company settings
   */
  async getGeneralSettings(): Promise<CompanySettings> {
    try {
      const response = await apiClient.get('/settings/general');
      const data: CompanySettingsResponse = response.data;

      // Transform snake_case to camelCase for frontend
      const transformedData: CompanySettings = {
        id: data.id,
        companyName: data.company_name || DEFAULT_COMPANY_SETTINGS.companyName,
        companyEmail: data.company_email || DEFAULT_COMPANY_SETTINGS.companyEmail,
        companyPhone: data.company_phone || DEFAULT_COMPANY_SETTINGS.companyPhone,
        companyAddress: data.company_address || DEFAULT_COMPANY_SETTINGS.companyAddress,
        bankName: data.bank_name || DEFAULT_COMPANY_SETTINGS.bankName,
        bankAccountHolderName: data.bank_account_holder_name || DEFAULT_COMPANY_SETTINGS.bankAccountHolderName,
        bankAccountNumber: data.bank_account_number || DEFAULT_COMPANY_SETTINGS.bankAccountNumber,
        bankSwiftNumber: data.bank_swift_number || DEFAULT_COMPANY_SETTINGS.bankSwiftNumber,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      return transformedData;
    } catch (error) {
      console.error('Error in getGeneralSettings:', error);
      // Return default settings if API fails
      return { ...DEFAULT_COMPANY_SETTINGS };
    }
  }

  /**
   * Update general company settings
   * @param settingsData - Updated settings data in camelCase
   * @returns Promise with API response
   */
  async updateGeneralSettings(settingsData: UpdateCompanySettings): Promise<CompanySettingsApiResponse> {
    try {
      // Transform camelCase to snake_case for API
      const apiData: UpdateCompanySettingsRequest = {
        company_name: settingsData.companyName,
        company_email: settingsData.companyEmail,
        company_phone: settingsData.companyPhone,
        company_address: settingsData.companyAddress,
        bank_name: settingsData.bankName,
        bank_account_holder_name: settingsData.bankAccountHolderName,
        bank_account_number: settingsData.bankAccountNumber,
        bank_swift_number: settingsData.bankSwiftNumber
      };

      const response = await apiClient.put('/settings/general', apiData);
      return response.data;
    } catch (error) {
      console.error('Error in updateGeneralSettings:', error);
      throw error;
    }
  }

  /**
   * Create general company settings
   * @param settingsData - Settings data in camelCase
   * @returns Promise with API response
   */
  async createGeneralSettings(settingsData: UpdateCompanySettings): Promise<CompanySettingsApiResponse> {
    try {
      // Transform camelCase to snake_case for API
      const apiData: UpdateCompanySettingsRequest = {
        company_name: settingsData.companyName,
        company_email: settingsData.companyEmail,
        company_phone: settingsData.companyPhone,
        company_address: settingsData.companyAddress,
        bank_name: settingsData.bankName,
        bank_account_holder_name: settingsData.bankAccountHolderName,
        bank_account_number: settingsData.bankAccountNumber,
        bank_swift_number: settingsData.bankSwiftNumber
      };

      const response = await apiClient.post('/settings/general', apiData);
      return response.data;
    } catch (error) {
      console.error('Error in createGeneralSettings:', error);
      throw error;
    }
  }

  /**
   * Get fallback settings when API is unavailable
   * @returns Default company settings
   */
  getFallbackSettings(): CompanySettings {
    return { ...DEFAULT_COMPANY_SETTINGS };
  }
}

export default new SettingsService();
