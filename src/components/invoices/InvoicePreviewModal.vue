<template>
  <Modal :fullScreenBackdrop="true" @close="$emit('close')">
    <template #body>
      <div class="modal-content">
        <div class="modal-header">
          <div class="header-left">
            <h2 class="modal-title">Invoice Preview</h2>
          </div>
          <div class="header-right">
            <button
              @click="printInvoice"
              :disabled="loading || !iframeLoaded"
              class="print-button"
              title="Print Invoice"
            >
              🖨️ Print
            </button>
            <button
              @click="downloadPDF"
              :disabled="pdfGenerating"
              class="download-button"
              :class="{ 'loading': pdfGenerating }"
            >
              <span v-if="pdfGenerating">Generating PDF...</span>
              <span v-else>📄 Download PDF</span>
            </button>
            <button @click="$emit('close')" class="close-button">✕</button>
          </div>
        </div>

        <!-- PDF Status -->
        <div v-if="pdfStatus" class="pdf-status" :class="pdfStatusClass">
          {{ pdfStatus }}
        </div>

        <!-- Loading State -->
        <div v-if="loading || loadingDetails.invoice || loadingDetails.settings" class="loading-container">
          <div class="spinner"></div>
          <div class="loading-details">
            <p v-if="loadingDetails.invoice">Loading invoice data...</p>
            <p v-else-if="loadingDetails.settings">Loading company settings...</p>
            <p v-else-if="loadingDetails.template">Generating preview...</p>
            <p v-else>Loading invoice preview...</p>

            <div class="loading-progress">
              <div class="step" :class="{ completed: loadingDetails.invoiceCompleted }">
                <span class="step-icon">{{ loadingDetails.invoiceCompleted ? '✓' : '○' }}</span>
                Invoice Data
              </div>
              <div class="step" :class="{ completed: loadingDetails.settingsCompleted }">
                <span class="step-icon">{{ loadingDetails.settingsCompleted ? '✓' : '○' }}</span>
                Company Settings
              </div>
              <div class="step" :class="{ completed: loadingDetails.templateCompleted }">
                <span class="step-icon">{{ loadingDetails.templateCompleted ? '✓' : '○' }}</span>
                Template Generation
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error || templateError" class="error-container">
          <div class="error-message">
            <h3>Error Loading Preview</h3>
            <div v-if="templateError" class="error-details">
              <p><strong>Template Error:</strong> {{ templateError }}</p>
            </div>
            <div v-if="error" class="error-details">
              <p><strong>Data Error:</strong> {{ error }}</p>
            </div>
            <div class="error-debug" v-if="debugInfo">
              <details>
                <summary>Debug Information</summary>
                <pre>{{ JSON.stringify(debugInfo, null, 2) }}</pre>
              </details>
            </div>
            <div class="error-actions">
              <button @click="retryLoad" class="retry-button">Retry</button>
              <button @click="$emit('close')" class="close-button-secondary">Close</button>
            </div>
          </div>
        </div>

        <!-- Preview Frame -->
        <div v-else-if="currentInvoice" class="iframe-container">
          <iframe
            :src="previewUrl"
            class="pdf-preview-iframe"
            ref="previewFrame"
            @load="onIframeLoad"
            title="Invoice Preview">
          </iframe>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import Modal from '../ui/Modal.vue'
import invoiceService from '../../services/invoice.service.ts'
import type { Invoice } from '../../types/invoice.types'
import { useInvoiceTemplate } from '../../composables/useInvoiceTemplate'
import { useInvoiceData } from '../../composables/useInvoiceData'
import { useGlobalCompanySettings } from '../../composables/useCompanySettings'

