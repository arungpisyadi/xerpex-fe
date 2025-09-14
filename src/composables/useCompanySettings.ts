import { ref, computed } from 'vue';
import settingsService from '../services/settings.service';
import type { CompanySettings, UpdateCompanySettings } from '../types/settings.types';
import { DEFAULT_COMPANY_SETTINGS } from '../types/settings.types';
import { handleError } from '../utils/errorHandler';

/**
 * Vue.js Composition API for Company Settings Management
 * Provides reactive company settings with caching and error handling
 */
export function useCompanySettings() {
  // State
  const settings = ref<CompanySettings>({ ...DEFAULT_COMPANY_SETTINGS });
  const loading = ref(false);
  const error = ref<string | null>(null);
  const isLoaded = ref(false);
  const lastFetch = ref<Date | null>(null);

  // Cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Computed properties
  const isSettingsAvailable = computed(() =>
    isLoaded.value && settings.value.companyName !== DEFAULT_COMPANY_SETTINGS.companyName
  );

  const shouldRefetch = computed(() => {
    if (!isLoaded.value || !lastFetch.value) return true;
    return Date.now() - lastFetch.value.getTime() > CACHE_DURATION;
  });

  // Helper to check if we have valid company data beyond defaults
  const hasValidCompanyData = computed(() => {
    return settings.value.companyName !== DEFAULT_COMPANY_SETTINGS.companyName ||
           settings.value.companyEmail !== DEFAULT_COMPANY_SETTINGS.companyEmail ||
           settings.value.companyPhone !== DEFAULT_COMPANY_SETTINGS.companyPhone ||
           settings.value.companyAddress !== DEFAULT_COMPANY_SETTINGS.companyAddress;
  });

  /**
   * Fetch company settings from API
   * @param forceRefresh - Force refresh even if cached data exists
   */
  const fetchSettings = async (forceRefresh = false): Promise<CompanySettings> => {
    // Use cached data if available and not expired
    if (!forceRefresh && !shouldRefetch.value) {
      return settings.value;
    }

    loading.value = true;
    error.value = null;

    try {
      const data = await settingsService.getGeneralSettings();
      settings.value = data;
      isLoaded.value = true;
      lastFetch.value = new Date();
      return data;
    } catch (err) {
      const errorDetails = handleError(err, 'fetchSettings');
      error.value = errorDetails.message;

      // Keep existing settings or use defaults if first load fails
      if (!isLoaded.value) {
        settings.value = { ...DEFAULT_COMPANY_SETTINGS };
        isLoaded.value = true;
      }

      console.warn('Failed to fetch company settings, using fallback:', errorDetails);
      return settings.value;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update company settings
   * @param updateData - Partial settings data to update
   */
  const updateSettings = async (updateData: UpdateCompanySettings): Promise<CompanySettings> => {
    loading.value = true;
    error.value = null;

    try {
      await settingsService.updateGeneralSettings(updateData);

      // Update local settings with new data
      settings.value = {
        ...settings.value,
        ...updateData
      };

      // Force refresh to get latest data from server
      await fetchSettings(true);

      return settings.value;
    } catch (err) {
      const errorDetails = handleError(err, 'updateSettings');
      error.value = errorDetails.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get settings for invoice display (with fallback)
   * Returns settings suitable for invoice rendering
   * Automatically ensures settings are loaded before returning
   */
  const getInvoiceDisplaySettings = async (): Promise<CompanySettings> => {
    console.log('[useCompanySettings] Getting invoice display settings...');

    // Ensure settings are loaded before returning
    if (!isLoaded.value || shouldRefetch.value) {
      console.log('[useCompanySettings] Settings not loaded or expired, fetching...');
      await fetchSettings();
    }

    const displaySettings = {
      companyName: settings.value.companyName || DEFAULT_COMPANY_SETTINGS.companyName,
      companyAddress: settings.value.companyAddress || DEFAULT_COMPANY_SETTINGS.companyAddress,
      companyPhone: settings.value.companyPhone || DEFAULT_COMPANY_SETTINGS.companyPhone,
      companyEmail: settings.value.companyEmail || DEFAULT_COMPANY_SETTINGS.companyEmail,
      bankName: settings.value.bankName || DEFAULT_COMPANY_SETTINGS.bankName,
      bankAccountHolderName: settings.value.bankAccountHolderName || DEFAULT_COMPANY_SETTINGS.bankAccountHolderName,
      bankAccountNumber: settings.value.bankAccountNumber || DEFAULT_COMPANY_SETTINGS.bankAccountNumber,
      bankSwiftNumber: settings.value.bankSwiftNumber || DEFAULT_COMPANY_SETTINGS.bankSwiftNumber,
    };

    console.log('[useCompanySettings] Returning display settings:', displaySettings);
    return displaySettings;
  };

  /**
   * Get settings for invoice display (synchronous with fallback)
   * Returns currently loaded settings or defaults if not loaded yet
   * Use this when you can't await async loading
   */
  const getInvoiceDisplaySettingsSync = (): CompanySettings => {
    console.log('[useCompanySettings] Getting invoice display settings (sync)...');

    const displaySettings = {
      companyName: settings.value.companyName || DEFAULT_COMPANY_SETTINGS.companyName,
      companyAddress: settings.value.companyAddress || DEFAULT_COMPANY_SETTINGS.companyAddress,
      companyPhone: settings.value.companyPhone || DEFAULT_COMPANY_SETTINGS.companyPhone,
      companyEmail: settings.value.companyEmail || DEFAULT_COMPANY_SETTINGS.companyEmail,
      bankName: settings.value.bankName || DEFAULT_COMPANY_SETTINGS.bankName,
      bankAccountHolderName: settings.value.bankAccountHolderName || DEFAULT_COMPANY_SETTINGS.bankAccountHolderName,
      bankAccountNumber: settings.value.bankAccountNumber || DEFAULT_COMPANY_SETTINGS.bankAccountNumber,
      bankSwiftNumber: settings.value.bankSwiftNumber || DEFAULT_COMPANY_SETTINGS.bankSwiftNumber,
    };

    console.log('[useCompanySettings] Returning display settings (sync):', displaySettings);
    return displaySettings;
  };

  /**
   * Initialize settings (fetch if not already loaded)
   */
  const initializeSettings = async (): Promise<void> => {
    if (!isLoaded.value) {
      await fetchSettings();
    }
  };

  /**
   * Clear cached settings (force next fetch to get fresh data)
   */
  const clearCache = (): void => {
    isLoaded.value = false;
    lastFetch.value = null;
    error.value = null;
  };

  /**
   * Reset settings to defaults (useful for testing or fallback)
   */
  const resetToDefaults = (): void => {
    settings.value = { ...DEFAULT_COMPANY_SETTINGS };
    isLoaded.value = true;
    lastFetch.value = null;
    error.value = null;
  };

  return {
    // State
    settings,
    loading,
    error,
    isLoaded,
    lastFetch,

    // Computed
    isSettingsAvailable,
    shouldRefetch,
    hasValidCompanyData,

    // Methods
    fetchSettings,
    updateSettings,
    getInvoiceDisplaySettings,
    getInvoiceDisplaySettingsSync,
    initializeSettings,
    clearCache,
    resetToDefaults
  };
}

// Create a singleton instance for global use
const globalCompanySettings = useCompanySettings();

// Export singleton for components that need shared state
export const useGlobalCompanySettings = () => globalCompanySettings;

// Auto-initialize on module load (optional - can be removed if not desired)
globalCompanySettings.initializeSettings().catch(console.warn);
