<template>
  <div class="pdf-view-container">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading invoice...</p>
    </div>
    <div v-else-if="error" class="error-container">
      <h3>Error Loading Invoice</h3>
      <p>{{ error }}</p>
    </div>
    <div v-else class="pdf-content-wrapper">
      <div v-html="htmlContent" class="invoice-pdf-content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import invoiceService from '../../services/invoice.service'
import type { Invoice } from '../../types/invoice.types'
import { useInvoiceTemplate } from '../../composables/useInvoiceTemplate'
import { useGlobalCompanySettings } from '../../composables/useCompanySettings'

// Disable Vue DevTools for this component
if (typeof window !== 'undefined') {
  const devtools = (window as Window & { __VUE_DEVTOOLS_GLOBAL_HOOK__?: { enabled: boolean } })
    .__VUE_DEVTOOLS_GLOBAL_HOOK__
  if (devtools) {
    devtools.enabled = false
  }
}

const route = useRoute()

const { generatePrintHTML, validateInvoiceData } = useInvoiceTemplate()
const { getInvoiceDisplaySettings } = useGlobalCompanySettings()

const currentInvoice = ref<Invoice | null>(null)
const htmlContent = ref<string>('')
const loading = ref(true)
const error = ref<string>('')

const loadInvoiceData = async (invoiceId: number) => {
  try {
    loading.value = true
    error.value = ''

    // Load invoice data
    const response = await invoiceService.getInvoice(invoiceId)

    if (!response) {
      throw new Error('Invoice not found')
    }

    // Handle flexible response formats - API might return { data: invoice } or invoice directly
    let invoice: Invoice

    if (response && typeof response === 'object') {
      // If response has a data property, use it
      if ('data' in response && response.data) {
        invoice = response.data as Invoice
      }
      // If response looks like an invoice directly (has invoice_number)
      else if ('invoice_number' in response) {
        invoice = response as unknown as Invoice
      }
      // If response is wrapped differently
      else if ('invoice' in response) {
        invoice = (response as { invoice: Invoice }).invoice
      } else {
        throw new Error('Invoice data not found in API response - unknown response format')
      }
    } else {
      throw new Error('Invalid API response format received')
    }

    // Validate invoice data
    if (!validateInvoiceData(invoice)) {
      throw new Error('Invoice data validation failed')
    }

    currentInvoice.value = invoice

    // Load company settings
    const companySettings = await getInvoiceDisplaySettings()

    // Generate print HTML
    htmlContent.value = generatePrintHTML(invoice, companySettings)
  } catch (err: unknown) {
    console.error('[InvoicePdfView] Failed to load invoice:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load invoice'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const invoiceId = route.params.id as string

  if (!invoiceId || isNaN(Number(invoiceId))) {
    error.value = 'Invalid invoice ID'
    loading.value = false
    return
  }

  await loadInvoiceData(Number(invoiceId))
})
</script>

<style scoped>
.pdf-view-container {
  background-color: #f5f5f5;
  padding: 20px 0;
}

.pdf-content-wrapper {
  max-width: 70%;
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-container p {
  font-size: 16px;
  color: #666;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px;
  text-align: center;
}

.error-container h3 {
  color: #dc3545;
  margin-bottom: 15px;
  font-size: 20px;
}

.error-container p {
  color: #721c24;
  font-size: 14px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media print {
  .pdf-view-container {
    background-color: white;
    padding: 0;
  }

  .pdf-content-wrapper {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
}
</style>