interface Props {
  invoiceId: number | null
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

// Centralized services
const { generatePreviewHTML, generatePrintHTML, validateInvoiceData, createPreviewBlobUrl } = useInvoiceTemplate()
const { currentInvoice, loading, error, getInvoice } = useInvoiceData()
const { getInvoiceDisplaySettings, initializeSettings } = useGlobalCompanySettings()

// Local state specific to modal
const previewFrame = ref<HTMLIFrameElement | null>(null)
const previewUrl = ref<string>('')
const iframeLoaded = ref(false)

// Enhanced loading state tracking
const loadingDetails = ref({
  invoice: false,
  settings: false,
  template: false,
  invoiceCompleted: false,
  settingsCompleted: false,
  templateCompleted: false
})

// Enhanced error handling
const templateError = ref<string>('')
const debugInfo = ref<any>(null)

// PDF generation state
const pdfGenerating = ref(false)
const pdfStatus = ref<string>('')

// Computed properties
const pdfStatusClass = computed(() => {
  if (pdfStatus.value.includes('Error') || pdfStatus.value.includes('Failed')) {
    return 'status-error'
  } else if (pdfStatus.value.includes('Success') || pdfStatus.value.includes('Generated')) {
    return 'status-success'
  } else if (pdfStatus.value.includes('Generating') || pdfStatus.value.includes('Processing')) {
    return 'status-loading'
  }
  return 'status-info'
})

// Print functionality for iframe content
const printInvoice = () => {
  if (!currentInvoice.value || !iframeLoaded.value) {
    pdfStatus.value = 'Error: Invoice not loaded yet'
    setTimeout(() => {
      pdfStatus.value = ''
    }, 3000)
    return
  }

  try {
    // Generate HTML content with print-optimized styles
    const htmlContent = generatePrintHTML(currentInvoice.value)

    // Open new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600')

    if (!printWindow) {
      pdfStatus.value = 'Error: Popup blocked. Please allow popups and try again.'
      setTimeout(() => {
        pdfStatus.value = ''
      }, 5000)
      return
    }

    // Write content to new window
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        // Close window after printing (user can cancel if needed)
        printWindow.onafterprint = () => {
          printWindow.close()
        }
        // Fallback: close after delay if onafterprint doesn't work
        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.close()
          }
        }, 1000)
      }, 500)
    }

    pdfStatus.value = 'Opening print dialog...'
    setTimeout(() => {
      pdfStatus.value = ''
    }, 3000)

  } catch (error) {
    console.error('Print failed:', error)
    pdfStatus.value = 'Error: Failed to open print dialog'
    setTimeout(() => {
      pdfStatus.value = ''
    }, 5000)
  }
}


// Methods
const onIframeLoad = () => {
  iframeLoaded.value = true
}

const downloadPDF = async () => {
  if (!currentInvoice.value) {
    pdfStatus.value = 'Error: Invoice data not available'
    return
  }

  try {
    pdfGenerating.value = true
    pdfStatus.value = 'Generating PDF...'

    // Try backend PDF first
    await invoiceService.downloadInvoice(currentInvoice.value.id)
    pdfStatus.value = 'PDF downloaded successfully!'

    setTimeout(() => {
      pdfStatus.value = ''
    }, 3000)

  } catch (error) {
    console.error('PDF download failed:', error)
    pdfStatus.value = 'Error: Failed to download PDF. Please try again.'

    setTimeout(() => {
      pdfStatus.value = ''
    }, 5000)
  } finally {
    pdfGenerating.value = false
  }
}

const loadInvoiceData = async (invoiceId: number) => {
  if (!invoiceId) {
    templateError.value = 'No invoice ID provided'
    return
  }

  console.log('[InvoicePreviewModal] Starting to load invoice data for ID:', invoiceId)

  // Reset all states
  templateError.value = ''
  debugInfo.value = null
  iframeLoaded.value = false

  // Reset loading details
  loadingDetails.value = {
    invoice: true,
    settings: true,
    template: false,
    invoiceCompleted: false,
    settingsCompleted: false,
    templateCompleted: false
  }

  try {
    // Step 1: Load invoice data
    console.log('[InvoicePreviewModal] Step 1: Loading invoice data...')
    const invoice = await getInvoice(invoiceId)

    if (!invoice) {
      throw new Error('Invoice data not found or is incomplete')
    }

    loadingDetails.value.invoice = false
    loadingDetails.value.invoiceCompleted = true
    console.log('[InvoicePreviewModal] Step 1 completed: Invoice data loaded')

    // Step 2: Load company settings
    console.log('[InvoicePreviewModal] Step 2: Loading company settings...')
    const companySettings = await getInvoiceDisplaySettings()

    loadingDetails.value.settings = false
    loadingDetails.value.settingsCompleted = true
    console.log('[InvoicePreviewModal] Step 2 completed: Company settings loaded')

    // Step 3: Generate template
    console.log('[InvoicePreviewModal] Step 3: Generating template...')
    loadingDetails.value.template = true

    // Validate invoice data before generating template
    if (!validateInvoiceData(invoice)) {
      throw new Error('Invoice data validation failed - missing required fields')
    }

    // Generate preview HTML with company settings
    const htmlContent = generatePreviewHTML(invoice, companySettings)

    if (!htmlContent || htmlContent.includes('Invoice data is incomplete')) {
      throw new Error('Template generation failed - HTML content is invalid')
    }

    const blob = new Blob([htmlContent], { type: 'text/html' })

    // Clean up previous URL if it exists
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }

    previewUrl.value = URL.createObjectURL(blob)

    loadingDetails.value.template = false
    loadingDetails.value.templateCompleted = true
    console.log('[InvoicePreviewModal] Step 3 completed: Template generated successfully')

    // Store debug info for troubleshooting
    debugInfo.value = {
      invoiceId,
      invoiceNumber: invoice.invoice_number,
      companyName: companySettings.companyName,
      itemsCount: invoice.items?.length || 0,
      total: invoice.total,
      blobSize: blob.size,
      timestamp: new Date().toISOString()
    }

    console.log('[InvoicePreviewModal] All steps completed successfully!')

  } catch (err) {
    console.error('[InvoicePreviewModal] Failed to load invoice:', err)

    // Reset loading states
    loadingDetails.value = {
      invoice: false,
      settings: false,
      template: false,
      invoiceCompleted: false,
      settingsCompleted: false,
      templateCompleted: false
    }

    // Set appropriate error messages
    if (err instanceof Error) {
      templateError.value = err.message
    } else {
      templateError.value = 'Unknown error occurred while loading invoice'
    }

    // Store debug info for troubleshooting
    debugInfo.value = {
      invoiceId,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
      loadingState: { ...loadingDetails.value }
    }
  }
}

