<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="quote">
    <button @click="exportToPdf" class="print-button">Print PDF</button>
    <div ref="quoteRef" class="quote-container">
      <!-- Header Section -->
      <div class="quote-header">
        <div class="company-info">
          <h1>Your Company Name</h1>
          <p>123 Business St, City, State, ZIP</p>
          <p>Phone: (123) 456-7890 | Email: info@company.com</p>
        </div>
        <div class="quote-title">
          <h2>QUOTE</h2>
          <p class="quote-number">#{{ quote.quote_number }}</p>
        </div>
      </div>

      <!-- Quote Details -->
      <div class="quote-details">
        <div class="detail-row">
          <div><strong>Quote Number:</strong> {{ quote.quote_number }}</div>
          <div><strong>Issue Date:</strong> {{ quote.issue_date }}</div>
        </div>
        <div class="detail-row">
          <div v-if="quote.expiry_date"><strong>Expiry Date:</strong> {{ quote.expiry_date }}</div>
          <div><strong>Status:</strong> {{ quote.status }}</div>
        </div>
      </div>

      <!-- Customer Details -->
      <div class="customer-details">
        <h3>Bill To:</h3>
        <div class="customer-info">
          <p><strong>{{ quote.customer_name || 'N/A' }}</strong></p>
        </div>
      </div>

      <!-- Items Table -->
      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Unit Price</th>
            <th>Discount</th>
            <th>Line Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in quote.items" :key="item.id">
            <td>{{ item.package_name || 'N/A' }}</td>
            <td>{{ item.unit_price }}</td>
            <td>{{ item.discount }}</td>
            <td>{{ item.line_total }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals Section -->
      <div class="totals">
        <div class="total-row total-grand"><strong>Total:</strong> {{ quote.total }}</div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>Thank you for your business! This quote is valid until {{ quote.expiry_date || 'expiry date' }}.</p>
        <p>Terms and Conditions: Payment due within 30 days. All prices are in USD.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import html2pdf from 'html2pdf.js'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Quote } from '../../types/quote.types'

const route = useRoute()
const quote = ref<Quote | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const quoteRef = ref<HTMLElement | null>(null)

const exportToPdf = () => {
  if (!quoteRef.value || !quote.value) return
  const element = quoteRef.value
  const opt = {
    margin: 1,
    filename: `quote-${quote.value.quote_number}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }
  html2pdf().set(opt).from(element).outputPdf().then((pdf: any) => {
    const blob = new Blob([pdf], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  })
}

onMounted(async () => {
  const quoteId = route.params.id as string
  if (!quoteId || isNaN(Number(quoteId))) {
    error.value = 'Invalid quote ID'
    loading.value = false
    return
  }
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`http://127.0.0.1:8001/api/v1/quotes/${quoteId}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
    quote.value = response.data
  } catch (err: any) {
    if (err.response) {
      error.value = `Failed to fetch quote: ${err.response.data.detail || err.response.statusText}`
    } else if (err.request) {
      error.value = 'Network error - please check your connection'
    } else {
      error.value = 'Failed to fetch quote'
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.print-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
  border-radius: 4px;
}

.print-button:hover {
  background-color: #0056b3;
}

.quote-container {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #fff;
  box-sizing: border-box;
}

.quote-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  border-bottom: 2px solid #000;
  padding-bottom: 15px;
  page-break-inside: avoid;
}

.company-info h1 {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #333;
}

.company-info p {
  margin: 2px 0;
  font-size: 14px;
  color: #666;
}

.quote-title h2 {
  margin: 0;
  font-size: 48px;
  color: #333;
  text-align: right;
}

.quote-title .quote-number {
  margin: 5px 0 0 0;
  font-size: 18px;
  color: #666;
  text-align: right;
}

.quote-details {
  margin-bottom: 30px;
  page-break-inside: avoid;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.detail-row div {
  flex: 1;
  font-size: 14px;
}

.customer-details {
  margin-bottom: 30px;
  page-break-inside: avoid;
}

.customer-details h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}

.customer-info p {
  margin: 5px 0;
  font-size: 14px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  page-break-inside: avoid;
}

.items-table th, .items-table td {
  border: 1px solid #ccc;
  padding: 12px;
  text-align: left;
  font-size: 14px;
}

.items-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
}

.items-table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.totals {
  text-align: right;
  margin-bottom: 30px;
  page-break-inside: avoid;
}

.total-row {
  margin-bottom: 8px;
  font-size: 16px;
}

.total-grand {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  border-top: 2px solid #000;
  padding-top: 10px;
}

.footer {
  text-align: center;
  border-top: 1px solid #ccc;
  padding-top: 20px;
  font-style: italic;
  font-size: 12px;
  color: #666;
  page-break-inside: avoid;
}

.footer p {
  margin: 5px 0;
}

@media print {
  .print-button {
    display: none;
  }

  .quote-container {
    max-width: none;
    margin: 0;
    padding: 15mm;
    border: none;
    box-shadow: none;
    font-size: 12px;
  }

  .quote-header {
    margin-bottom: 20mm;
  }

  .company-info h1 {
    font-size: 24pt;
  }

  .quote-title h2 {
    font-size: 36pt;
  }

  .items-table th, .items-table td {
    padding: 8pt;
    font-size: 11pt;
  }

  .total-grand {
    font-size: 16pt;
  }

  .footer {
    font-size: 10pt;
  }

  @page {
    size: A4;
    margin: 15mm;
  }
}
</style>
