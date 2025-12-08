<template>
  <FullScreenLayout>
    <div class="pdf-preview-container">
      <!-- Preview Header -->
      <div class="preview-header">
        <div class="header-left">
          <button @click="goBack" class="back-button">
            ← Back to Quotation
          </button>
          <h2 class="preview-title">Quotation Preview</h2>
        </div>
        <div class="header-right">
          <button
            @click="printQuote"
            :disabled="loading || !iframeLoaded"
            class="print-button"
            title="Print Quotation"
          >
            🖨️ Print
          </button>
          <button
            @click="printQuote"
            :disabled="pdfGenerating"
            class="download-button"
            :class="{ 'loading': pdfGenerating }"
          >
            <span v-if="pdfGenerating">Generating PDF...</span>
            <span v-else>📄 Download PDF</span>
          </button>
          <!-- <button
            @click="downloadPDF"
            :disabled="pdfGenerating"
            class="download-button"
            :class="{ 'loading': pdfGenerating }"
          >
            <span v-if="pdfGenerating">Generating PDF...</span>
            <span v-else>📄 Download PDF</span>
          </button> -->
        </div>
      </div>

      <!-- PDF Status -->
      <div v-if="pdfStatus" class="pdf-status" :class="pdfStatusClass">
        {{ pdfStatus }}
      </div>

      <!-- Loading State -->
      <div v-if="loading || loadingDetails.quote || loadingDetails.settings" class="loading-container">
        <div class="spinner"></div>
        <div class="loading-details">
          <p v-if="loadingDetails.quote">Loading quotation data...</p>
          <p v-else-if="loadingDetails.settings">Loading company settings...</p>
          <p v-else-if="loadingDetails.template">Generating preview...</p>
          <p v-else>Loading quotation preview...</p>

          <div class="loading-progress">
            <div class="step" :class="{ completed: loadingDetails.quoteCompleted }">
              <span class="step-icon">{{ loadingDetails.quoteCompleted ? '✓' : '○' }}</span>
              Quotation Data
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
      <div v-else-if="currentQuote" class="iframe-container">
        <iframe
          :src="`/quotes/${route.params.id}/pdf/view`"
          class="pdf-preview-iframe"
          ref="previewFrame"
          @load="onIframeLoad"
          title="Quotation Preview">
        </iframe>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FullScreenLayout from '../../components/layout/FullScreenLayout.vue'
import quoteService from '../../services/quote.service.ts'
import type { Quote } from '../../types/quote.types'
import { useQuoteTemplate } from '../../composables/useQuoteTemplate'
import { useGlobalCompanySettings } from '../../composables/useCompanySettings'
import html2pdf from 'html2pdf.js'

const route = useRoute()
const router = useRouter()

// Centralized services
const { generatePreviewHTML, generatePrintHTML, validateQuoteData } = useQuoteTemplate()
const { getInvoiceDisplaySettings } = useGlobalCompanySettings()

// Local state
const currentQuote = ref<Quote | null>(null)
const loading = ref(true)
const error = ref<string>('')
const previewFrame = ref<HTMLIFrameElement | null>(null)
const iframeLoaded = ref(false)