// Retry function for error recovery
const retryLoad = async () => {
  if (props.invoiceId) {
    await loadInvoiceData(props.invoiceId)
  }
}

// Watch for prop changes
watch(() => props.invoiceId, (newId) => {
  if (newId && props.isOpen) {
    loadInvoiceData(newId)
  }
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.invoiceId) {
    loadInvoiceData(props.invoiceId)
  } else if (!isOpen) {
    // Reset state when modal closes
    pdfStatus.value = ''
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = ''
    }
  }
})

// Cleanup
onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<style scoped>
.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 90vw;
  max-height: 90vh;
  width: 1200px;
  height: 800px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.modal-title {
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.print-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
  min-width: 120px;
}

.print-button:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.print-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.6;
}

.download-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
  min-width: 160px;
  position: relative;
}

.download-button:hover {
  background-color: #218838;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.download-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.download-button.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  margin: auto;
  border: 2px solid transparent;
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.close-button {
  background-color: #6c757d;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: #5a6268;
  transform: translateY(-1px);
}

.close-button-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.close-button-secondary:hover {
  background-color: #5a6268;
  transform: translateY(-1px);
}

.pdf-status {
  padding: 10px 20px;
  margin: 0 30px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}

.pdf-status.status-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.pdf-status.status-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.pdf-status.status-loading {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.pdf-status.status-info {
  background-color: #cce7ff;
  color: #004085;
  border: 1px solid #b3d7ff;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 20px;
  padding: 40px;
}

.loading-details {
  text-align: center;
  max-width: 400px;
}

.loading-details p {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.loading-progress {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.step {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f8f9fa;
  width: 100%;
  transition: all 0.3s ease;
}

.step.completed {
  background-color: #d4edda;
  color: #155724;
}

.step-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  background-color: #6c757d;
  color: white;
  flex-shrink: 0;
}

.step.completed .step-icon {
  background-color: #28a745;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px;
}

.error-message {
  text-align: center;
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  max-width: 500px;
}

.error-message h3 {
  color: #dc3545;
  margin-bottom: 15px;
  font-size: 20px;
}

.error-message p {
  color: #666;
  margin-bottom: 15px;
  font-size: 16px;
}

.error-details {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
  text-align: left;
}

.error-details p {
  margin: 0;
  color: #721c24;
  font-size: 14px;
}

.error-debug {
  margin-bottom: 20px;
  text-align: left;
}

.error-debug details {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
}

.error-debug summary {
  cursor: pointer;
  font-weight: 500;
  color: #495057;
  margin-bottom: 10px;
}

.error-debug pre {
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 10px;
  font-size: 12px;
  color: #495057;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

.error-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.retry-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.iframe-container {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pdf-preview-iframe {
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  flex: 1;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive design */
@media (max-width: 768px) {
  .modal-content {
    width: 95vw;
    height: 95vh;
  }

  .modal-header {
    padding: 15px 20px;
    flex-direction: column;
    gap: 15px;
  }

  .header-left {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .modal-title {
    font-size: 20px;
  }

  .iframe-container {
    padding: 10px;
  }
}
</style>
