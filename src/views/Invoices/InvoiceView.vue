<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="invoice">
    <button @click="exportToPdf" class="print-button">Print PDF</button>
    <div ref="invoiceRef" class="invoice-container">
    <div class="invoice-header">
      <div class="company-info">
        <h1>Your Company Name</h1>
        <p>123 Business St, City, State, ZIP</p>
        <p>Phone: (123) 456-7890</p>
        <p>Email: info@company.com</p>
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
      <div><strong>Subtotal:</strong> {{ (invoice.total - invoice.tax_total).toFixed(2) }}</div>
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
      <p>Thank you for your business! Payment is due within 30 days.</p>
    </div>
   </div>
 </div>
</template>

<script setup lang="ts">
// @ts-ignore
import html2pdf from 'html2pdf.js'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import invoiceService from '../../services/invoice.service'
import type { Invoice } from '../../types/invoice.types'

const route = useRoute()
const invoice = ref<Invoice | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const invoiceRef = ref<HTMLElement | null>(null)

const exportToPdf = () => {
  if (!invoiceRef.value || !invoice.value) return
  const element = invoiceRef.value
  const opt = {
    margin: 1,
    filename: `invoice-${invoice.value.invoice_number}.pdf`,
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
  const invoiceId = route.params.invoiceId as string
  if (!invoiceId || isNaN(Number(invoiceId))) {
    error.value = 'Invalid invoice ID'
    loading.value = false
    return
  }
  try {
    const data = await invoiceService.getInvoice(Number(invoiceId))
    invoice.value = data
  } catch (err) {
    error.value = 'Failed to fetch invoice'
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

.items-table th, .items-table td {
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
  .invoice-container {
    page-break-inside: avoid;
    box-shadow: none;
    border: none;
  }
  body {
    font-size: 12px;
  }
}
</style>
