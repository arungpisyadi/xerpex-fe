<template>
  <div v-if="loading" class="loading-container">
    <div class="spinner"></div>
    <p>Loading quote...</p>
  </div>
  <div v-else-if="error" class="error-container">
    <h3>Error Loading Quote</h3>
    <p>{{ error }}</p>
  </div>
  <div v-else v-html="htmlContent" class="quote-pdf-content"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import quoteService from '../../services/quote.service'
import type { Quote } from '../../types/quote.types'
import { useQuoteTemplate } from '../../composables/useQuoteTemplate'
import { useGlobalCompanySettings } from '../../composables/useCompanySettings'

const route = useRoute()

const { generatePrintHTML, validateQuoteData } = useQuoteTemplate()
const { getInvoiceDisplaySettings } = useGlobalCompanySettings()

const currentQuote = ref<Quote | null>(null)
const htmlContent = ref<string>('')
const loading = ref(true)
const error = ref<string>('')

const loadQuoteData = async (quoteId: number) => {
  try {
    loading.value = true
    error.value = ''

    // Load quote data
    const quote = await quoteService.getQuoteById(quoteId)

    if (!quote) {
      throw new Error('Quote not found')
    }

    // Validate quote data
    if (!validateQuoteData(quote)) {
      throw new Error('Quote data validation failed')
    }

    currentQuote.value = quote

    // Load company settings
    const companySettings = await getInvoiceDisplaySettings()

    // Generate print HTML
    htmlContent.value = generatePrintHTML(quote, companySettings)

  } catch (err) {
    console.error('[QuotePdfView] Failed to load quote:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load quote'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const quoteId = route.params.id as string

  if (!quoteId || isNaN(Number(quoteId))) {
    error.value = 'Invalid quote ID'
    loading.value = false
    return
  }

  await loadQuoteData(Number(quoteId))
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20px;
  background-color: #f5f5f5;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #28a745;
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
  background-color: #f5f5f5;
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

.quote-pdf-content {
  /* No additional styling - let the HTML content control its own styles */
  min-height: 100vh;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
