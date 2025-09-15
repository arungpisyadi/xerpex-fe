<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb page-title="Invoice Detail" />
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <template v-else>
      <!-- Invoice Status Banner -->
      <div class="mb-6 rounded-sm border p-4 shadow-default" :class="getStatusClass(invoice.status)">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span class="mr-2">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path v-if="invoice.status === 'paid'" d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path v-else-if="invoice.status === 'cancelled'" d="M15 9L9 15M9 9L15 15" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path v-else-if="invoice.status === 'overdue'" d="M12 8V12L14 14" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path v-else d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </span>
            <span class="text-lg font-medium">Invoice #{{ invoice.invoice_number }} -
              {{ capitalizeFirstLetter(invoice.status) }}</span>
          </div>
          <div class="flex gap-2">
            <button v-if="invoice.status === 'pending' || invoice.status === 'overdue'"
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-green-600 hover:bg-green-700 shadow-theme-xs transition-colors duration-200"
              @click="updateInvoiceStatus('paid')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Mark as Paid
            </button>
            <button v-if="invoice.status === 'pending'"
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-red-600 hover:bg-red-700 shadow-theme-xs transition-colors duration-200"
              @click="updateInvoiceStatus('cancelled')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Cancel Invoice
            </button>
            <button
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 hover:border-green-700 dark:bg-green-600 dark:border-green-600 dark:hover:bg-green-700 dark:hover:border-green-700 transition-colors duration-200"
              @click="previewPDF">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                </path>
              </svg>
              📄 Preview PDF
            </button>
            <!-- <button
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors duration-200"
              @click="downloadInvoice">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                </path>
              </svg>
              Download PDF (Direct)
            </button> -->
            <button
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 shadow-theme-xs disabled:bg-brand-300 transition-colors duration-200"
              @click="sendInvoice">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              Send Invoice
            </button>
          </div>
        </div>
      </div>

      <!-- Invoice Details -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
        <!-- Invoice Summary -->
        <div class="md:col-span-1">
          <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Invoice Summary
            </h4>
            <div class="mb-4">
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Invoice Number:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ invoice.invoice_number }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Amount:</span>
                <span class="text-sm font-medium text-black dark:text-white">IDR {{ formatPrice(invoice.total) }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Issue Date:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ formatDate(invoice.issue_date) }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Due Date:</span>
                <span class="text-sm font-medium text-black dark:text-white">{{ formatDate(invoice.due_date) }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                <span class="text-sm font-medium px-2 py-1 rounded" :class="getStatusClass(invoice.status)">
                  {{ capitalizeFirstLetter(invoice.status) }}
                </span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Payment Date:</span>
                <span
                  class="text-sm font-medium text-black dark:text-white">{{ invoice.payment_date ? formatDate(invoice.payment_date) : 'Not paid yet' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Created:</span>
                <span
                  class="text-sm font-medium text-black dark:text-white">{{ formatDateTime(invoice.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Customer Information
            </h4>
            <div class="customer-info-section">
              <div v-if="invoice.customer_name" class="mb-3">
                <span class="text-sm text-gray-500 dark:text-gray-400">Customer:</span>
                <div class="customer-name text-sm font-medium text-black dark:text-white mt-1">{{ invoice.customer_name }}</div>
              </div>
              <div v-if="invoice.billing_address" class="mb-3">
                <span class="text-sm text-gray-500 dark:text-gray-400">Billing Address:</span>
                <div class="customer-address text-xs italic text-gray-600 dark:text-gray-400 mt-1">{{ invoice.billing_address }}</div>
              </div>
              <div v-if="!invoice.customer_name && !invoice.billing_address" class="text-center py-4">
                <p class="text-gray-500 dark:text-gray-400 text-sm italic">No customer information available.</p>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div v-if="invoice.status === 'paid'"
            class="mt-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Payment Information
            </h4>
            <div class="mb-4">
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Payment Method:</span>
                <span
                  class="text-sm font-medium text-black dark:text-white">{{ invoice.payment_method || 'N/A' }}</span>
              </div>
              <div class="mb-3 flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Transaction ID:</span>
                <span
                  class="text-sm font-medium text-black dark:text-white">{{ invoice.transaction_id || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Payment Date:</span>
                <span
                  class="text-sm font-medium text-black dark:text-white">{{ formatDateTime(invoice.payment_date) }}</span>
              </div>
            </div>
          </div>

          <!-- Invoice Notes -->
          <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 class="mb-4 text-xl font-semibold text-black dark:text-white">
              Invoice Notes
            </h4>

            <div v-if="invoice.notes" class="mb-6">
              <h5 class="mb-2 text-base font-medium text-black dark:text-white">Notes:</h5>
              <p class="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                {{ invoice.notes }}
              </p>
            </div>

            <div>
              <h5 class="mb-2 text-base font-medium text-black dark:text-white">Add Notes:</h5>
              <textarea v-model="invoiceNotes"
                class="w-full rounded border-stroke bg-gray-100 py-3 px-4 text-sm text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-gray-800 dark:text-white"
                rows="4" placeholder="Add notes about this invoice..."></textarea>
              <div class="flex justify-end mt-2">
                <button
                  class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 shadow-theme-xs disabled:bg-brand-300 transition-colors duration-200"
                  @click="saveNotes">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12">
                    </path>
                  </svg>
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Information -->
        <div class="md:col-span-2">
          <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
            <div class="flex justify-between items-center mb-6">
              <h4 class="text-xl font-semibold text-black dark:text-white">
                Booking Information
              </h4>
              <router-link :to="`/bookings/${booking.id}`" class="text-sm text-primary hover:underline">
                View Booking Details
              </router-link>
            </div>

            <div class="flex flex-col md:flex-row gap-4">
              <div class="md:w-1/3">
                <div class="h-40 w-full rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img v-if="booking.villa && booking.villa.image_url" :src="booking.villa.image_url"
                    :alt="booking.villa.name" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="text-gray-500 dark:text-gray-400">No image available</span>
                  </div>
                </div>
              </div>
              <div class="md:w-2/3">
                <div class="mb-3">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Booking ID:</span>
                  <span class="text-sm font-medium text-black dark:text-white ml-2">#{{ booking.id }}</span>
                </div>
                <div class="mb-3">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Guest:</span>
                  <span class="text-sm font-medium text-black dark:text-white ml-2">{{ booking.guest_name }}</span>
                </div>
                <div class="mb-3">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Villa:</span>
                  <router-link v-if="booking.villa" :to="`/villas/${booking.villa.id}`"
                    class="text-sm text-primary hover:underline ml-2">
                    {{ booking.villa.name }}
                  </router-link>
                  <span v-else class="text-sm text-gray-500 dark:text-gray-400 ml-2">N/A</span>
                </div>
                <div class="mb-3">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Stay Period:</span>
                  <span class="text-sm font-medium text-black dark:text-white ml-2">
                    {{ formatDate(booking.check_in) }} - {{ formatDate(booking.check_out) }}
                  </span>
                </div>
                <div>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Booking Status:</span>
                  <span class="text-sm font-medium px-2 py-1 rounded ml-2"
                    :class="getBookingStatusClass(booking.status)">
                    {{ capitalizeFirstLetter(booking.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Invoice items -->
          <div
            class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Invoice Items
            </h4>

            <div v-if="!invoice.items || invoice.items.length === 0" class="text-center py-8">
              <p class="text-gray-500 dark:text-gray-400">No invoice items available.</p>
            </div>

            <div v-else>
              <!-- Items Table -->
              <div class="overflow-x-auto mb-6">
                <table class="w-full table-auto">
                  <thead>
                    <tr class="bg-gray-2 text-left dark:bg-meta-4">
                      <th class="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                        Package Name
                      </th>
                      <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Unit Price
                      </th>
                      <th class="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                        Discount
                      </th>
                      <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Line Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in invoice.items" :key="item.id">
                      <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p class="text-black dark:text-white">
                          {{ item.package_name || `Package #${item.package_id}` }}
                        </p>
                      </td>
                      <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p class="text-black dark:text-white">IDR {{ formatPrice(item.unit_price) }}</p>
                      </td>
                      <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p :class="item.discount > 0 ? 'text-red-600 dark:text-red-400' : 'text-black dark:text-white'">
                          IDR {{ formatPrice(item.discount) }}
                        </p>
                      </td>
                      <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p class="text-black dark:text-white">IDR {{ formatPrice(item.line_total) }}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Totals Section -->
              <div class="border-t border-stroke dark:border-strokedark pt-4">
                <div class="mb-3 flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Subtotal:</span>
                  <span class="text-sm font-medium text-black dark:text-white">IDR {{ formatPrice(subtotal) }}</span>
                </div>
                <div class="mb-3 flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Total Discount:</span>
                  <span class="text-sm font-medium text-red-600 dark:text-red-400">IDR
                    {{ formatPrice(totalDiscount) }}</span>
                </div>
                <div class="mb-3 flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Tax:</span>
                  <span class="text-sm font-medium text-black dark:text-white">IDR
                    {{ formatPrice(invoice.tax_total || 0) }}</span>
                </div>
                <div class="pt-3 border-t border-stroke dark:border-strokedark flex justify-between">
                  <span class="text-base font-semibold text-black dark:text-white">Total Amount:</span>
                  <span class="text-base font-semibold text-black dark:text-white">IDR
                    {{ formatPrice(invoice.total) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice History -->
      <div
        class="mt-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
          Invoice History
        </h4>

        <div v-if="invoiceHistory.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">No invoice history available.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="bg-gray-2 text-left dark:bg-meta-4">
                <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Date
                </th>
                <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Action
                </th>
                <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th class="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                  User
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(history, index) in invoiceHistory" :key="index">
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p class="text-black dark:text-white">{{ formatDateTime(history.timestamp) }}</p>
                </td>
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p class="text-black dark:text-white">{{ history.action }}</p>
                </td>
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <span class="inline-flex rounded px-2.5 py-1 text-xs font-medium"
                    :class="getStatusClass(history.status)">
                    {{ capitalizeFirstLetter(history.status) }}
                  </span>
                </td>
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p class="text-black dark:text-white">{{ history.user }}</p>
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
import AdminLayout from '../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue';
import { invoiceService, bookingService } from '../services/index.ts';
import { formatNumber } from '../utils/number-formatter.ts';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb
  },
  data() {
    return {
      loading: true,
      invoice: {
        status: '',
        invoice_number: '',
        amount: 0,
        issue_date: '',
        due_date: '',
        payment_date: '',
        created_at: '',
        notes: ''
      },
      booking: {
        status: '',
        id: '',
        guest_name: '',
        check_in: '',
        check_out: '',
        villa: null
      },
      invoiceHistory: [],
      invoiceNotes: ''
    };
  },
  computed: {
    subtotal() {
      if (!this.invoice.items || !Array.isArray(this.invoice.items)) {
        return 0;
      }
      return this.invoice.items.reduce((sum, item) => sum + (item.unit_price || 0), 0);
    },
    totalDiscount() {
      if (!this.invoice.items || !Array.isArray(this.invoice.items)) {
        return 0;
      }
      return this.invoice.items.reduce((sum, item) => sum + (item.discount || 0), 0);
    }
  },
  async created() {
    await this.fetchInvoiceData();
  },
  methods: {
    async fetchInvoiceData() {
      try {
        const invoiceId = this.$route.params.invoiceId;

        // Fetch invoice data with proper error handling
        const response = await invoiceService.getInvoice(invoiceId);
        console.log(response);

        // Defensive checking for wrapped response structure
        if (!response) {
          throw new Error('Invalid response structure from invoice service');
        }

        // Extract the actual invoice data from the wrapped response
        this.invoice = response;

        // Additional null checking before accessing invoice properties
        if (!this.invoice) {
          throw new Error('Invoice data is null or undefined');
        }

        // Set invoice notes with safe access
        this.invoiceNotes = this.invoice.notes || '';

        // Fetch booking data if booking_id is available
        if (this.invoice.booking_id) {
          try {
            const bookingResponse = await bookingService.getBookingById(this.invoice.booking_id);
            // Handle potential wrapped response from booking service
            this.booking = bookingResponse?.data || bookingResponse || {
              status: '',
              id: '',
              guest_name: '',
              check_in: '',
              check_out: '',
              villa: null
            };
          } catch (bookingError) {
            console.warn('Failed to fetch booking data:', bookingError);
            // Set default booking data to prevent template errors
            this.booking = {
              status: '',
              id: this.invoice.booking_id || '',
              guest_name: 'N/A',
              check_in: '',
              check_out: '',
              villa: null
            };
          }
        }

        // Fetch invoice history with defensive programming
        try {
          if (invoiceService && typeof invoiceService.getInvoiceHistory === 'function') {
            const historyResponse = await invoiceService.getInvoiceHistory(invoiceId);
            this.invoiceHistory = historyResponse?.items || [];
          } else {
            console.warn('getInvoiceHistory method not available');
            this.invoiceHistory = [];
          }
        } catch (historyError) {
          console.warn('Failed to fetch invoice history:', historyError);
          this.invoiceHistory = [];
        }
      } catch (error) {
        console.error('Error fetching invoice data:', error);
        // Initialize with safe default values to prevent template errors
        this.invoice = {
          status: 'unknown',
          invoice_number: 'N/A',
          amount: 0,
          total: 0,
          issue_date: '',
          due_date: '',
          payment_date: '',
          created_at: '',
          notes: ''
        };
        this.booking = {
          status: '',
          id: '',
          guest_name: 'N/A',
          check_in: '',
          check_out: '',
          villa: null
        };
        // Show error notification to user
        alert('Failed to load invoice data. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      if (price === null || price === undefined || price === '') {
        return '0.00';
      }

      const num = typeof price === 'string' ? parseFloat(price) : price;

      if (isNaN(num)) {
        return '0.00';
      }

      // Use formatNumber for comma separators, then ensure 2 decimal places
      const formatted = formatNumber(num);

      // If the number is a whole number, formatNumber won't include decimals
      // So we need to add .00 if there are no decimals
      if (!formatted.includes('.')) {
        return formatted + '.00';
      }

      // If it has decimals but only one digit, add another zero
      const parts = formatted.split('.');
      if (parts[1] && parts[1].length === 1) {
        return formatted + '0';
      }

      return formatted;
    },
    formatDate(dateString) {
      if (!dateString) return '';

      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    },
    formatDateTime(dateString) {
      if (!dateString) return '';

      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getDuration(checkIn, checkOut) {
      if (!checkIn || !checkOut) return 0;

      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    },
    capitalizeFirstLetter(string) {
      // Handle non-string inputs safely
      if (!string || typeof string !== 'string') return '';

      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    getStatusClass(status) {
      const statusMap = {
        'paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'overdue': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        'cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      };

      // Ensure status is a string before calling toLowerCase
      const statusStr = status && typeof status === 'string' ? status.toLowerCase() : '';
      return statusMap[statusStr] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    },
    getBookingStatusClass(status) {
      const statusMap = {
        'confirmed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        'completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      };

      return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    },
    async updateInvoiceStatus(status) {
      try {
        // Show confirmation dialog
        if (!confirm(`Are you sure you want to mark this invoice as ${status}?`)) {
          return;
        }

        // Check if invoice ID is available
        if (!this.invoice || !this.invoice.id) {
          alert('Invoice data not available');
          return;
        }

        this.loading = true;

        // Update invoice status - this returns InvoiceResponse (wrapped)
        const response = await invoiceService.updateInvoiceStatus(this.invoice.id, status);

        // Handle wrapped response
        if (response && response.data) {
          this.invoice = response.data;
        }

        // Refresh invoice data to ensure consistency
        await this.fetchInvoiceData();

        // Show success notification
        alert(`Invoice status updated to ${status}`);
      } catch (error) {
        console.error('Error updating invoice status:', error);
        // Show error notification
        alert('Failed to update invoice status');
      } finally {
        this.loading = false;
      }
    },
    async saveNotes() {
      try {
        // Check if invoice ID is available
        if (!this.invoice || !this.invoice.id) {
          alert('Invoice data not available');
          return;
        }

        this.loading = true;

        // Update invoice notes - this returns InvoiceResponse (wrapped)
        const response = await invoiceService.updateInvoiceNotes(this.invoice.id, this.invoiceNotes);

        // Handle wrapped response
        if (response && response.data) {
          this.invoice = response.data;
        }

        // Refresh invoice data to ensure consistency
        await this.fetchInvoiceData();

        // Show success notification
        alert('Notes saved successfully');
      } catch (error) {
        console.error('Error saving notes:', error);
        // Show error notification
        alert('Failed to save notes');
      } finally {
        this.loading = false;
      }
    },
    previewPDF() {
      // Navigate to PDF preview page
      if (!this.invoice || !this.invoice.id) {
        alert('Invoice data not available');
        return;
      }

      this.$router.push(`/invoices/${this.invoice.id}/preview`);
    },
    async downloadInvoice() {
      try {
        // Download invoice PDF directly
        await invoiceService.downloadInvoice(this.invoice.id);

        // Show success notification
        alert('Invoice downloaded successfully');
      } catch (error) {
        console.error('Error downloading invoice:', error);
        // Show error notification
        alert('Failed to download invoice');
      }
    },
    async sendInvoice() {
      try {
        // Show confirmation dialog
        if (!confirm('Are you sure you want to send this invoice to the guest?')) {
          return;
        }

        // Check if invoice ID is available
        if (!this.invoice || !this.invoice.id) {
          alert('Invoice data not available');
          return;
        }

        this.loading = true;

        // Send invoice - this returns InvoiceActionResponse
        const response = await invoiceService.sendInvoice(this.invoice.id);

        // Handle response
        if (response && response.success) {
          // If the response contains updated invoice data, use it
          if (response.invoice && response.invoice.data) {
            this.invoice = response.invoice.data;
          } else if (response.invoice) {
            this.invoice = response.invoice;
          }
        }

        // Refresh invoice data to ensure consistency
        await this.fetchInvoiceData();

        // Show success notification
        alert('Invoice sent successfully');
      } catch (error) {
        console.error('Error sending invoice:', error);

        // Extract error message from backend response
        let errorMessage = 'Failed to send invoice';

        // Try to get the detail message from various possible error response structures
        if (error.response && error.response.data && error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.data && error.data.detail) {
          errorMessage = error.data.detail;
        } else if (error.detail) {
          errorMessage = error.detail;
        } else if (error.message) {
          errorMessage = error.message;
        }

        // Show specific error notification
        alert(errorMessage);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
