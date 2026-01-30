<template>
  <FullScreenLayout>
    <div class="pdf-preview-container">
      <!-- Preview Header -->
      <div class="preview-header">
        <div class="header-left">
          <button @click="goBack" class="back-button">← Back to Invoice</button>
          <h2 class="preview-title">Invoice Preview</h2>
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
          <!-- <button
            @click="printInvoice"
            :disabled="pdfGenerating"
            class="download-button"
            :class="{ loading: pdfGenerating }"
          >
            <span v-if="pdfGenerating">Generating PDF...</span>
            <span v-else>📄 Download PDF</span>
          </button> -->
          <button
            @click="downloadPDF"
            :disabled="pdfGenerating"
            class="download-button"
            :class="{ 'loading': pdfGenerating }"
          >
            <span v-if="pdfGenerating">Generating PDF...</span>
            <span v-else>📄 Download PDF</span>
          </button>
        </div>
      </div>

      <!-- PDF Status -->
      <div v-if="pdfStatus" class="pdf-status" :class="pdfStatusClass">
        {{ pdfStatus }}
      </div>

      <!-- Loading State -->
      <div
        v-if="loading || loadingDetails.invoice || loadingDetails.settings"
        class="loading-container"
      >
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
            <button @click="goBack" class="back-button">Go Back</button>
          </div>
        </div>
      </div>

      <!-- Preview Frame -->
      <div v-else-if="currentInvoice" class="iframe-container">
        <iframe
          :src="`/invoices/${route.params.invoiceId}/pdf/view`"
          class="pdf-preview-iframe"
          @load="onIframeLoad"
          title="Invoice Preview"
        >
        </iframe>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FullScreenLayout from '../../components/layout/FullScreenLayout.vue'
import { useInvoiceTemplate } from '../../composables/useInvoiceTemplate'
import { useInvoiceData } from '../../composables/useInvoiceData'
import html2pdf from 'html2pdf.js'

const route = useRoute()
const router = useRouter()

// Centralized services
const { generatePrintHTML } = useInvoiceTemplate()
const { currentInvoice, loading, error, getInvoice } = useInvoiceData()

// Local state
const iframeLoaded = ref(false)

// Enhanced loading state tracking
const loadingDetails = ref({
  invoice: false,
  settings: false,
  template: false,
  invoiceCompleted: false,
  settingsCompleted: false,
  templateCompleted: false,
})

// Enhanced error handling
const templateError = ref<string>('')
const debugInfo = ref<DebugInfo | null>(null)

// PDF generation state
const pdfGenerating = ref(false)
const pdfStatus = ref<string>('')

// Debug info type
interface DebugInfo {
  invoiceId?: number | string
  invoiceNumber?: string
  itemsCount?: number
  total?: number
  status?: string
  timestamp?: string
  error?: string
  stack?: string
  loadingState?: object
}

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

// Methods
const goBack = () => {
  router.push(`/invoices/${route.params.invoiceId}`)
}

const onIframeLoad = () => {
  iframeLoaded.value = true
}

// Print functionality
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

/**
 * Generate PDF directly from template data (bypasses iframe scraping issues)
 */
