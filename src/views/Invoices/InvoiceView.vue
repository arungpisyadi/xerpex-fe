<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="invoice">
    <div class="pdf-controls">
      <button @click="previewPDF" class="preview-button">📄 Preview PDF</button>
      <button
        @click="printInvoice"
        :disabled="loading || !invoice"
        class="print-invoice-button"
        title="Print Invoice"
      >
        🖨️ Print Invoice
      </button>
      <button
        @click="exportToPdf"
        :disabled="pdfGenerating"
        class="generate-pdf-button"
        :class="{ loading: pdfGenerating }"
      >
        <span v-if="pdfGenerating">Generating PDF...</span>
        <span v-else>Generate PDF (Direct)</span>
      </button>
      <div v-if="pdfStatus" class="pdf-status" :class="pdfStatusClass">
        {{ pdfStatus }}
      </div>
    </div>
    <div ref="invoiceRef" class="invoice-container">
      <div class="invoice-header">
        <div class="company-info">
          <h1>{{ companySettings.companyName }}</h1>
          <p>{{ companySettings.companyAddress }}</p>
          <p>Phone: {{ companySettings.companyPhone }}</p>
          <p>Email: {{ companySettings.companyEmail }}</p>
        </div>
        <div class="invoice-title">
          <h2>INVOICE</h2>
        </div>
      </div>
      <div class="invoice-details">
        <div><strong>Invoice #:</strong> {{ invoice.invoice_number }}</div>
        <div><strong>Issue Date:</strong> {{ invoice.issue_date }}</div>
        <div><strong>Due Date:</strong> {{ invoice.due_date }}</div>
      </div>
      <div class="customer-details">
        <h3>Bill To:</h3>
        <p>{{ invoice.customer_name || 'N/A' }}</p>
      </div>
      <table class="items-table">
        <thead>
          <tr>
            <th>Package</th>
            <th>Unit Price</th>
            <th>Discount</th>
            <th>Line Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in invoice.items" :key="item.id">
            <td>{{ item.package_name || 'N/A' }}</td>
            <td>{{ item.unit_price }}</td>
            <td>{{ item.discount }}</td>
            <td>{{ item.line_total }}</td>
          </tr>
        </tbody>
      </table>
      <div class="totals">
        <div style="font-style: italic">
          <strong>Total Discount:</strong> {{ totalDiscount.toFixed(2) }}
        </div>
        <div><strong>Tax:</strong> {{ invoice.tax_total }}</div>
        <div><strong>Total:</strong> {{ invoice.total }}</div>
      </div>
      <div v-if="invoice.payment_terms" class="payment-terms">
        <h4>Payment Terms:</h4>
        <p>{{ invoice.payment_terms }}</p>
      </div>
      <div v-if="invoice.notes" class="notes">
        <h4>Notes:</h4>
        <p>{{ invoice.notes }}</p>
      </div>
      <div class="footer">
        <p>Thank you for your business!</p>
      </div>
    </div>

    <!-- Activity History -->
    <div v-if="invoice?.history && invoice.history.length > 0" class="history-section">
      <h4 class="history-title">Activity History</h4>
      <div class="history-table-wrapper">
        <table class="history-table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Event Type</th>
              <th>Details</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in invoice.history" :key="item.id">
              <td class="date-cell">{{ formatHistoryDateTime(item.created_at) }}</td>
              <td class="event-type-cell">
                <span class="event-badge" :class="getEventBadgeClass(item.event_category)">
                  {{ item.event_type }}
                </span>
              </td>
              <td class="metadata-cell">
                <div
                  v-if="item.event_metadata && Object.keys(item.event_metadata).length > 0"
                  class="metadata-content"
                >
                  <span
                    v-for="(value, key) in item.event_metadata"
                    :key="key"
                    class="metadata-item"
                  >
                    <strong>{{ formatMetadataKey(key) }}:</strong> {{ value }}
                  </span>
                </div>
                <span v-else class="no-metadata">—</span>
              </td>
              <td class="user-cell">User #{{ item.user_id }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Invoice Preview Modal -->
    <InvoicePreviewModal
      v-if="isModalOpen"
      :invoiceId="invoice?.id || null"
      :isOpen="isModalOpen"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import html2pdf from 'html2pdf.js'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Invoice } from '../../types/invoice.types'
