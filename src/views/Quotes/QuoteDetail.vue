<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb
        page-title="Quotation Detail"
        :breadcrumbs="[
          { text: 'Quotations', href: '/quotes' },
          { text: `Quotation ${quote?.quote_number || quoteId}` },
        ]"
      />
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <template v-else>
      <!-- Quote Status Banner -->
      <div class="mb-6 rounded-sm border p-4 shadow-default" :class="getStatusClass(quote.status)">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span class="mr-2">
              <svg
                class="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  v-if="quote.status === 'accepted'"
                  d="M9 12L11 14L15 10"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  v-else-if="quote.status === 'declined'"
                  d="M15 9L9 15M9 9L15 15"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  v-else-if="quote.status === 'expired'"
                  d="M12 8V12L14 14"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  v-else
                  d="M12 8V12M12 16H12.01"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="text-sm font-medium"
              >Quotation #{{ quote.quote_number }} - {{ capitalizeFirstLetter(quote.status) }}</span
            >
          </div>
          <div class="flex gap-2">
            <button
              v-if="quote.status === 'draft'"
              class="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-700 shadow-theme-xs transition-colors duration-200"
              @click="updateQuoteStatus('sent')"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                ></path>
              </svg>
              Mark as Sent
            </button>
            <button
              v-if="quote.status === 'sent'"
              class="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white rounded-lg bg-green-600 hover:bg-green-700 shadow-theme-xs transition-colors duration-200"
              @click="updateQuoteStatus('accepted')"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Accept Quotation
            </button>
            <button
              v-if="quote.status === 'sent'"
              class="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white rounded-lg bg-red-600 hover:bg-red-700 shadow-theme-xs transition-colors duration-200"
              @click="updateQuoteStatus('declined')"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              Decline Quotation
            </button>
            <button
              v-if="quote.status === 'accepted'"
              class="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white rounded-lg bg-purple-600 hover:bg-purple-700 shadow-theme-xs transition-colors duration-200"
              @click="convertToInvoice"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Convert to Invoice
            </button>
            <button
              class="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 hover:border-green-700 dark:bg-green-600 dark:border-green-600 dark:hover:bg-green-700 dark:hover:border-green-700 transition-colors duration-200"
              @click="previewQuote"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
              📄 Preview Quotation
            </button>
            <!-- <button
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg shadow-theme-xs transition-colors duration-200"
              :class="[
                sendingQuote || quote?.status === 'sent' ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-500 hover:bg-brand-600'
              ]" :disabled="sendingQuote || quote?.status === 'sent'" @click="sendQuote">
              <svg v-if="!sendingQuote" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span v-if="sendingQuote">Sending...</span>
              <span v-else-if="quote?.status === 'sent'">Quotation Sent</span>
              <span v-else>Send Quotation</span>
            </button> -->
          </div>
        </div>
      </div>

      <!-- Quote Details -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
        <!-- Quote Summary -->
        <div class="md:col-span-1">
          <div
            class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mb-6"
          >
            <h4 class="mb-4 text-sm font-semibold text-black dark:text-white">Quotation Summary</h4>
            <div class="mb-4">
              <div class="mb-2 flex justify-between">
                <span class="text-xs text-gray-500 dark:text-gray-400">Quotation Number:</span>
                <span class="text-xs font-medium text-black dark:text-white">{{
                  quote.quote_number
                }}</span>
              </div>
              <div class="mb-2 flex justify-between">
                <span class="text-xs text-gray-500 dark:text-gray-400">Amount:</span>
                <span class="text-xs font-medium text-black dark:text-white"
                  >IDR {{ formatPrice(quote.total) }}</span
                >
              </div>
              <div class="mb-2 flex justify-between">
                <span class="text-xs text-gray-500 dark:text-gray-400">Issue Date:</span>
                <span class="text-xs font-medium text-black dark:text-white">{{
                  formatDate(quote.issue_date)
                }}</span>
              </div>
              <div class="mb-2 flex justify-between">
                <span class="text-xs text-gray-500 dark:text-gray-400">Expiry Date:</span>
                <span class="text-xs font-medium text-black dark:text-white">{{
                  quote.expiry_date ? formatDate(quote.expiry_date) : 'Not set'
                }}</span>
              </div>
              <div class="mb-2 flex justify-between">
                <span class="text-xs text-gray-500 dark:text-gray-400">Status:</span>
                <span
                  class="text-xs font-medium px-2 py-1 rounded"
                  :class="getStatusClass(quote.status)"
                >
                  {{ capitalizeFirstLetter(quote.status) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-xs text-gray-500 dark:text-gray-400">Created:</span>
                <span class="text-xs font-medium text-black dark:text-white">{{
                  formatDateTime(quote.created_at)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div
            class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mb-6"
          >
            <h4 class="mb-4 text-sm font-semibold text-black dark:text-white">
              Customer Information
            </h4>
            <div class="customer-info-section">
              <div v-if="quote.customer.name" class="mb-2">
                <span class="text-xs text-gray-500 dark:text-gray-400">Customer:</span>
                <div class="customer-name text-xs font-medium text-black dark:text-white mt-1">
                  {{ quote.customer.name }}
                </div>
                <div class="customer-name text-xs font-medium text-black dark:text-white mt-1">
                  {{ quote.customer.billing_address }}
                </div>
              </div>
              <div v-if="!quote.customer.name" class="text-center py-4">
                <p class="text-gray-500 dark:text-gray-400 text-xs italic">
                  No customer information available.
                </p>
              </div>
            </div>
          </div>

          <!-- Quote Notes -->
          <div
            class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <h4 class="mb-3 text-sm font-semibold text-black dark:text-white">Quotation Notes</h4>

            <div v-if="quote.notes" class="mb-4">
              <h5 class="mb-1 text-xs font-medium text-black dark:text-white">Notes:</h5>
              <p
                class="text-xs text-gray-600 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-800 rounded"
              >
                {{ quote.notes }}
              </p>
            </div>

            <div>
              <h5 class="mb-1 text-xs font-medium text-black dark:text-white">Add Notes:</h5>
              <textarea
                v-model="quoteNotes"
                class="w-full rounded border-stroke bg-gray-100 py-2 px-3 text-xs text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-gray-800 dark:text-white"
                rows="3"
                placeholder="Add notes about this quotation..."
              ></textarea>
              <div class="flex justify-end mt-2">
                <button
                  class="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 shadow-theme-xs disabled:bg-brand-300 transition-colors duration-200"
                  @click="saveNotes"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Villas Section -->
        <div class="md:col-span-2">
          <div
            class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mb-6"
          >
            <h4 class="mb-4 text-sm font-semibold text-black dark:text-white">Villas</h4>

            <div v-if="!quote.villas || quote.villas.length === 0" class="text-center py-6">
              <p class="text-gray-500 dark:text-gray-400 text-xs">
                No villas information available.
              </p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="villaItem in quote.villas"
                :key="villaItem.villa_id"
                class="p-3 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <div class="mb-1">
                  <span class="text-xs font-semibold text-black dark:text-white"
                    >- {{ villaItem.villa.name }}</span
                  >
                  <span class="text-xs text-gray-600 dark:text-gray-400">
                    - {{ villaItem.villa.capacity }}</span
                  >
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 ml-3 whitespace-pre-line">
                  {{ villaItem.villa.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Quote Items -->
          <div
            class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <h4 class="mb-4 text-sm font-semibold text-black dark:text-white">Quotation Items</h4>

            <div v-if="!quote.items || quote.items.length === 0" class="text-center py-6">
              <p class="text-gray-500 dark:text-gray-400 text-xs">No quotation items available.</p>
            </div>

            <div v-else>
              <!-- Items Table -->
              <div class="overflow-x-auto mb-4">
                <table class="w-full table-auto">
                  <thead>
                    <tr class="bg-gray-2 text-left dark:bg-meta-4">
                      <th
                        class="min-w-[150px] py-3 px-3 font-medium text-xs text-black dark:text-white"
                      >
                        Package Name
                      </th>
                      <th
                        class="min-w-[80px] py-3 px-3 font-medium text-xs text-black dark:text-white"
                      >
                        Pax
                      </th>
                      <th
                        class="min-w-[100px] py-3 px-3 font-medium text-xs text-black dark:text-white"
                      >
                        Unit Price
                      </th>
                      <th
                        class="min-w-[80px] py-3 px-3 font-medium text-xs text-black dark:text-white"
                      >
                        Discount
                      </th>
                      <th
                        class="min-w-[100px] py-3 px-3 font-medium text-xs text-black dark:text-white"
                      >
                        Line Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in quote.items" :key="item.id">
                      <td class="border-b border-[#eee] py-3 px-3 dark:border-strokedark">
                        <p class="text-xs text-black dark:text-white">
                          {{
                            item.package?.name || item.package_name || `Package #${item.package_id}`
                          }}
                        </p>
                      </td>
                      <td class="border-b border-[#eee] py-3 px-3 dark:border-strokedark">
                        <p class="text-xs text-black dark:text-white">{{ item.pax || 0 }}</p>
                      </td>
                      <td class="border-b border-[#eee] py-3 px-3 dark:border-strokedark">
                        <p class="text-xs text-black dark:text-white">
                          IDR {{ formatPrice(item.unit_price) }}
                        </p>
                      </td>
                      <td class="border-b border-[#eee] py-3 px-3 dark:border-strokedark">
                        <p
                          class="text-xs"
                          :class="
                            item.discount > 0
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-black dark:text-white'
                          "
                        >
                          IDR {{ formatPrice(item.discount) }}
                        </p>
                      </td>
                      <td class="border-b border-[#eee] py-3 px-3 dark:border-strokedark">
                        <p class="text-xs text-black dark:text-white">
                          IDR {{ formatPrice(item.line_total) }}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Totals Section -->
              <div class="border-t border-stroke dark:border-strokedark pt-3">
                <div class="mb-2 flex justify-between">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Subtotal:</span>
                  <span class="text-xs font-medium text-black dark:text-white"
                    >IDR {{ formatPrice(subtotal) }}</span
                  >
                </div>
                <div class="mb-2 flex justify-between">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Total Discount:</span>
                  <span class="text-xs font-medium text-red-600 dark:text-red-400"
                    >IDR {{ formatPrice(totalDiscount) }}</span
                  >
                </div>
                <div
                  class="pt-2 border-t border-stroke dark:border-strokedark flex justify-between"
                >
                  <span class="text-sm font-semibold text-black dark:text-white"
                    >Total Amount:</span
                  >
                  <span class="text-sm font-semibold text-black dark:text-white"
                    >IDR {{ formatPrice(quote.total) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity History -->
      <div
        v-if="quote.history && quote.history.length > 0"
        class="mt-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <h4 class="mb-4 text-sm font-semibold text-black dark:text-white">Activity History</h4>

        <div class="overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="bg-gray-2 text-left dark:bg-meta-4">
                <th class="min-w-[120px] py-3 px-3 font-medium text-xs text-black dark:text-white">
                  Date/Time
                </th>
                <th class="min-w-[100px] py-3 px-3 font-medium text-xs text-black dark:text-white">
                  Event Type
                </th>
                <th class="min-w-[200px] py-3 px-3 font-medium text-xs text-black dark:text-white">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in quote.history"
                :key="item.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td class="border-b border-[#eee] py-3 px-3 dark:border-strokedark">
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ formatHistoryDateTime(item.created_at) }}
                  </p>
                </td>
                <td class="border-b border-[#eee] py-3 px-3 dark:border-strokedark">
                  <span
                    class="inline-flex rounded px-2 py-1 text-xs font-medium"
                    :class="getEventBadgeClass(item.event_category)"
                  >
                    {{ item.event_type }}
                  </span>
                </td>
                <td class="border-b border-[#eee] py-3 px-3 dark:border-strokedark">
                  <div
                    v-if="item.event_metadata && Object.keys(item.event_metadata).length > 0"
                    class="space-y-1"
                  >
                    <div v-for="(value, key) in item.event_metadata" :key="key" class="text-xs">
                      <span class="font-semibold text-black dark:text-white"
                        >{{ formatMetadataKey(key) }}:</span
                      >
                      <span class="text-gray-600 dark:text-gray-400 ml-1">{{
                        formatMetadataValue(key, value)
                      }}</span>
                    </div>
                  </div>
                  <span v-else class="text-xs text-gray-400 dark:text-gray-500 italic">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </admin-layout>
</template>

<script>
import AdminLayout from '../../components/layout/AdminLayout.vue'
import PageBreadcrumb from '../../components/common/PageBreadcrumb.vue'
import quoteService from '../../services/quote.service.ts'
import { formatNumber } from '../../utils/number-formatter.ts'

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
  },
  data() {
    return {
      loading: true,
      sendingQuote: false,
      quote: {
        status: '',
        quote_number: '',
        total: 0,
        issue_date: '',
        expiry_date: '',
        created_at: '',
        notes: '',
        items: [],
        villas: [],
        customer_name: '',
        customer_email: '',
      },
      quoteHistory: [],
      quoteNotes: '',
    }
  },
  computed: {
    quoteId() {
      return this.$route.params.id
    },
    subtotal() {
      if (!this.quote.items || !Array.isArray(this.quote.items)) {
        return 0
      }
      return this.quote.items.reduce((sum, item) => sum + (parseFloat(item.line_total) || 0), 0)
    },
    totalDiscount() {
      if (!this.quote.items || !Array.isArray(this.quote.items)) {
        return 0
      }
      return this.quote.items.reduce((sum, item) => sum + (parseFloat(item.discount) || 0), 0)
    },
  },
  async created() {
    await this.fetchQuoteData()
  },
  methods: {
    async fetchQuoteData() {
      try {
        // console.log(this.$route.params);

        const quoteId = this.quoteId

        // Check if quote service is available
        if (typeof quoteService === 'undefined') {
          throw new Error('Quote service not yet implemented')
        }

        // Fetch quote data
        const response = await quoteService.getQuoteById(quoteId)
        console.log('Quote response:', response)

        this.quote = response || {
          status: 'unknown',
          quote_number: 'N/A',
          total: 0,
          issue_date: '',
          expiry_date: '',
          created_at: '',
          notes: '',
          items: [],
          customer_name: '',
        }

        // Set quote notes with safe access
        this.quoteNotes = this.quote.notes || ''

        // Initialize empty quote history for now
        this.quoteHistory = []
      } catch (error) {
        console.error('Error fetching quote data:', error)

        // Initialize with safe default values
        this.quote = {
          status: 'unknown',
          quote_number: 'N/A',
          total: 0,
          issue_date: '',
          expiry_date: '',
          created_at: '',
          notes: '',
          items: [],
          customer_name: '',
        }

        // Show error notification to user
        alert(`Failed to load quotation data: ${error.message}`)
      } finally {
        this.loading = false
      }
    },
    formatPrice(price) {
      if (price === null || price === undefined || price === '') {
        return '0.00'
      }

      const num = typeof price === 'string' ? parseFloat(price) : price

      if (isNaN(num)) {
        return '0.00'
      }

      // Use formatNumber for comma separators, then ensure 2 decimal places
      const formatted = formatNumber(num)

      // If the number is a whole number, formatNumber won't include decimals
      // So we need to add .00 if there are no decimals
      if (!formatted.includes('.')) {
        return formatted + '.00'
      }

      // If it has decimals but only one digit, add another zero
      const parts = formatted.split('.')
      if (parts[1] && parts[1].length === 1) {
        return formatted + '0'
      }

      return formatted
    },
    formatDate(dateString) {
      if (!dateString) return ''

      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    },
    formatDateTime(dateString) {
      if (!dateString) return ''

      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    capitalizeFirstLetter(string) {
      if (!string || typeof string !== 'string') return ''
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    getStatusClass(status) {
      const statusMap = {
        draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        declined: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        expired: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      }

      const statusStr = status && typeof status === 'string' ? status.toLowerCase() : ''
      return statusMap[statusStr] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    },
    formatHistoryDateTime(dateString) {
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
    },
    getEventBadgeClass(category) {
      const categoryLower = (category || '').toLowerCase()
      if (categoryLower.includes('create'))
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      if (categoryLower.includes('update') || categoryLower.includes('edit'))
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      if (categoryLower.includes('delete'))
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      if (categoryLower.includes('status'))
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      if (categoryLower.includes('send') || categoryLower.includes('email'))
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    },
    formatMetadataKey(key) {
      return key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },
    formatMetadataValue(key, value) {
      // Format currency values
      if (
        key === 'total_amount' ||
        key.toLowerCase().includes('amount') ||
        key.toLowerCase().includes('price')
      ) {
        const num = typeof value === 'string' ? parseFloat(value) : value
        if (!isNaN(num)) {
          return 'IDR ' + this.formatPrice(num)
        }
      }
      return value
    },
    async updateQuoteStatus(status) {
      try {
        // Show confirmation dialog
        if (!confirm(`Are you sure you want to mark this quotation as ${status}?`)) {
          return
        }

        // Check if quote ID is available
        if (!this.quote || !this.quote.id) {
          alert('Quotation data not available')
          return
        }

        this.loading = true

        // Check if quote service method exists
        if (typeof quoteService === 'undefined') {
          throw new Error('Quote service not yet implemented')
        }

        let response
        if (status === 'sent' && typeof quoteService.sendQuote === 'function') {
          response = await quoteService.sendQuote(this.quote.id)
        } else if (status === 'accepted' && typeof quoteService.acceptQuote === 'function') {
          response = await quoteService.acceptQuote(this.quote.id)
        } else if (status === 'declined' && typeof quoteService.declineQuote === 'function') {
          response = await quoteService.declineQuote(this.quote.id)
        } else {
          throw new Error(`Quote status update to ${status} not yet implemented`)
        }

        // Handle response
        if (response && response.quote) {
          this.quote = response.quote
        }

        // Refresh quote data
        await this.fetchQuoteData()

        // Show success notification
        alert(`Quotation status updated to ${status}`)
      } catch (error) {
        console.error('Error updating quote status:', error)
        alert(`Failed to update quote status: ${error.message}`)
      } finally {
        this.loading = false
      }
    },
    async saveNotes() {
      try {
        // DEBUGGING: Add comprehensive logging
        console.log('\======= DEBUGGING SAVE NOTES =======')
        console.log('1. Quote data check:', {
          hasQuote: !!this.quote,
          quoteId: this.quote?.id,
          currentNotes: this.quote?.notes,
          newNotes: this.quoteNotes,
          quoteData: this.quote,
        })

        // Check if quote ID is available
        if (!this.quote || !this.quote.id) {
          console.error('2. VALIDATION FAILED: Quote data not available')
          alert('Quotation data not available')
          return
        }

        console.log('2. VALIDATION PASSED: Quote ID exists:', this.quote.id)

        // Validate that notes content is not empty
        if (!this.quoteNotes || this.quoteNotes.trim() === '') {
          alert('Please enter some notes before saving')
          return
        }

        this.loading = true

        // DEBUGGING: Check if quoteService has updateQuoteNotes method
        console.log('3. Service method check:', {
          hasQuoteService: typeof quoteService !== 'undefined',
          hasUpdateNotesMethod: typeof quoteService?.updateQuoteNotes === 'function',
          availableMethods: Object.getOwnPropertyNames(quoteService).filter(
            (name) => typeof quoteService[name] === 'function',
          ),
        })

        // Call the backend API to update notes
        console.log('4. CALLING API: Updating notes via service method')
        const response = await quoteService.updateQuoteNotes(this.quote.id, this.quoteNotes.trim())

        console.log('5. API RESPONSE:', response)

        // Handle successful response
        if (response) {
          // Update local state with the response data
          console.log(response)
          this.quote = response

          console.log('6. BACKEND UPDATE SUCCESSFUL: Notes saved to backend')
          alert('Notes saved successfully!')

          // Clear the input field after successful save
          this.quoteNotes = this.quote.notes || ''
        } else {
          throw new Error(response?.message || 'Failed to save notes')
        }
      } catch (error) {
        console.error('7. ERROR OCCURRED:', error)

        // Extract meaningful error message
        let errorMessage = 'Failed to save notes. Please try again.'

        if (error.response && error.response.data && error.response.data.detail) {
          errorMessage = error.response.data.detail
        } else if (error.data && error.data.detail) {
          errorMessage = error.data.detail
        } else if (error.detail) {
          errorMessage = error.detail
        } else if (error.message) {
          errorMessage = error.message
        }

        alert(errorMessage)
      } finally {
        this.loading = false
        console.log('8. CLEANUP: Loading state reset')
        console.log('\======= END DEBUGGING =======')
      }
    },
    previewQuote() {
      // Navigate to quote preview page
      if (!this.quote || !this.quote.id) {
        alert('Quotation data not available')
        return
      }

      this.$router.push(`/quotes/${this.quote.id}/preview`)
    },
    async sendQuote() {
      try {
        // Validation: Check if customer email is available
        if (!this.quote?.customer.email && !this.quote?.customer.name) {
          alert(
            'Customer email is required to send quotation. Please add customer information first.',
          )
          return
        }

        // Show confirmation dialog
        const customerInfo = this.quote.customer.email || this.quote.customer.name || 'the customer'
        const confirmed = confirm(
          `Are you sure you want to send Quotation ${this.quote.quote_number} to ${customerInfo}?`,
        )

        if (!confirmed) return

        // Check if quote ID is available
        if (!this.quote || !this.quote.id) {
          alert('Quotation data not available')
          return
        }

        // Show loading state
        this.sendingQuote = true

        // Call API to send quote
        const response = await quoteService.sendQuote(this.quote.id)

        // Handle response
        if (response && response.success) {
          // Show success message
          alert('Quotation sent successfully!')

          // Update quote status to 'sent'
          if (this.quote) {
            this.quote.status = 'sent'
          }

          // If the response contains updated quote data, use it
          if (response.quote) {
            this.quote = response.quote
          }
        }

        // Refresh quote data to ensure consistency
        await this.fetchQuoteData()
      } catch (error) {
        console.error('Error sending quote:', error)

        // Extract error message from various possible response structures
        let errorMessage = 'Failed to send quotation. Please try again.'

        if (error.response && error.response.data && error.response.data.detail) {
          errorMessage = error.response.data.detail
        } else if (error.data && error.data.detail) {
          errorMessage = error.data.detail
        } else if (error.detail) {
          errorMessage = error.detail
        } else if (error.message) {
          errorMessage = error.message
        }

        alert(errorMessage)
      } finally {
        this.sendingQuote = false
      }
    },
    async convertToInvoice() {
      try {
        // Show confirmation dialog
        if (!confirm('Are you sure you want to convert this quotation to an invoice?')) {
          return
        }

        // Check if quote ID is available
        if (!this.quote || !this.quote.id) {
          alert('Quotation data not available')
          return
        }

        this.loading = true

        // Check if convert service method exists
        if (
          typeof quoteService === 'undefined' ||
          typeof quoteService.convertToInvoice !== 'function'
        ) {
          throw new Error('Convert to invoice service not yet implemented')
        }

        // Default conversion parameters
        console.log(this.quote)

        const conversionData = {
          payment_terms: '30 days',
          due_date:
            this.quote.expiry_date ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
          notes: this.quote.notes || '',
          issue_date: this.quote.issue_date || new Date(Date.now()).toISOString().split('T')[0],
        }

        // Convert quote to invoice
        const response = await quoteService.convertToInvoice(this.quote.id, conversionData)

        // Show success and redirect to invoice
        alert('Quotation converted to invoice successfully')

        // Redirect to invoice detail if we have the invoice ID
        if (response && response.id) {
          this.$router.push(`/invoices/${response.id}`)
        } else {
          this.$router.push('/invoices')
        }
      } catch (error) {
        console.error('Error converting quote to invoice:', error)

        let errorMessage = 'Failed to convert quotation to invoice'
        if (error.message) {
          errorMessage = error.message
        }

        alert(errorMessage)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
