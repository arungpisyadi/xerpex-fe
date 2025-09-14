import { ref, computed, watch } from 'vue';
import invoiceService from '../services/invoice.service';
import type { Invoice, InvoiceResponse } from '../types/invoice.types';
import { handleError } from '../utils/errorHandler';

/**
 * Shared Invoice Data Management Service
 * Provides centralized invoice data fetching, caching, and state management
 * Prevents multiple simultaneous API calls and ensures data consistency
 */

// Global state for invoice caching
const invoiceCache = new Map<number, {
  data: Invoice;
  timestamp: Date;
  loading: boolean;
}>();

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export function useInvoiceData() {
  // Local reactive state
  const currentInvoice = ref<Invoice | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Check if cached data is still valid
   * @param timestamp - Cache timestamp
   * @returns boolean indicating if cache is valid
   */
  const isCacheValid = (timestamp: Date): boolean => {
    return Date.now() - timestamp.getTime() < CACHE_DURATION;
  };

  /**
   * Get invoice from cache if available and valid
   * @param invoiceId - Invoice ID
   * @returns Cached invoice data or null
   */
  const getCachedInvoice = (invoiceId: number): Invoice | null => {
    const cached = invoiceCache.get(invoiceId);
    if (cached && isCacheValid(cached.timestamp) && !cached.loading) {
      return cached.data;
    }
    return null;
  };

  /**
   * Set invoice in cache
   * @param invoiceId - Invoice ID
   * @param invoice - Invoice data
   */
  const setCachedInvoice = (invoiceId: number, invoice: Invoice): void => {
    invoiceCache.set(invoiceId, {
      data: invoice,
      timestamp: new Date(),
      loading: false
    });
  };

  /**
   * Mark invoice as loading in cache
   * @param invoiceId - Invoice ID
   */
  const setInvoiceLoading = (invoiceId: number): void => {
    const existing = invoiceCache.get(invoiceId);
    invoiceCache.set(invoiceId, {
      data: existing?.data || {} as Invoice,
      timestamp: existing?.timestamp || new Date(),
      loading: true
    });
  };

  /**
   * Remove invoice from cache
   * @param invoiceId - Invoice ID
   */
  const clearInvoiceCache = (invoiceId: number): void => {
    invoiceCache.delete(invoiceId);
  };

  /**
   * Clear all cached invoices
   */
  const clearAllCache = (): void => {
    invoiceCache.clear();
  };

  /**
   * Fetch invoice data with caching and loading prevention
   * @param invoiceId - Invoice ID
   * @param forceRefresh - Force refresh even if cached
   * @returns Promise with invoice data
   */
  const fetchInvoice = async (invoiceId: number, forceRefresh = false): Promise<Invoice | null> => {
    if (!invoiceId || isNaN(invoiceId)) {
      error.value = 'Invalid invoice ID provided';
      return null;
    }

    // Check cache first unless force refresh is requested
    if (!forceRefresh) {
      const cached = getCachedInvoice(invoiceId);
      if (cached) {
        console.log(`[useInvoiceData] Using cached data for invoice ${invoiceId}`);
        currentInvoice.value = cached;
        error.value = null;
        return cached;
      }

      // Check if already loading to prevent duplicate requests
      const cachedEntry = invoiceCache.get(invoiceId);
      if (cachedEntry?.loading) {
        console.log(`[useInvoiceData] Invoice ${invoiceId} already loading, waiting...`);

        // Wait for existing request to complete
        return new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            const entry = invoiceCache.get(invoiceId);
            if (entry && !entry.loading) {
              clearInterval(checkInterval);
              currentInvoice.value = entry.data;
              resolve(entry.data);
            }
          }, 100);

          // Timeout after 30 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            resolve(null);
          }, 30000);
        });
      }
    }

    // Mark as loading
    loading.value = true;
    error.value = null;
    setInvoiceLoading(invoiceId);

    try {
      console.log(`[useInvoiceData] Fetching invoice ${invoiceId} from API`);

      const response: InvoiceResponse = await invoiceService.getInvoice(invoiceId);

      console.log(`[useInvoiceData] Raw API response for invoice ${invoiceId}:`, response);

      // Handle flexible response formats - API might return { data: invoice } or invoice directly
      let invoice: Invoice;

      if (response && typeof response === 'object') {
        // If response has a data property, use it
        if ('data' in response && response.data) {
          console.log(`[useInvoiceData] Using response.data format for invoice ${invoiceId}`);
          invoice = response.data as Invoice;
        }
        // If response looks like an invoice directly (has invoice_number)
        else if ('invoice_number' in response) {
          console.log(`[useInvoiceData] Using direct response format for invoice ${invoiceId}`);
          invoice = response as unknown as Invoice;
        }
        // If response is wrapped differently
        else if ('invoice' in response) {
          console.log(`[useInvoiceData] Using response.invoice format for invoice ${invoiceId}`);
          invoice = (response as any).invoice as Invoice;
        }
        else {
          throw new Error('Invoice data not found in API response - unknown response format');
        }
      } else {
        throw new Error('Invalid API response format received');
      }

      console.log(`[useInvoiceData] Processed invoice data for ${invoiceId}:`, invoice);

      // Validate essential invoice data
      if (!invoice || typeof invoice !== 'object') {
        throw new Error('Invalid invoice data received - not an object');
      }

      if (!invoice.invoice_number) {
        throw new Error('Invalid invoice data received - missing invoice number');
      }

      // Cache the successful result
      setCachedInvoice(invoiceId, invoice);
      currentInvoice.value = invoice;

      console.log(`[useInvoiceData] Successfully fetched and cached invoice ${invoiceId}`);
      return invoice;

    } catch (err) {
      const errorDetails = handleError(err, 'fetchInvoice');
      error.value = errorDetails.message;

      // Remove from cache on error
      clearInvoiceCache(invoiceId);

      console.error(`[useInvoiceData] Failed to fetch invoice ${invoiceId}:`, errorDetails);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get invoice data (from cache or fetch)
   * @param invoiceId - Invoice ID
   * @returns Invoice data or null
   */
  const getInvoice = async (invoiceId: number): Promise<Invoice | null> => {
    return await fetchInvoice(invoiceId, false);
  };

  /**
   * Refresh invoice data (force fetch from API)
   * @param invoiceId - Invoice ID
   * @returns Invoice data or null
   */
  const refreshInvoice = async (invoiceId: number): Promise<Invoice | null> => {
    return await fetchInvoice(invoiceId, true);
  };

  /**
   * Update cached invoice data after modifications
   * @param invoiceId - Invoice ID
   * @param updates - Partial invoice updates
   */
  const updateCachedInvoice = (invoiceId: number, updates: Partial<Invoice>): void => {
    const cached = invoiceCache.get(invoiceId);
    if (cached) {
      const updatedInvoice = { ...cached.data, ...updates };
      setCachedInvoice(invoiceId, updatedInvoice);

      // Update current invoice if it matches
      if (currentInvoice.value?.id === invoiceId) {
        currentInvoice.value = updatedInvoice;
      }
    }
  };

  /**
   * Check if invoice is currently being loaded
   * @param invoiceId - Invoice ID
   * @returns boolean indicating loading state
   */
  const isInvoiceLoading = (invoiceId: number): boolean => {
    const cached = invoiceCache.get(invoiceId);
    return cached?.loading || false;
  };

  /**
   * Get cached invoices count for debugging
   */
  const getCacheInfo = () => {
    return {
      totalCached: invoiceCache.size,
      cachedIds: Array.from(invoiceCache.keys()),
      cacheEntries: Array.from(invoiceCache.entries()).map(([id, entry]) => ({
        id,
        timestamp: entry.timestamp,
        loading: entry.loading,
        hasData: !!entry.data
      }))
    };
  };

  // Computed properties
  const hasValidInvoice = computed(() => {
    return currentInvoice.value !== null &&
           typeof currentInvoice.value === 'object' &&
           'invoice_number' in currentInvoice.value;
  });

  const invoiceDisplayData = computed(() => {
    if (!hasValidInvoice.value) return null;

    return {
      ...currentInvoice.value!,
      items: currentInvoice.value!.items || [],
      total: Number(currentInvoice.value!.total || 0),
      tax_total: Number(currentInvoice.value!.tax_total || 0)
    };
  });

  // Cleanup on unmount - clear current invoice but keep cache
  const cleanup = (): void => {
    currentInvoice.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    currentInvoice,
    loading,
    error,

    // Computed
    hasValidInvoice,
    invoiceDisplayData,

    // Methods
    fetchInvoice,
    getInvoice,
    refreshInvoice,
    updateCachedInvoice,
    clearInvoiceCache,
    clearAllCache,
    isInvoiceLoading,
    getCacheInfo,
    cleanup,

    // Cache utilities
    getCachedInvoice,
    isCacheValid
  };
}

/**
 * Global invoice data manager instance
 * Use this for shared state across components
 */
const globalInvoiceDataManager = useInvoiceData();

/**
 * Hook to get the global invoice data manager
 * Use this when you need shared invoice state across multiple components
 */
export const useGlobalInvoiceData = () => globalInvoiceDataManager;