import InvoicePreviewModal from '../../components/invoices/InvoicePreviewModal.vue'
import { useInvoiceTemplate } from '../../composables/useInvoiceTemplate'
import { useInvoiceData } from '../../composables/useInvoiceData'

const route = useRoute()
const router = useRouter()
const invoiceRef = ref<HTMLElement | null>(null)

// Centralized services
const { generatePrintHTML: templateGeneratePrintHTML, getInvoiceDisplaySettingsSync } =
  useInvoiceTemplate()
const { currentInvoice: invoice, loading, error, getInvoice } = useInvoiceData()

// PDF generation state
const pdfGenerating = ref(false)
const pdfStatus = ref<string>('')
const backendAvailable = ref(true)

// Modal state
const isModalOpen = ref(false)

// Company settings - for template display
const companySettings = computed(() => getInvoiceDisplaySettingsSync())

// Computed property for PDF status styling
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

// Computed property for total discount - sum of all discounts
const totalDiscount = computed(() => {
  if (!invoice.value?.items) return 0
  return invoice.value.items.reduce((sum, item) => sum + (parseFloat(item.discount as any) || 0), 0)
})

// Check backend availability
const checkBackendAvailability = async (): Promise<boolean> => {
  try {
    // Try a simple API call to check if backend is available
    const response = await fetch('/api/health', { method: 'HEAD', timeout: 5000 } as any)
    return response.ok
  } catch (error) {
    console.warn('Backend unavailable, using client-side PDF generation as fallback')
    return false
  }
}

// Enhanced client-side PDF generation with error handling and better quality
const exportToPdf = async () => {
  if (!invoiceRef.value || !invoice.value) {
    pdfStatus.value = 'Error: Invoice data not available'
    return
  }

  try {
    pdfGenerating.value = true
    pdfStatus.value = 'Generating PDF...'

    const element = invoiceRef.value

    // Enhanced html2pdf options for better quality
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
      filename: `invoice-${invoice.value.invoice_number}.pdf`,
      image: {
        type: 'jpeg' as const,
        quality: 1.0,
      },
      html2canvas: {
        scale: 3,
        useCORS: true,
        letterRendering: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait' as const,
        putOnlyUsedFonts: true,
        floatPrecision: 16,
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    }

    // Generate and download PDF
    await html2pdf().set(opt).from(element).save()

    pdfStatus.value = 'PDF generated successfully!'
    setTimeout(() => {
      pdfStatus.value = ''
    }, 3000)
  } catch (error) {
    console.error('Client-side PDF generation failed:', error)
    pdfStatus.value = 'Error: Failed to generate PDF. Please try again.'
    setTimeout(() => {
      pdfStatus.value = ''
    }, 5000)
  } finally {
    pdfGenerating.value = false
  }
}