// Enhanced loading state tracking
const loadingDetails = ref({
  quote: false,
  settings: false,
  template: false,
  quoteCompleted: false,
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

// Methods
const goBack = () => {
  router.push(`/quotes/${route.params.id}`)
}

const onIframeLoad = () => {
  iframeLoaded.value = true
}

// Print functionality
const printQuote = () => {
  if (!currentQuote.value || !iframeLoaded.value) {
    pdfStatus.value = 'Error: Quotation not loaded yet'
    setTimeout(() => {
      pdfStatus.value = ''
    }, 3000)
    return
  }

  try {
    // Generate HTML content with print-optimized styles
    const htmlContent = generatePrintHTML(currentQuote.value)

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

const downloadPDF = async () => {
  if (!currentQuote.value || !previewFrame.value) {
    pdfStatus.value = 'Error: Quotation data not available'
    return
  }

  try {
    pdfGenerating.value = true
    pdfStatus.value = 'Preparing PDF content...'

    // Add delay to show status message
    await new Promise(resolve => setTimeout(resolve, 300))

    pdfStatus.value = 'Capturing content from iframe...'

    // Get the iframe's document
    const iframeDoc = previewFrame.value.contentDocument || previewFrame.value.contentWindow?.document

    if (!iframeDoc) {
      throw new Error('Unable to access iframe content')
    }

    // Get the content element from the iframe
    const content = iframeDoc.body

    if (!content) {
      throw new Error('No content found in iframe')
    }

    pdfStatus.value = 'Generating PDF...'

    // Get the full scrollable height of the content
    const scrollHeight = content.scrollHeight

    // Configure html2pdf options with full content capture
    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `Quotation_${currentQuote.value.quote_number}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollY: 0,  // Start from top of content
        scrollX: 0,  // Start from left of content
        windowHeight: scrollHeight  // Capture full scrollable height
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait' as const
      }
    }

    // Generate and download PDF from iframe content
    await html2pdf().set(opt).from(content).save()

    pdfStatus.value = 'PDF downloaded successfully!'

    setTimeout(() => {
      pdfStatus.value = ''
    }, 3000)

  } catch (error) {
    console.error('PDF download failed:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    // Provide user feedback based on error type
    if (errorMessage.includes('html2canvas') || errorMessage.includes('canvas')) {
      pdfStatus.value = 'Error: Failed to render content. Please try printing instead.'
    } else if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
      pdfStatus.value = 'Error: Connection timeout. Please try again.'
    } else if (errorMessage.includes('iframe')) {
      pdfStatus.value = 'Error: Unable to access content. Please try printing instead.'
    } else {
      pdfStatus.value = 'Error: Failed to generate PDF. Please try printing as an alternative.'
    }

    setTimeout(() => {
      pdfStatus.value = ''
    }, 5000)
  } finally {
    pdfGenerating.value = false
  }
}

const loadQuoteData = async (quoteId: number) => {
  if (!quoteId) {
    templateError.value = 'No quote ID provided'
    return
  }

  console.log('[QuotePreview] Starting to load quote data for ID:', quoteId)

  // Reset all states
  templateError.value = ''
  debugInfo.value = null
  iframeLoaded.value = false

  // Reset loading details
  loadingDetails.value = {
    quote: true,
    settings: false,
    template: false,
    quoteCompleted: false,
    settingsCompleted: true, // We don't load settings here anymore
    templateCompleted: true // Template is loaded via the route
  }

  try {
    // Step 1: Load quote data (just to verify it exists and store for reference)
    console.log('[QuotePreview] Step 1: Loading quote data...')
    const quote = await quoteService.getQuoteById(quoteId)

    if (!quote) {
      throw new Error('Quote data not found or is incomplete')
    }

    currentQuote.value = quote
    loadingDetails.value.quote = false
    loadingDetails.value.quoteCompleted = true
    console.log('[QuotePreview] Step 1 completed: Quote data loaded')

    // Store debug info for troubleshooting
    debugInfo.value = {
      quoteId,
      quoteNumber: quote.quote_number,
      itemsCount: quote.items?.length || 0,
      total: quote.total,
      status: quote.status,
      timestamp: new Date().toISOString()
    }

    console.log('[QuotePreview] All steps completed successfully!')

  } catch (err) {
    console.error('[QuotePreview] Failed to load quote:', err)

    // Reset loading states
    loadingDetails.value = {
      quote: false,
      settings: false,
      template: false,
      quoteCompleted: false,
      settingsCompleted: false,
      templateCompleted: false
    }

    // Set appropriate error messages
    if (err instanceof Error) {
      templateError.value = err.message
    } else {
      templateError.value = 'Unknown error occurred while loading quote'
    }

    // Store debug info for troubleshooting
    debugInfo.value = {
      quoteId,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
      loadingState: { ...loadingDetails.value }
    }
  } finally {
    loading.value = false
  }
}

// Retry function for error recovery
const retryLoad = async () => {
  const quoteId = route.params.id as string
  if (quoteId) {
    loading.value = true
    await loadQuoteData(Number(quoteId))
  }
}

// Initialize component
onMounted(async () => {
  const quoteId = route.params.id as string
  if (!quoteId || isNaN(Number(quoteId))) {
    templateError.value = 'Invalid quote ID'
    loading.value = false
    return
  }

  await loadQuoteData(Number(quoteId))
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
  background-color: #28a745;
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
  background-color: #218838;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.print-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.6;
}

.download-button {
  background-color: #17a2b8;
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
  background-color: #138496;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
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
  border-top: 5px solid #28a745;
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
  background-color: #28a745;
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
  background-color: #218838;
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