const generatePDFFromTemplate = async (): Promise<boolean> => {
  if (!currentInvoice.value) {
    throw new Error('Invoice data not available')
  }

  pdfStatus.value = 'Generating PDF content from template...'

  // Generate print-optimized HTML directly from template
  const htmlContent = generatePrintHTML(currentInvoice.value)

  pdfStatus.value = 'Preparing PDF generation...'

  // Create a temporary container element with the HTML content
  const container = document.createElement('div')
  container.innerHTML = htmlContent
  container.style.position = 'fixed'
  container.style.left = '0'
  container.style.top = '0'
  container.style.width = '210mm' // A4 width
  container.style.zIndex = '-9999'
  container.style.visibility = 'hidden'
  container.style.overflow = 'visible'

  // Append to body (hidden)
  document.body.appendChild(container)

  try {
    // DEBUG: Log the HTML structure to diagnose issues
    console.log('[PDF Generation] Container innerHTML (first 200 chars):', htmlContent.substring(0, 200))
    console.log('[PDF Generation] Container children count:', container.children.length)
    console.log('[PDF Generation] First child tag name:', container.children[0]?.tagName)

    // Get the actual content element - query for .invoice-container class
    // The body tag is stripped when using innerHTML, so we need to target the actual content
    const invoiceContainer = container.querySelector('.invoice-container')
    console.log('[PDF Generation] Found .invoice-container:', !!invoiceContainer)

    // Check if body element exists (it shouldn't when using innerHTML with full HTML doc)
    const bodyElement = container.querySelector('body')
    console.log('[PDF Generation] Found body element:', !!bodyElement)

    // Use the invoice-container if found, otherwise use the first child, otherwise fallback to container
    const contentElement: HTMLElement = (invoiceContainer || container.children[0] || container) as HTMLElement
    console.log('[PDF Generation] Using content element tag:', contentElement.tagName)

    // Get the actual scrollable height
    const scrollHeight = contentElement.scrollHeight || contentElement.clientHeight || 1000
    console.log('[PDF Generation] Content height:', scrollHeight)

    // Configure html2pdf options for full content capture
    const opt = {
      margin: [5, 5, 5, 5] as [number, number, number, number],
      filename: `Invoice_${currentInvoice.value.invoice_number}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: true, // Enable logging for debugging
        letterRendering: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollY: 0,
        scrollX: 0,
        windowHeight: scrollHeight,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait' as const,
      },
      pagebreak: {
        mode: ['css', 'legacy'],
      },
    }

    pdfStatus.value = 'Converting to PDF...'

    // Generate and download PDF
    await html2pdf().set(opt).from(contentElement).save()

    pdfStatus.value = 'PDF generated successfully!'
    return true
  } catch (error) {
    console.error('PDF generation failed:', error)
    throw error
  } finally {
    // Clean up: remove the temporary container
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  }
}

const downloadPDF = async () => {
  if (!currentInvoice.value) {
    pdfStatus.value = 'Error: Invoice data not available'
    return
  }

  try {
    pdfGenerating.value = true
    pdfStatus.value = 'Generating PDF from template...'

    // Add delay to show status message
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Use generatePDFFromTemplate directly - this will show console logs
    console.log('[downloadPDF] Calling generatePDFFromTemplate()...')
    await generatePDFFromTemplate()
    console.log('[downloadPDF] ✅ generatePDFFromTemplate() completed successfully')
    pdfStatus.value = 'PDF generated successfully!'

    setTimeout(() => {
      pdfStatus.value = ''
    }, 3000)
  } catch (error) {
    console.error('PDF generation failed:', error)
    console.log('[downloadPDF] ❌ generatePDFFromTemplate() failed')

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'

    // Provide user feedback based on error type
    if (errorMessage.includes('html2canvas') || errorMessage.includes('canvas')) {
      pdfStatus.value = 'Error: Failed to render content. Please try printing instead.'
    } else if (errorMessage.includes('invoice') || errorMessage.includes('template')) {
      pdfStatus.value = 'Error: Unable to generate PDF from template. Please try printing instead.'
    } else {
      pdfStatus.value =
        'Error: PDF generation failed. Please try printing as an alternative.'
    }

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

  console.log('[InvoicePreview] Starting to load invoice data for ID:', invoiceId)

  // Reset all states
  templateError.value = ''
  debugInfo.value = null
  iframeLoaded.value = false

  // Reset loading details
  loadingDetails.value = {
    invoice: true,
    settings: false,
    template: false,
    invoiceCompleted: false,
    settingsCompleted: true, // We don't load settings here anymore
    templateCompleted: true, // Template is loaded via the route
  }

  try {
    // Step 1: Load invoice data (just to verify it exists and store for reference)
    console.log('[InvoicePreview] Step 1: Loading invoice data...')
    const invoice = await getInvoice(invoiceId)

    if (!invoice) {
      throw new Error('Invoice data not found or is incomplete')
    }

    currentInvoice.value = invoice
    loadingDetails.value.invoice = false
    loadingDetails.value.invoiceCompleted = true
    console.log('[InvoicePreview] Step 1 completed: Invoice data loaded')

    // Store debug info for troubleshooting
    debugInfo.value = {
      invoiceId,
      invoiceNumber: invoice.invoice_number,
      itemsCount: invoice.items?.length || 0,
      total: invoice.total,
      status: invoice.status,
      timestamp: new Date().toISOString(),
    }

    console.log('[InvoicePreview] All steps completed successfully!')
  } catch (err) {
    console.error('[InvoicePreview] Failed to load invoice:', err)

    // Reset loading states
    loadingDetails.value = {
      invoice: false,
      settings: false,
      template: false,
      invoiceCompleted: false,
      settingsCompleted: false,
      templateCompleted: false,
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
      loadingState: { ...loadingDetails.value },
    }
  } finally {
    loading.value = false
  }
}

// Retry function for error recovery
const retryLoad = async () => {
  const invoiceId = route.params.invoiceId as string
  if (invoiceId) {
    loading.value = true
    await loadInvoiceData(Number(invoiceId))
  }
}

// Initialize component
onMounted(async () => {
  const invoiceId = route.params.invoiceId as string
  if (!invoiceId || isNaN(Number(invoiceId))) {
    templateError.value = 'Invalid invoice ID'
    return
  }

  await loadInvoiceData(Number(invoiceId))
})

// No cleanup needed since we're not using blob URLs anymore
</script>

<style scoped>
.pdf-preview-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.back-button {
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

.back-button:hover {
  background-color: #5a6268;
  transform: translateY(-1px);
}

.preview-title {
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

.error-message h3 {
  color: #dc3545;
  margin-bottom: 15px;
  font-size: 20px;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex: 1;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .preview-header {
    padding: 15px 20px;
    flex-direction: column;
    gap: 15px;
  }

  .header-left {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .preview-title {
    font-size: 20px;
  }

  .iframe-container {
    padding: 10px;
  }
}
</style>