// Print functionality for direct invoice view
const printInvoice = () => {
  if (!invoice.value) {
    pdfStatus.value = 'Error: Invoice data not available'
    setTimeout(() => {
      pdfStatus.value = ''
    }, 3000)
    return
  }

  try {
    // Generate HTML content with print-optimized styles
    const htmlContent = templateGeneratePrintHTML(invoice.value)

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

// Open PDF preview modal
const previewPDF = () => {
  if (!invoice.value) {
    pdfStatus.value = 'Error: Invoice data not available'
    return
  }

  isModalOpen.value = true
}

// Close modal
const closeModal = () => {
  isModalOpen.value = false
}

// Helper function to format date and time
const formatHistoryDateTime = (dateString: string) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// Helper function to get badge class based on event category
const getEventBadgeClass = (category: string) => {
  const categoryLower = (category || '').toLowerCase()
  if (categoryLower.includes('create')) return 'event-created'
  if (categoryLower.includes('update') || categoryLower.includes('edit')) return 'event-updated'
  if (categoryLower.includes('delete')) return 'event-deleted'
  if (categoryLower.includes('status')) return 'event-status'
  if (categoryLower.includes('send') || categoryLower.includes('email')) return 'event-sent'
  return 'event-default'
}

// Helper function to format metadata keys
const formatMetadataKey = (key: string | number) => {
  return String(key)
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

onMounted(async () => {
  const invoiceId = route.params.invoiceId as string
  if (!invoiceId || isNaN(Number(invoiceId))) {
    error.value = 'Invalid invoice ID'
    return
  }

  try {
    // Check backend availability in parallel with loading invoice
    const [_, isBackendAvailable] = await Promise.all([
      getInvoice(Number(invoiceId)),
      checkBackendAvailability(),
    ])

    backendAvailable.value = isBackendAvailable

    if (!isBackendAvailable) {
      pdfStatus.value = 'Server PDF unavailable - Client-side generation ready'
      setTimeout(() => {
        pdfStatus.value = ''
      }, 3000)
    }
  } catch (err) {
    // If invoice loading fails, still check backend for PDF functionality
    backendAvailable.value = await checkBackendAvailability()
  }
})
</script>

<style scoped>
.pdf-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.preview-button,
.print-invoice-button,
.generate-pdf-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
  min-width: 150px;
  position: relative;
}

.preview-button {
  background-color: #28a745;
}

.preview-button:hover {
  background-color: #218838;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.print-invoice-button {
  background-color: #17a2b8;
}

.print-invoice-button:hover {
  background-color: #138496;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
}

.print-invoice-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.6;
}

.generate-pdf-button:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.generate-pdf-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.generate-pdf-button.loading::after {
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
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  max-width: 300px;
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

@keyframes spin {
  0% {
    transform: translateY(-50%) rotate(0deg);
  }
  100% {
    transform: translateY(-50%) rotate(360deg);
  }
}

.invoice-container {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #fff;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #000;
  padding-bottom: 10px;
}

.company-info h1 {
  margin: 0;
  font-size: 24px;
}

.company-info p {
  margin: 2px 0;
}

.invoice-title h2 {
  margin: 0;
  font-size: 36px;
  color: #333;
}

.invoice-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.invoice-details div {
  flex: 1;
}

.customer-details {
  margin-bottom: 20px;
}

.customer-details h3 {
  margin: 0 0 10px 0;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.items-table th,
.items-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.items-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.totals {
  text-align: right;
  margin-bottom: 20px;
}

.totals div {
  margin-bottom: 5px;
}

.footer {
  text-align: center;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  font-style: italic;
}

@media print {
  .pdf-controls {
    display: none;
  }

  .invoice-container {
    page-break-inside: avoid;
    box-shadow: none;
    border: none;
  }

  body {
    font-size: 12px;
  }
}

.history-section {
  max-width: 800px;
  margin: 20px auto 0;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #ccc;
}

.history-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.history-table-wrapper {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.history-table thead {
  background-color: #f8f9fa;
}

.history-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
}

.history-table td {
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: top;
}

.history-table tbody tr:hover {
  background-color: #f8f9fa;
}

.date-cell {
  white-space: nowrap;
  color: #6c757d;
  font-size: 13px;
}

.event-type-cell {
  white-space: nowrap;
}

.event-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.event-created {
  background-color: #d4edda;
  color: #155724;
}

.event-updated {
  background-color: #d1ecf1;
  color: #0c5460;
}

.event-deleted {
  background-color: #f8d7da;
  color: #721c24;
}

.event-status {
  background-color: #fff3cd;
  color: #856404;
}

.event-sent {
  background-color: #cce5ff;
  color: #004085;
}

.event-default {
  background-color: #e2e3e5;
  color: #383d41;
}

.metadata-cell {
  max-width: 400px;
}

.metadata-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metadata-item {
  font-size: 13px;
  color: #495057;
  line-height: 1.4;
}

.metadata-item strong {
  color: #212529;
  font-weight: 600;
}

.no-metadata {
  color: #adb5bd;
  font-style: italic;
}

.user-cell {
  color: #6c757d;
  font-size: 13px;
  white-space: nowrap;
}
</style>
